import { NextRequest, NextResponse } from 'next/server';
import { AIProviderService, AIRefinementInput } from '@/lib/ai/provider';

export async function POST(req: NextRequest) {
  try {
    const body: AIRefinementInput = await req.json();

    if (!body.currentDocument || !body.instruction) {
      return NextResponse.json(
        { error: 'Missing required parameters: currentDocument and instruction are required.' },
        { status: 400 }
      );
    }

    const updatedDoc = await AIProviderService.refineDesign(body);
    return NextResponse.json({ success: true, document: updatedDoc });
  } catch (error: any) {
    console.error('API /ai/refine error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to refine design.' },
      { status: 500 }
    );
  }
}
