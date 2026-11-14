import { DesignDocument } from '../ddom/types';
import { AutonomousDesignEngine, GenerationInput } from './autonomousEngine';

export interface AIRefinementInput {
  currentDocument: DesignDocument;
  instruction: string;
  targetLayerId?: string;
}

export class AIProviderService {
  static async generateDesign(input: GenerationInput): Promise<DesignDocument> {
    const openaiKey = process.env.OPENAI_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    if (openaiKey) {
      try {
        const enhancedDoc = await this.generateWithOpenAI(input, openaiKey);
        if (enhancedDoc) return enhancedDoc;
      } catch (err) {
        console.warn('OpenAI error, fallback to Autonomous Engine:', err);
      }
    } else if (geminiKey) {
      try {
        const enhancedDoc = await this.generateWithGemini(input, geminiKey);
        if (enhancedDoc) return enhancedDoc;
      } catch (err) {
        console.warn('Gemini error, fallback to Autonomous Engine:', err);
      }
    }

    return AutonomousDesignEngine.generate(input);
  }

  static async refineDesign(input: AIRefinementInput): Promise<DesignDocument> {
    const { currentDocument, instruction, targetLayerId } = input;
    const doc = JSON.parse(JSON.stringify(currentDocument)) as DesignDocument;
    const instr = instruction.toLowerCase();

    const textMatch = instruction.match(/(?:change|set|rename|make)\s+(?:the\s+)?(?:text|name|title|heading|wordmark)\s+(?:to|as)?\s+["']?([^"'\n,.]+)["']?/i);
    if (textMatch) {
      const newText = textMatch[1].trim();
      const titleLayer = doc.layers.find((l) => l.type === 'text' && (l.id.includes('title') || l.id.includes('name') || l.id === targetLayerId));
      if (titleLayer && titleLayer.type === 'text') {
        titleLayer.text = newText;
        doc.title = `${newText} - Edited`;
      }
    }

    if (instr.includes('emerald') || instr.includes('green')) {
      doc.layers.forEach((l) => {
        if (l.type === 'shape' && (l.fill !== '#FFFFFF' && l.fill !== 'transparent')) l.fill = '#10B981';
        if (l.type === 'icon') l.color = '#10B981';
      });
    } else if (instr.includes('gold') || instr.includes('yellow') || instr.includes('luxury')) {
      doc.layers.forEach((l) => {
        if (l.type === 'shape' && (l.fill !== '#FFFFFF' && l.fill !== 'transparent')) l.fill = '#F59E0B';
        if (l.type === 'icon') l.color = '#F59E0B';
      });
    } else if (instr.includes('blue') || instr.includes('navy')) {
      doc.layers.forEach((l) => {
        if (l.type === 'shape' && (l.fill !== '#FFFFFF' && l.fill !== 'transparent')) l.fill = '#2563EB';
        if (l.type === 'icon') l.color = '#2563EB';
      });
    }

    if (instr.includes('larger') || instr.includes('bigger')) {
      doc.layers.forEach((l) => {
        if (l.type === 'text') l.fontSize = Math.round(l.fontSize * 1.25);
      });
    } else if (instr.includes('smaller') || instr.includes('decrease size')) {
      doc.layers.forEach((l) => {
        if (l.type === 'text') l.fontSize = Math.max(10, Math.round(l.fontSize * 0.8));
      });
    }

    if (instr.includes('dark background') || instr.includes('dark mode')) {
      doc.artboard.backgroundColor = '#0B0F19';
    } else if (instr.includes('white background') || instr.includes('light mode')) {
      doc.artboard.backgroundColor = '#FFFFFF';
    }

    doc.metadata.updatedAt = new Date().toISOString();
    return doc;
  }

  private static async generateWithOpenAI(input: GenerationInput, apiKey: string): Promise<DesignDocument | null> {
    return AutonomousDesignEngine.generate(input);
  }

  private static async generateWithGemini(input: GenerationInput, apiKey: string): Promise<DesignDocument | null> {
    return AutonomousDesignEngine.generate(input);
  }
}
