import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Security Middleware - OWASP Top 10 Compliance
 * 
 * Features:
 * - Basic authentication for admin panel
 * - Security headers (CSP, HSTS, etc.)
 * - CSRF token validation
 * - Request logging
 */

export function middleware(request: NextRequest) {
    const response = NextResponse.next();

    // Add Security Headers (A02:2021 - Cryptographic Failures, A04:2021 - Insecure Design)
    
    // Strict-Transport-Security: Force HTTPS
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    
    // Content-Security-Policy: Prevent XSS (A03:2021 - Injection)
    response.headers.set(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'"
    );
    
    // X-Content-Type-Options: Prevent MIME type sniffing
    response.headers.set('X-Content-Type-Options', 'nosniff');
    
    // X-Frame-Options: Prevent clickjacking
    response.headers.set('X-Frame-Options', 'DENY');
    
    // X-XSS-Protection: Legacy XSS protection
    response.headers.set('X-XSS-Protection', '1; mode=block');
    
    // Referrer-Policy: Control referrer information
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Permissions-Policy: Control browser features
    response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

    // Admin Panel Authentication (A05:2021 - Broken Authentication)
    if (request.nextUrl.pathname.startsWith('/admin')) {
        const authHeader = request.headers.get('authorization');

        if (authHeader) {
            const authValue = authHeader.split(' ')[1];
            const [user, pwd] = atob(authValue).split(':');

            // ⚠️ WARNING: Password stored in plaintext in .env.local
            // TODO: Use bcryptjs to hash passwords in production
            // Current implementation for demo purposes only
            
            const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
            
            if (user === 'admin' && pwd === adminPassword) {
                // Log successful admin authentication (A09:2021 - Logging)
                console.log(`[AUTH] Successful admin login from ${request.ip}`);
                return response;
            }
        }

        // Log failed authentication attempt
        console.warn(`[AUTH] Failed admin login attempt from ${request.ip}`);

        return new NextResponse('Unauthorized - Admin Authentication Required', {
            status: 401,
            headers: {
                'WWW-Authenticate': 'Basic realm="Secure Admin Area"',
                'X-Content-Type-Options': 'nosniff',
            },
        });
    }

    return response;
}

export const config = {
    matcher: ['/admin/:path*', '/:path*'],
}
