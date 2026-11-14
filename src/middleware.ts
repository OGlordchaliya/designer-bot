import { NextResponse, NextRequest } from 'next/server';
import { checkRateLimit } from '@/lib/security/validator';

// Blocked paths commonly probed by automated vulnerability scanners
const BLOCKED_PATH_PATTERNS = [
  /\/\.env/i,
  /\/\.git/i,
  /\/\.aws/i,
  /\/wp-(admin|login|content|includes)/i,
  /\/xmlrpc\.php/i,
  /\/phpinfo/i,
  /\/\.well-known\/(?!acme-challenge)/i,
  /\.\./, // Directory traversal
  /%2e%2e/i, // URL-encoded traversal
  /\/(etc\/passwd|win\.ini|boot\.ini)/i,
];

// SQL Injection heuristics in query strings
const SQLI_PATTERNS = [
  /union\s+select/i,
  /select\s+.*\s+from/i,
  /insert\s+into/i,
  /drop\s+table/i,
  /truncate\s+table/i,
  /--\s*$/,
  /;\s*drop\s+/i,
];

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const ip = request.ip || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';

  // 1. BLOCKED PATHS & PATH TRAVERSAL DEFENSE
  for (const pattern of BLOCKED_PATH_PATTERNS) {
    if (pattern.test(pathname)) {
      console.warn(`[SECURITY_BLOCKED_PATH] IP: ${ip} probed path: ${pathname}`);
      return new NextResponse('Access Denied: Malicious or restricted path pattern detected.', {
        status: 403,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
  }

  // 2. SQL INJECTION HEURISTIC DEFENSE IN QUERY PARAMS
  if (search) {
    const decodedSearch = decodeURIComponent(search);
    for (const pattern of SQLI_PATTERNS) {
      if (pattern.test(decodedSearch)) {
        console.warn(`[SECURITY_SQLI_BLOCKED] IP: ${ip} suspicious query: ${search}`);
        return new NextResponse('Access Denied: Suspicious query parameter pattern detected.', {
          status: 400,
          headers: { 'Content-Type': 'text/plain' },
        });
      }
    }
  }

  // 3. API RATE LIMITING
  if (pathname.startsWith('/api/')) {
    const isAiRoute = pathname.startsWith('/api/ai/');
    const limit = isAiRoute ? 30 : 120; // 30 AI generations/min, 120 requests/min for other APIs
    const windowMs = 60 * 1000; // 1 minute window

    const rateResult = checkRateLimit(`${ip}:${isAiRoute ? 'ai' : 'api'}`, limit, windowMs);

    if (!rateResult.allowed) {
      console.warn(`[RATE_LIMIT_EXCEEDED] IP: ${ip} on route ${pathname}`);
      return NextResponse.json(
        {
          error: 'Rate limit exceeded. Too many requests. Please try again shortly.',
          success: false,
          retryAfterSeconds: Math.ceil((rateResult.resetTime - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateResult.resetTime - Date.now()) / 1000)),
            'X-RateLimit-Limit': String(limit),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(rateResult.resetTime),
          },
        }
      );
    }
  }

  // 4. PREPARE RESPONSE WITH RIGOROUS SECURITY HEADERS
  const response = NextResponse.next();

  // Content Security Policy
  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https://api.openai.com https://generativelanguage.googleapis.com https://*.supabase.co",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');

  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), browsing-topics=()');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

  return response;
}

// Apply middleware to all routes except Next.js internals and static assets
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
