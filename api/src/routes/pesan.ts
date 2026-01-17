import { Hono } from 'hono';
import { authMiddleware, adminMiddleware } from '../lib/auth';

type Bindings = {
    DB: D1Database;
};

const pesan = new Hono<{ Bindings: Bindings }>();

// Public - Submit message (no auth required)
pesan.post('/', async (c) => {
    try {
        const body = await c.req.json();

        if (!body.nama || !body.email || !body.pesan) {
            return c.json({ success: false, message: 'Nama, email, dan pesan harus diisi' }, 400);
        }

        const result = await c.env.DB.prepare(`
            INSERT INTO pesan_kontak (nama, email, pesan, status, tanggal_kirim)
            VALUES (?, ?, ?, 'Belum Dibaca', datetime('now'))
        `).bind(body.nama, body.email, body.pesan).run();

        return c.json({
            success: true,
            message: 'Pesan berhasil dikirim',
            data: { id_pesan: result.meta.last_row_id }
        });
    } catch (error) {
        console.error('Create pesan error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan pada server' }, 500);
    }
});

// Admin - Get all messages
pesan.get('/admin', authMiddleware, adminMiddleware, async (c) => {
    try {
        const result = await c.env.DB.prepare(`
            SELECT * FROM pesan_kontak
            ORDER BY tanggal_kirim DESC
        `).all();

        return c.json({
            success: true,
            data: result.results,
        });
    } catch (error) {
        console.error('Get pesan error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan pada server' }, 500);
    }
});

// Admin - Get single message
pesan.get('/:id', authMiddleware, adminMiddleware, async (c) => {
    try {
        const id = c.req.param('id');
        const result = await c.env.DB.prepare(`
            SELECT * FROM pesan_kontak WHERE id_pesan = ?
        `).bind(id).first();

        if (!result) {
            return c.json({ success: false, message: 'Pesan tidak ditemukan' }, 404);
        }

        // Mark as read
        await c.env.DB.prepare(`
            UPDATE pesan_kontak SET status = 'Sudah Dibaca' WHERE id_pesan = ?
        `).bind(id).run();

        return c.json({
            success: true,
            data: { ...result, status: 'Sudah Dibaca' },
        });
    } catch (error) {
        console.error('Get pesan detail error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan pada server' }, 500);
    }
});

// Admin - Update status
pesan.put('/:id/status', authMiddleware, adminMiddleware, async (c) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();

        await c.env.DB.prepare(`
            UPDATE pesan_kontak SET status = ? WHERE id_pesan = ?
        `).bind(body.status, id).run();

        return c.json({
            success: true,
            message: 'Status berhasil diperbarui',
        });
    } catch (error) {
        console.error('Update pesan status error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan pada server' }, 500);
    }
});

// Admin - Delete message
pesan.delete('/:id', authMiddleware, adminMiddleware, async (c) => {
    try {
        const id = c.req.param('id');
        await c.env.DB.prepare(`
            DELETE FROM pesan_kontak WHERE id_pesan = ?
        `).bind(id).run();

        return c.json({
            success: true,
            message: 'Pesan berhasil dihapus',
        });
    } catch (error) {
        console.error('Delete pesan error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan pada server' }, 500);
    }
});

export default pesan;
