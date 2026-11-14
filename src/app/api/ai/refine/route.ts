import { NextRequest, NextResponse } from 'next/server';
import { AIProviderService, AIRefinementInput } from '@/lib/ai/provider';
import { SecurityValidator } from '@/lib/security/validator';

export async function POST(req: NextRequest) {
  try {
    // 1. Origin & CSRF Check
    if (!SecurityValidator.validateOrigin(req)) {
      return NextResponse.json({ error: 'Forbidden: Invalid request origin.' }, { status: 403 });
    }

    // 2. Payload size check
    const isSizeOk = await SecurityValidator.validatePayloadSize(req, 2 * 1024 * 1024); // 2MB max
    if (!isSizeOk) {
      return NextResponse.json({ error: 'Payload too large. Maximum size is 2MB.' }, { status: 413 });
    }

    let body: Partial<AIRefinementInput>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Malformed JSON payload.' }, { status: 400 });
    }

    if (!body || !body.currentDocument || !body.instruction) {
      return NextResponse.json(
        { error: 'Missing required parameters: currentDocument and instruction are required.' },
        { status: 400 }
      );
    }

    // 3. Validate instruction prompt
    const instructionValidation = SecurityValidator.validatePrompt(body.instruction);
    if (!instructionValidation.isValid) {
      return NextResponse.json({ error: instructionValidation.error }, { status: 400 });
    }

    // 4. Validate DDOM document structure
    if (!body.currentDocument.id || !Array.isArray(body.currentDocument.layers)) {
      return NextResponse.json(
        { error: 'Invalid currentDocument: must contain valid id and layers array.' },
        { status: 400 }
      );
    }

    const sanitizedInput: AIRefinementInput = {
      currentDocument: body.currentDocument,
      instruction: instructionValidation.sanitized,
    };

    const updatedDoc = await AIProviderService.refineDesign(sanitizedInput);
    return NextResponse.json({ success: true, document: updatedDoc });
  } catch (error: unknown) {
    return SecurityValidator.safeErrorResponse(error, 'Failed to refine design due to an internal error.');
  }
}
