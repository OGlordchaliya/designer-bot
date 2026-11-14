import { NextRequest, NextResponse } from 'next/server';
import { DesignDocument } from '@/lib/ddom/types';

const inMemoryProjects = new Map<string, DesignDocument>();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (id) {
    const project = inMemoryProjects.get(id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, project });
  }

  const all = Array.from(inMemoryProjects.values());
  return NextResponse.json({ success: true, projects: all });
}

export async function POST(req: NextRequest) {
  try {
    const project: DesignDocument = await req.json();
    if (!project.id || !project.title) {
      return NextResponse.json({ error: 'Invalid project payload.' }, { status: 400 });
    }
    inMemoryProjects.set(project.id, project);
    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }
  inMemoryProjects.delete(id);
  return NextResponse.json({ success: true });
}
