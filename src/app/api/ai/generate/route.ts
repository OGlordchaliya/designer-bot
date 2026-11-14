import { NextRequest, NextResponse } from 'next/server';
import { AIProviderService } from '@/lib/ai/provider';
import { GenerationInput } from '@/lib/ai/autonomousEngine';
import { SecurityValidator } from '@/lib/security/validator';

export async function POST(req: NextRequest) {
  try {
    // 1. Origin & CSRF Check
    if (!SecurityValidator.validateOrigin(req)) {
      return NextResponse.json({ error: 'Forbidden: Invalid request origin.' }, { status: 403 });
    }

    // 2. Payload size check
    const isSizeOk = await SecurityValidator.validatePayloadSize(req, 1024 * 1024); // 1MB max
    if (!isSizeOk) {
      return NextResponse.json({ error: 'Payload too large. Maximum size is 1MB.' }, { status: 413 });
    }

    let body: Partial<GenerationInput>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Malformed JSON payload.' }, { status: 400 });
    }

    // 3. Mandatory parameters check
    if (!body || !body.prompt || !body.category) {
      return NextResponse.json(
        { error: 'Missing required parameters: prompt and category are mandatory.' },
        { status: 400 }
      );
    }

    // 4. Validate and sanitize prompt
    const promptValidation = SecurityValidator.validatePrompt(body.prompt);
    if (!promptValidation.isValid) {
      return NextResponse.json({ error: promptValidation.error }, { status: 400 });
    }

    // 5. Validate category against whitelist
    if (!SecurityValidator.isValidCategory(body.category)) {
      return NextResponse.json(
        { error: `Invalid category. Allowed categories: logo, letterhead, stationery, website, social, brand.` },
        { status: 400 }
      );
    }

    // 6. Sanitize secondary fields
    const sanitizedInput: GenerationInput = {
      prompt: promptValidation.sanitized,
      category: body.category,
      subcategory: body.subcategory,
      companyName: SecurityValidator.sanitizeString(body.companyName, 120),
      tagline: SecurityValidator.sanitizeString(body.tagline, 250),
      industry: SecurityValidator.sanitizeString(body.industry, 100),
      stylePreference: SecurityValidator.sanitizeString(body.stylePreference, 100),
      accentColor: SecurityValidator.sanitizeString(body.accentColor, 30),
      conceptIndex: typeof body.conceptIndex === 'number' ? body.conceptIndex : undefined,
      brandKit: body.brandKit,
    };

    const doc = await AIProviderService.generateDesign(sanitizedInput);
    return NextResponse.json({ success: true, document: doc });
  } catch (error: unknown) {
    return SecurityValidator.safeErrorResponse(error, 'Failed to synthesize design due to an internal error.');
  }
}
