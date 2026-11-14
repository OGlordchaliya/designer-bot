'use client';

import React, { useState } from 'react';
import { Sparkles, Send, Bot, RefreshCw, Lightbulb } from 'lucide-react';
import { DesignDocument } from '@/lib/ddom/types';
import { AIProviderService } from '@/lib/ai/provider';

interface AICopilotPanelProps {
  document: DesignDocument;
  onApplyDocumentUpdate: (updatedDoc: DesignDocument) => void;
  onClose?: () => void;
}

export const AICopilotPanel: React.FC<AICopilotPanelProps> = ({
  document: doc,
  onApplyDocumentUpdate,
}) => {
  const [instruction, setInstruction] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<Array<{ sender: 'user' | 'assistant'; text: string }>>([
    {
      sender: 'assistant',
      text: `Hello! I'm your AI Creative Intelligence Copilot. Tell me how you'd like to refine this design—I can modify typography, colors, layout scales, and branding copy in real time.`,
    },
  ]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || instruction;
    if (!textToSend.trim() || isProcessing) return;

    const userMsg = textToSend.trim();
    setHistory((prev) => [...prev, { sender: 'user', text: userMsg }]);
    if (!customPrompt) setInstruction('');
    setIsProcessing(true);

    try {
      const updatedDoc = await AIProviderService.refineDesign({
        currentDocument: doc,
        instruction: userMsg,
      });

      onApplyDocumentUpdate(updatedDoc);

      setHistory((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: `Done! I've updated the canvas according to "${userMsg}". You can keep fine-tuning or use the drag-and-drop handles directly.`,
        },
      ]);
    } catch (e) {
      setHistory((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: `I encountered an issue applying that instruction. Please try again.`,
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const quickPrompts = [
    'Apply emerald green & dark slate theme',
    'Switch to luxury gold accents',
    'Make the headline larger',
    'Switch to light background mode',
  ];

  return (
    <aside className="w-84 bg-slate-900 border-l border-slate-800 flex flex-col z-20 select-none shadow-2xl">
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">AI Creative Copilot</h3>
            <p className="text-[10px] text-slate-400">Conversational Design Refinement</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs">
        {history.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start space-x-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-5 h-5 rounded-md bg-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3 h-3 text-white" />
              </div>
            )}
            <div
              className={`p-2.5 rounded-xl max-w-[85%] leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex items-center space-x-2 text-indigo-400 text-xs">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Analyzing design rules & updating layers...</span>
          </div>
        )}
      </div>

      <div className="p-2 border-t border-slate-800/80 bg-slate-950/20">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1 mb-1.5 flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-400" /> Quick Revisions
        </span>
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map((qp) => (
            <button
              key={qp}
              onClick={() => handleSend(qp)}
              disabled={isProcessing}
              className="text-[10px] bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white px-2 py-1 rounded-md border border-slate-700/80 transition"
            >
              {qp}
            </button>
          ))}
        </div>
      </div>

      <div className="p-3 border-t border-slate-800 bg-slate-950/40">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            placeholder="Instruct AI: 'Make title Sovereign Tech'..."
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            disabled={isProcessing}
            className="w-full bg-slate-800 text-xs text-white pl-3 pr-9 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!instruction.trim() || isProcessing}
            className="absolute right-2 p-1.5 rounded-lg bg-indigo-600 text-white disabled:opacity-40 hover:bg-indigo-500 transition"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </aside>
  );
};
