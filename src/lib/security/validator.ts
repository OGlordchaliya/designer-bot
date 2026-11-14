import { NextRequest, NextResponse } from 'next/server';

export const VALID_CATEGORIES = ['logo', 'letterhead', 'stationery', 'website', 'social', 'brand'] as const;
export type ValidCategory = (typeof VALID_CATEGORIES)[number];

// Prompt injection heuristic patterns
const SUSPICIOUS_PROMPT_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior)\s+instructions/i,
  /you\s+are\s+now\s+(an?\s+)?unrestricted/i,
  /system\s+prompt\s*:/i,
  /reveal\s+(your|the)\s+(system|api|secret|key)/i,
  /<\s*script[^>]*>/i,
  /javascript\s*:/i,
  /data:text\/html/i,
  /on(error|load|click|mouseover)\s*=/i,
];

export class SecurityValidator {
  /**
   * Sanitizes generic text input by trimming, stripping null bytes and dangerous control characters.
   */
  static sanitizeString(input: unknown, maxLength = 500): string {
    if (typeof input !== 'string') return '';
    // Strip null bytes and control chars (except standard whitespace and newline)
    const cleaned = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();
    return cleaned.slice(0, maxLength);
  }

  /**
   * Validates and sanitizes prompt input for AI processing.
   */
  static validatePrompt(rawPrompt: unknown): { isValid: boolean; sanitized: string; error?: string } {
    if (!rawPrompt || typeof rawPrompt !== 'string') {
      return { isValid: false, sanitized: '', error: 'Prompt must be a non-empty string.' };
    }

    const sanitized = this.sanitizeString(rawPrompt, 2000);
    if (sanitized.length < 2) {
      return { isValid: false, sanitized: '', error: 'Prompt is too short (minimum 2 characters required).' };
    }

    for (const pattern of SUSPICIOUS_PROMPT_PATTERNS) {
      if (pattern.test(sanitized)) {
        return {
          isValid: false,
          sanitized: '',
          error: 'Security alert: Prompt contains disallowed or unsafe instruction patterns.',
        };
      }
    }

    return { isValid: true, sanitized };
  }

  /**
   * Validates that the provided category is within the permitted enum.
   */
  static isValidCategory(category: unknown): category is ValidCategory {
    return typeof category === 'string' && VALID_CATEGORIES.includes(category as ValidCategory);
  }

  /**
   * Escapes HTML special characters to prevent Reflected and Stored Cross-Site Scripting (XSS).
   */
  static escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Validates request size against a maximum byte threshold (default: 2MB).
   */
  static async validatePayloadSize(req: NextRequest, maxBytes = 2 * 1024 * 1024): Promise<boolean> {
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > maxBytes) {
      return false;
    }
    return true;
  }

  /**
   * Safe error responder that logs internal details while returning a sanitized client-safe response.
   */
  static safeErrorResponse(error: unknown, fallbackMessage = 'An unexpected error occurred.', status = 500) {
    // Log complete error server-side for observability
    console.error('[SECURITY_AUDIT_LOG]', error);

    // Return sanitized message, never exposing stack traces or environment variables
    const message = error instanceof Error && !error.message.includes('API_KEY') && !error.message.includes('password')
      ? error.message
      : fallbackMessage;

    return NextResponse.json({ error: message, success: false }, { status });
  }

  /**
   * Validates origin / referer to prevent Cross-Site Request Forgery (CSRF).
   */
  static validateOrigin(req: NextRequest): boolean {
    const origin = req.headers.get('origin');
    const host = req.headers.get('host');
    if (!origin || !host) return true; // Standard same-origin or non-browser client

    try {
      const originHost = new URL(origin).host;
      return originHost === host || originHost.endsWith('.vercel.app') || originHost.startsWith('localhost:');
    } catch {
      return false;
    }
  }
}

// In-Memory Sliding-Window Rate Limiter
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Periodic cleanup every 5 minutes to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    rateLimitStore.forEach((record, key) => {
      if (now > record.resetTime) {
        rateLimitStore.delete(key);
      }
    });
  }, 300000);
}

export function checkRateLimit(
  identifier: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const existing = rateLimitStore.get(identifier);

  if (!existing || now > existing.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetTime: now + windowMs };
  }

  if (existing.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: existing.resetTime };
  }

  existing.count += 1;
  return { allowed: true, remaining: maxRequests - existing.count, resetTime: existing.resetTime };
}
