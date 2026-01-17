import * as jose from 'jose';

const encoder = new TextEncoder();

export interface JWTPayload {
    id: number;
    username: string;
    email: string;
    level: string;
    type: 'admin' | 'siswa';
}

export async function sign(payload: JWTPayload, secret: string, expiresIn: string = '7d'): Promise<string> {
    const secretKey = encoder.encode(secret);

    const token = await new jose.SignJWT(payload as unknown as jose.JWTPayload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(expiresIn)
        .sign(secretKey);

    return token;
}

export async function verify(token: string, secret: string): Promise<JWTPayload> {
    const secretKey = encoder.encode(secret);

    const { payload } = await jose.jwtVerify(token, secretKey);

    return payload as unknown as JWTPayload;
}

// Simple password hashing using SHA-1 (matching PHP's sha1)
export async function hashPassword(password: string): Promise<string> {
    const msgBuffer = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    const passwordHash = await hashPassword(password);
    return passwordHash === hash;
}

// Generate random code
export function generateCode(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const randomValues = new Uint8Array(length);
    crypto.getRandomValues(randomValues);
    for (let i = 0; i < length; i++) {
        result += chars[randomValues[i] % chars.length];
    }
    return result;
}
