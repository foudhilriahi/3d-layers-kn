/**
 * Security utilities for request handling
 * OWASP Top 10 compliance
 */

import crypto from 'crypto';

/**
 * CSRF Token Management
 * Prevents Cross-Site Request Forgery (A05:2021)
 */
export class CSRFManager {
    private tokens: Map<string, { token: string; createdAt: number }> = new Map();
    private tokenExpiry = 3600000; // 1 hour

    /**
     * Generate a new CSRF token
     */
    generateToken(sessionId: string): string {
        const token = crypto.randomBytes(32).toString('hex');
        this.tokens.set(sessionId, {
            token,
            createdAt: Date.now(),
        });
        return token;
    }

    /**
     * Verify a CSRF token
     */
    verifyToken(sessionId: string, token: string): boolean {
        const stored = this.tokens.get(sessionId);

        if (!stored) {
            return false;
        }

        // Check expiry
        if (Date.now() - stored.createdAt > this.tokenExpiry) {
            this.tokens.delete(sessionId);
            return false;
        }

        // Compare tokens
        const isValid = crypto.timingSafeEqual(
            Buffer.from(stored.token),
            Buffer.from(token)
        );

        if (isValid) {
            // Invalidate token after successful verification
            this.tokens.delete(sessionId);
        }

        return isValid;
    }

    /**
     * Clean up expired tokens
     */
    cleanup(): void {
        const now = Date.now();
        for (const [key, value] of this.tokens.entries()) {
            if (now - value.createdAt > this.tokenExpiry) {
                this.tokens.delete(key);
            }
        }
    }
}

/**
 * Request validation utilities
 */
export class RequestValidator {
    /**
     * Validate request origin
     * Prevents CSRF attacks
     */
    static validateOrigin(requestOrigin: string, allowedOrigins: string[]): boolean {
        return allowedOrigins.some(origin => {
            return origin === '*' || requestOrigin.endsWith(origin);
        });
    }

    /**
     * Get client IP from request
     * Handles X-Forwarded-For and X-Real-IP headers
     */
    static getClientIP(headers: Headers): string {
        const forwardedFor = headers.get('x-forwarded-for');
        if (forwardedFor) {
            return forwardedFor.split(',')[0].trim();
        }

        const realIP = headers.get('x-real-ip');
        if (realIP) {
            return realIP;
        }

        return 'unknown';
    }

    /**
     * Validate request method
     */
    static validateMethod(
        method: string,
        allowedMethods: string[]
    ): boolean {
        return allowedMethods.includes(method);
    }

    /**
     * Check for suspicious patterns in request
     */
    static isSuspicious(url: string, body?: string): boolean {
        const suspiciousPatterns = [
            /(\.\.\/)|(\.\.\\)/g, // Path traversal
            /(<script|javascript:|onerror|onload|onclick)/gi, // XSS attempts
            /(union.*select|select.*from|drop.*table|insert.*into|update.*set)/gi, // SQL injection
            /(exec|system|shell_exec|passthru)/gi, // Command injection
        ];

        const content = `${url} ${body || ''}`;

        for (const pattern of suspiciousPatterns) {
            if (pattern.test(content)) {
                return true;
            }
        }

        return false;
    }
}

/**
 * Response utilities for secure responses
 */
export class SecureResponse {
    /**
     * Send error response without exposing sensitive information
     */
    static error(message: string, status: number = 400) {
        return {
            error: message,
            timestamp: new Date().toISOString(),
        };
    }

    /**
     * Sanitize error message for client (removes sensitive data)
     */
    static sanitizeErrorMessage(error: unknown): string {
        if (error instanceof Error) {
            // Only return generic message to client
            return 'An error occurred while processing your request';
        }
        return 'An unexpected error occurred';
    }

    /**
     * Create a safe success response
     */
    static success(data: any, message: string = 'Success') {
        return {
            success: true,
            message,
            data,
            timestamp: new Date().toISOString(),
        };
    }
}

/**
 * Encryption utilities for sensitive data
 */
