import { NextRequest, NextResponse } from 'next/server';
import { AIProviderService } from '@/lib/ai/provider';
import { GenerationInput } from '@/lib/ai/autonomousEngine';

export async function POST(req: NextRequest) {
  try {
    const body: GenerationInput = await req.json();

    if (!body.prompt || !body.category) {
      return NextResponse.json(
        { error: 'Missing required parameters: prompt and category are mandatory.' },
        { status: 400 }
      );
    }

    const doc = await AIProviderService.generateDesign(body);
    return NextResponse.json({ success: true, document: doc });
  } catch (error: any) {
    console.error('API /ai/generate error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to synthesize design.' },
      { status: 500 }
    );
  }
}
