import { NextRequest, NextResponse } from 'next/server';
import { DesignDocument } from '@/lib/ddom/types';
import { SecurityValidator } from '@/lib/security/validator';

const inMemoryProjects = new Map<string, DesignDocument>();

// Whitelist regex for project ID (UUID or safe alphanumeric ID)
const SAFE_ID_REGEX = /^[a-zA-Z0-9_-]{1,64}$/;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      if (!SAFE_ID_REGEX.test(id)) {
        return NextResponse.json({ error: 'Invalid project ID format.' }, { status: 400 });
      }

      const project = inMemoryProjects.get(id);
      if (!project) {
        return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
      }
      return NextResponse.json({ success: true, project });
    }

    const all = Array.from(inMemoryProjects.values());
    return NextResponse.json({ success: true, projects: all });
  } catch (error: unknown) {
    return SecurityValidator.safeErrorResponse(error, 'Failed to fetch projects.');
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!SecurityValidator.validateOrigin(req)) {
      return NextResponse.json({ error: 'Forbidden: Invalid request origin.' }, { status: 403 });
    }

    const isSizeOk = await SecurityValidator.validatePayloadSize(req, 2 * 1024 * 1024);
    if (!isSizeOk) {
      return NextResponse.json({ error: 'Payload too large. Maximum size is 2MB.' }, { status: 413 });
    }

    let project: Partial<DesignDocument>;
    try {
      project = await req.json();
    } catch {
      return NextResponse.json({ error: 'Malformed JSON payload.' }, { status: 400 });
    }

    if (!project || !project.id || !project.title || !SAFE_ID_REGEX.test(project.id)) {
      return NextResponse.json({ error: 'Invalid project payload or invalid project ID.' }, { status: 400 });
    }

    // Sanitize title and metadata
    project.title = SecurityValidator.sanitizeString(project.title, 120);
    if (project.category && !SecurityValidator.isValidCategory(project.category)) {
      return NextResponse.json({ error: 'Invalid design category.' }, { status: 400 });
    }

    inMemoryProjects.set(project.id, project as DesignDocument);
    return NextResponse.json({ success: true, project });
  } catch (error: unknown) {
    return SecurityValidator.safeErrorResponse(error, 'Failed to save project.');
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!SecurityValidator.validateOrigin(req)) {
      return NextResponse.json({ error: 'Forbidden: Invalid request origin.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id || !SAFE_ID_REGEX.test(id)) {
      return NextResponse.json({ error: 'Missing or invalid project ID format.' }, { status: 400 });
    }

    inMemoryProjects.delete(id);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return SecurityValidator.safeErrorResponse(error, 'Failed to delete project.');
  }
}
