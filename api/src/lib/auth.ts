import { Context, Next } from 'hono';
import { verify } from './jwt';
import { Env } from '../index';

export interface AuthUser {
    id: number;
    username: string;
    email: string;
    level: string;
    type: 'admin' | 'siswa';
}

export async function authMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
    const authHeader = c.req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return c.json({
            success: false,
            message: 'Unauthorized - Token required',
        }, 401);
    }

    const token = authHeader.substring(7);

    try {
        const payload = await verify(token, c.env.JWT_SECRET);
        c.set('user', payload as AuthUser);
        await next();
    } catch (error) {
        return c.json({
            success: false,
            message: 'Unauthorized - Invalid token',
        }, 401);
    }
}

export async function adminMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
    const user = c.get('user') as AuthUser;

    if (!user || user.type !== 'admin') {
        return c.json({
            success: false,
            message: 'Forbidden - Admin access required',
        }, 403);
    }

    await next();
}
