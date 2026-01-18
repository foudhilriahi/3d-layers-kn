// Validation utilities for OWASP Top 10 compliance

/**
 * Validates full name - letters only (with accents), spaces, and hyphens
 * Prevents XSS and injection attacks
 */
export function validateFullName(name: string): { valid: boolean; error?: string } {
    if (!name || typeof name !== 'string') {
        return { valid: false, error: "Full name is required" };
    }

    const trimmedName = name.trim();

    // Check length (min 3, max 100)
    if (trimmedName.length < 3 || trimmedName.length > 100) {
        return { valid: false, error: "Full name must be between 3 and 100 characters" };
    }

    // Only letters (including accented), spaces, and hyphens
    const nameRegex = /^[a-zA-Z\s\-àâäéèêëïîôöùûüœæÀÂÄÉÈÊËÏÎÔÖÙÛÜŒÆ]+$/;
    if (!nameRegex.test(trimmedName)) {
        return { valid: false, error: "Full name can only contain letters, spaces, and hyphens" };
    }

    // Check for multiple consecutive spaces
    if (/\s{2,}/.test(trimmedName)) {
        return { valid: false, error: "Multiple consecutive spaces are not allowed" };
    }

    // Check for suspicious patterns (SQL injection attempts)
    const suspiciousPatterns = [
        /(\bor\b|\band\b|\b--\b|\b;\b|\/\*|\*\/|\b(select|insert|update|delete|drop|union|exec|script)\b)/gi,
    ];

    for (const pattern of suspiciousPatterns) {
        if (pattern.test(trimmedName)) {
            return { valid: false, error: "Invalid characters detected" };
        }
    }

    return { valid: true };
}

/**
 * Validates email - prevents XSS and injection
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
    if (!email || typeof email !== 'string') {
        return { valid: false, error: "Email is required" };
    }

    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
        return { valid: false, error: "Invalid email format" };
    }

    if (trimmedEmail.length > 254) {
        return { valid: false, error: "Email is too long" };
    }

    return { valid: true };
}

/**
 * Validates phone number
 */
export function validatePhone(phone: string): { valid: boolean; error?: string } {
    if (!phone || typeof phone !== 'string') {
        return { valid: false, error: "Phone is required" };
    }

    // Must be exactly "+216 " + 8 digits = 13 characters
    if (phone.length !== 13) {
        return { valid: false, error: "Invalid phone format" };
    }

    if (!phone.startsWith("+216 ")) {
        return { valid: false, error: "Phone must start with +216" };
    }

    const digits = phone.slice(5);
    if (!/^\d{8}$/.test(digits)) {
        return { valid: false, error: "Phone must contain 8 digits after +216" };
    }

    // Valid Tunisian mobile/landline prefixes: 2, 4, 5, 7, 9
    const firstDigit = digits[0];
    if (!['2', '4', '5', '7', '9'].includes(firstDigit)) {
        return { valid: false, error: "Invalid Tunisian phone number" };
    }

    // Blacklist obvious fake numbers
    const sequences = [
        "12345678", "87654321", "00000000", "11111111", "22222222",
        "33333333", "44444444", "55555555", "66666666", "77777777",
        "88888888", "99999999"
    ];
    if (sequences.includes(digits)) {
        return { valid: false, error: "Phone number appears invalid" };
    }

    return { valid: true };
}

/**
 * Sanitizes string input to prevent XSS attacks
 * Escapes HTML special characters
 */
export function sanitizeInput(input: string): string {
    if (!input || typeof input !== 'string') {
        return '';
    }

    const htmlEscapeMap: { [key: string]: string } = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;'
    };

    return input
        .trim()
        .replace(/[&<>"'\/]/g, (char) => htmlEscapeMap[char] || char)
        .slice(0, 1000); // Limit length
}

/**
 * Validates address to prevent injection
 */
export function validateAddress(address: string): { valid: boolean; error?: string } {
    if (!address || typeof address !== 'string') {
        return { valid: false, error: "Address is required" };
    }

    const trimmedAddress = address.trim();

    if (trimmedAddress.length < 5 || trimmedAddress.length > 255) {
        return { valid: false, error: "Address must be between 5 and 255 characters" };
    }

    // Allow alphanumeric, spaces, and common address characters
    const addressRegex = /^[a-zA-Z0-9\s,.\-'àâäéèêëïîôöùûüœæÀÂÄÉÈÊËÏÎÔÖÙÛÜŒÆ()]+$/;
    if (!addressRegex.test(trimmedAddress)) {
        return { valid: false, error: "Address contains invalid characters" };
    }

    return { valid: true };
}

/**
 * Validates product ID (UUID format or simple alphanumeric ID)
 */
export function validateProductId(id: string): { valid: boolean; error?: string } {
    if (!id || typeof id !== 'string') {
        return { valid: false, error: "Product ID is required" };
    }

    const trimmedId = id.trim();

    // Check length (1-50 characters)
    if (trimmedId.length < 1 || trimmedId.length > 50) {
        return { valid: false, error: "Invalid product ID length" };
    }

    // Allow UUID v4 format OR simple alphanumeric IDs (like 'p1', 'o1', 'v1')
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const simpleIdRegex = /^[a-zA-Z0-9_-]+$/;

    if (!uuidRegex.test(trimmedId) && !simpleIdRegex.test(trimmedId)) {
        return { valid: false, error: "Invalid product ID format" };
    }

    return { valid: true };
}

/**
 * Validates quantity (must be positive integer)
 */
export function validateQuantity(quantity: unknown): { valid: boolean; error?: string } {
    const num = Number(quantity);

    if (!Number.isInteger(num) || num < 1 || num > 1000) {
        return { valid: false, error: "Quantity must be between 1 and 1000" };
    }

    return { valid: true };
}

/**
 * Rate limiting check (basic implementation)
 */
export class RateLimiter {
    private attempts: Map<string, number[]> = new Map();
    private maxAttempts: number;
    private windowMs: number;

    constructor(maxAttempts: number = 10, windowMs: number = 60000) {
        this.maxAttempts = maxAttempts;
        this.windowMs = windowMs;
    }

    isAllowed(identifier: string): boolean {
        const now = Date.now();
        const attempts = this.attempts.get(identifier) || [];

        // Remove old attempts outside the window
        const recentAttempts = attempts.filter(time => now - time < this.windowMs);

        if (recentAttempts.length >= this.maxAttempts) {
            return false;
        }

        recentAttempts.push(now);
        this.attempts.set(identifier, recentAttempts);

        return true;
    }

    reset(identifier: string): void {
        this.attempts.delete(identifier);
    }
}
