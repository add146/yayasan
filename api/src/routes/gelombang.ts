import { Hono } from 'hono';
import { authMiddleware, adminMiddleware } from '../lib/auth';
import { Env } from '../index';

const gelombang = new Hono<{ Bindings: Env }>();

// Helper to create slug
function createSlug(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim();
}

// Get all gelombang
gelombang.get('/', async (c) => {
    try {
        const result = await c.env.DB.prepare(
            'SELECT * FROM gelombang ORDER BY tahun DESC, tahap DESC'
        ).all();
        return c.json({ success: true, data: result.results });
    } catch (error) {
        console.error('Get gelombang error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

// Get gelombang by ID
gelombang.get('/:id', async (c) => {
    try {
        const id = c.req.param('id');
        const result = await c.env.DB.prepare(
            'SELECT * FROM gelombang WHERE id_gelombang = ?'
        ).bind(id).first();

        if (!result) {
            return c.json({ success: false, message: 'Gelombang tidak ditemukan' }, 404);
        }
        return c.json({ success: true, data: result });
    } catch (error) {
        console.error('Get gelombang by id error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

// Create gelombang (admin only)
gelombang.post('/', authMiddleware, adminMiddleware, async (c) => {
    try {
        const body = await c.req.json();
        const user = c.get('user') as { id: number };

        const slug = createSlug(body.judul);

        await c.env.DB.prepare(`
            INSERT INTO gelombang (
                id_user, tahun_ajaran, tahap, tahun, slug, judul, isi,
                tanggal_buka, tanggal_tutup, status_gelombang
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            user.id,
            body.tahun_ajaran,
            body.tahap || 1,
            body.tahun || new Date().getFullYear(),
            slug,
            body.judul,
            body.isi || '',
            body.tanggal_buka,
            body.tanggal_tutup,
            body.status_gelombang || 'Tutup'
        ).run();

        return c.json({ success: true, message: 'Gelombang berhasil ditambahkan' });
    } catch (error) {
        console.error('Create gelombang error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

// Update gelombang (admin only)
gelombang.put('/:id', authMiddleware, adminMiddleware, async (c) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();

        const slug = body.judul ? createSlug(body.judul) : undefined;

        await c.env.DB.prepare(`
            UPDATE gelombang SET
                tahun_ajaran = COALESCE(?, tahun_ajaran),
                tahap = COALESCE(?, tahap),
                tahun = COALESCE(?, tahun),
                slug = COALESCE(?, slug),
                judul = COALESCE(?, judul),
                isi = COALESCE(?, isi),
                tanggal_buka = COALESCE(?, tanggal_buka),
                tanggal_tutup = COALESCE(?, tanggal_tutup),
                status_gelombang = COALESCE(?, status_gelombang)
            WHERE id_gelombang = ?
        `).bind(
            body.tahun_ajaran || null,
            body.tahap || null,
            body.tahun || null,
            slug || null,
            body.judul || null,
            body.isi || null,
            body.tanggal_buka || null,
            body.tanggal_tutup || null,
            body.status_gelombang || null,
            id
        ).run();

        return c.json({ success: true, message: 'Gelombang berhasil diperbarui' });
    } catch (error) {
        console.error('Update gelombang error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

// Delete gelombang (admin only)
gelombang.delete('/:id', authMiddleware, adminMiddleware, async (c) => {
    try {
        const id = c.req.param('id');

        // Check if gelombang is used by any siswa
        const siswaCount = await c.env.DB.prepare(
            'SELECT COUNT(*) as count FROM siswa WHERE id_gelombang = ?'
        ).bind(id).first<{ count: number }>();

        if (siswaCount && siswaCount.count > 0) {
            return c.json({
                success: false,
                message: `Tidak dapat menghapus. ${siswaCount.count} siswa terdaftar di gelombang ini.`
            }, 400);
        }

        await c.env.DB.prepare(
            'DELETE FROM gelombang WHERE id_gelombang = ?'
        ).bind(id).run();

        return c.json({ success: true, message: 'Gelombang berhasil dihapus' });
    } catch (error) {
        console.error('Delete gelombang error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

export default gelombang;