export class EncryptionUtils {
    private static algorithm = 'aes-256-gcm';

    /**
     * Encrypt sensitive data
     * TODO: Implement in production with proper key management
     */
    static encrypt(text: string, key: string): string {
        // This is a placeholder implementation
        // In production, use proper key management (e.g., AWS KMS, HashiCorp Vault)
        return Buffer.from(text).toString('base64');
    }

    /**
     * Decrypt sensitive data
     * TODO: Implement in production with proper key management
     */
    static decrypt(encrypted: string, key: string): string {
        // This is a placeholder implementation
        return Buffer.from(encrypted, 'base64').toString('utf-8');
    }

    /**
     * Hash sensitive data (one-way)
     * Use for passwords, security questions, etc.
     */
    static hashSensitive(text: string): string {
        // TODO: Use bcryptjs in production
        // For now, use simple hashing
        return crypto.createHash('sha256').update(text).digest('hex');
    }
}

/**
 * Audit logging utilities
 */
export class AuditLogger {
    /**
     * Log security-relevant events
     */
    static log(
        event: string,
        action: string,
        details: any,
        severity: 'INFO' | 'WARN' | 'ERROR' = 'INFO'
    ): void {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            event,
            action,
            details,
            severity,
        };

        // In production, send to a centralized logging service
        // For now, log to console
        if (severity === 'ERROR') {
            console.error(`[AUDIT-${severity}] ${event}:`, logEntry);
        } else if (severity === 'WARN') {
            console.warn(`[AUDIT-${severity}] ${event}:`, logEntry);
        } else {
            console.log(`[AUDIT-${severity}] ${event}:`, logEntry);
        }
    }

    /**
     * Log authentication event
     */
    static logAuth(
        success: boolean,
        userId: string,
        ip: string,
        details?: any
    ): void {
        this.log(
            'AUTHENTICATION',
            success ? 'LOGIN_SUCCESS' : 'LOGIN_FAILURE',
            { userId, ip, ...details },
            success ? 'INFO' : 'WARN'
        );
    }

    /**
     * Log data access
     */
    static logDataAccess(
        userId: string,
        resource: string,
        action: string,
        details?: any
    ): void {
        this.log(
            'DATA_ACCESS',
            action,
            { userId, resource, ...details },
            'INFO'
        );
    }

    /**
     * Log suspicious activity
     */
    static logSuspicious(
        event: string,
        ip: string,
        details?: any
    ): void {
        this.log(
            'SUSPICIOUS_ACTIVITY',
            event,
            { ip, ...details },
            'WARN'
        );
    }
}

/**
 * Session management utilities
 */
export class SessionManager {
    private sessions: Map<string, { userId: string; createdAt: number; lastActivity: number }> = new Map();
    private sessionTimeout = 30 * 60 * 1000; // 30 minutes

    /**
     * Create a new session
     */
    createSession(userId: string): string {
        const sessionId = crypto.randomBytes(32).toString('hex');
        this.sessions.set(sessionId, {
            userId,
            createdAt: Date.now(),
            lastActivity: Date.now(),
        });
        return sessionId;
    }

    /**
     * Verify session is valid and active
     */
    verifySession(sessionId: string): { valid: boolean; userId?: string } {
        const session = this.sessions.get(sessionId);

        if (!session) {
            return { valid: false };
        }

        const now = Date.now();

        // Check session timeout
        if (now - session.lastActivity > this.sessionTimeout) {
            this.sessions.delete(sessionId);
            return { valid: false };
        }

        // Update last activity
        session.lastActivity = now;

        return { valid: true, userId: session.userId };
    }

    /**
     * Invalidate session
     */
    invalidateSession(sessionId: string): void {
        this.sessions.delete(sessionId);
    }

    /**
     * Clean up expired sessions
     */
    cleanup(): void {
        const now = Date.now();
        for (const [key, value] of this.sessions.entries()) {
            if (now - value.lastActivity > this.sessionTimeout) {
                this.sessions.delete(key);
            }
        }
    }
}
