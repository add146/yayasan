import { Hono } from 'hono';
import { authMiddleware } from '../lib/auth';
import { uploadFile, getFile, deleteFile, validateFile, ALLOWED_IMAGE_TYPES, ALLOWED_DOC_TYPES } from '../lib/r2';
import { Env } from '../index';

const upload = new Hono<{ Bindings: Env }>();

// Upload file (requires auth)
upload.post('/', authMiddleware, async (c) => {
    try {
        const formData = await c.req.formData();
        const file = formData.get('file') as File;
        const folder = formData.get('folder') as string || 'uploads';
        const type = formData.get('type') as string || 'image'; // 'image' or 'document'

        if (!file) {
            return c.json({
                success: false,
                message: 'File harus diupload',
            }, 400);
        }

        // Validate file type
        const allowedTypes = type === 'document' ? ALLOWED_DOC_TYPES : ALLOWED_IMAGE_TYPES;
        const validationError = validateFile(file, allowedTypes);

        if (validationError) {
            return c.json({
                success: false,
                message: validationError,
            }, 400);
        }

        // Upload to R2
        const result = await uploadFile(c, file, folder);

        if (!result.success) {
            return c.json({
                success: false,
                message: result.error || 'Upload gagal',
            }, 500);
        }

        return c.json({
            success: true,
            message: 'File berhasil diupload',
            data: {
                key: result.key,
                url: result.url,
                filename: file.name,
                size: file.size,
                type: file.type,
            },
        });
    } catch (error) {
        console.error('Upload error:', error);
        return c.json({
            success: false,
            message: 'Terjadi kesalahan pada server',
        }, 500);
    }
});

// Get file (public)
upload.get('/*', async (c) => {
    try {
        const path = c.req.path.replace('/api/upload/', '');

        if (!path) {
            return c.json({
                success: false,
                message: 'Path tidak valid',
            }, 400);
        }

        const file = await getFile(c, path);

        if (!file) {
            return c.json({
                success: false,
                message: 'File tidak ditemukan',
            }, 404);
        }

        const headers = new Headers();
        headers.set('Content-Type', file.httpMetadata?.contentType || 'application/octet-stream');
        headers.set('Cache-Control', 'public, max-age=31536000');

        return new Response(file.body, { headers });
    } catch (error) {
        console.error('Get file error:', error);
        return c.json({
            success: false,
            message: 'Terjadi kesalahan pada server',
        }, 500);
    }
});

// Delete file (requires auth)
upload.delete('/*', authMiddleware, async (c) => {
    try {
        const path = c.req.path.replace('/api/upload/', '');

        if (!path) {
            return c.json({
                success: false,
                message: 'Path tidak valid',
            }, 400);
        }

        const success = await deleteFile(c, path);

        if (!success) {
            return c.json({
                success: false,
                message: 'Gagal menghapus file',
            }, 500);
        }

        return c.json({
            success: true,
            message: 'File berhasil dihapus',
        });
    } catch (error) {
        console.error('Delete file error:', error);
        return c.json({
            success: false,
            message: 'Terjadi kesalahan pada server',
        }, 500);
    }
});

export default upload;
