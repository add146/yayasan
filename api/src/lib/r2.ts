import { Context } from 'hono';
import { Env } from '../index';

export interface UploadResult {
    success: boolean;
    key?: string;
    url?: string;
    error?: string;
}

export async function uploadFile(
    c: Context<{ Bindings: Env }>,
    file: File,
    folder: string = 'uploads'
): Promise<UploadResult> {
    try {
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 15);
        const ext = file.name.split('.').pop() || 'bin';
        const key = `${folder}/${timestamp}_${randomStr}.${ext}`;

        const arrayBuffer = await file.arrayBuffer();

        await c.env.R2.put(key, arrayBuffer, {
            httpMetadata: {
                contentType: file.type,
            },
        });

        return {
            success: true,
            key,
            url: `/api/upload/${key}`,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Upload failed',
        };
    }
}

export async function deleteFile(
    c: Context<{ Bindings: Env }>,
    key: string
): Promise<boolean> {
    try {
        await c.env.R2.delete(key);
        return true;
    } catch (error) {
        console.error('Delete file error:', error);
        return false;
    }
}

export async function getFile(
    c: Context<{ Bindings: Env }>,
    key: string
): Promise<R2ObjectBody | null> {
    try {
        return await c.env.R2.get(key);
    } catch (error) {
        console.error('Get file error:', error);
        return null;
    }
}

// Allowed file types
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const ALLOWED_DOC_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function validateFile(file: File, allowedTypes: string[], maxSize: number = MAX_FILE_SIZE): string | null {
    if (!allowedTypes.includes(file.type)) {
        return `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`;
    }

    if (file.size > maxSize) {
        return `File too large. Maximum size: ${maxSize / 1024 / 1024}MB`;
    }

    return null;
}
