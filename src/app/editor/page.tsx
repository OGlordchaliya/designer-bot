'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AutonomousDesignEngine } from '@/lib/ai/autonomousEngine';
import { storage } from '@/lib/storage';

export default function EditorBlankRedirect() {
  const router = useRouter();

  useEffect(() => {
    const projects = storage.listProjects();
    if (projects.length > 0) {
      router.replace(`/editor/${projects[0].id}`);
    } else {
      const newDoc = AutonomousDesignEngine.generate({
        prompt: 'Minimalist modern logo for a cybersecurity startup called Aegis Shield',
        category: 'logo',
      });
      storage.saveProject(newDoc);
      router.replace(`/editor/${newDoc.id}`);
    }
  }, [router]);

  return (
    <div className="flex-1 flex items-center justify-center bg-slate-950 text-slate-400 text-xs">
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <span>Initializing Vector Canvas Workspace...</span>
      </div>
    </div>
  );
}
