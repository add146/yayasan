import { Hono } from 'hono';
import { authMiddleware, adminMiddleware } from '../lib/auth';
import { Env } from '../index';

const jenjangPendidikan = new Hono<{ Bindings: Env }>();

// Helper to create slug
function createSlug(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim();
}

// Get all jenjang pendidikan
jenjangPendidikan.get('/', async (c) => {
    try {
        const result = await c.env.DB.prepare(`
            SELECT jp.*, j.nama_jenjang 
            FROM jenjang_pendidikan jp
            LEFT JOIN jenjang j ON jp.id_jenjang = j.id_jenjang
            ORDER BY jp.urutan ASC
        `).all();
        return c.json({ success: true, data: result.results });
    } catch (error) {
        console.error('Get jenjang pendidikan error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

// Get jenjang master list (for dropdown)
jenjangPendidikan.get('/jenjang', async (c) => {
    try {
        const result = await c.env.DB.prepare(
            "SELECT * FROM jenjang WHERE status_aktif = 'Ya' ORDER BY urutan ASC"
        ).all();
        return c.json({ success: true, data: result.results });
    } catch (error) {
        console.error('Get jenjang error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

// Get jenjang pendidikan by ID
jenjangPendidikan.get('/:id', async (c) => {
    try {
        const id = c.req.param('id');
        const result = await c.env.DB.prepare(`
            SELECT jp.*, j.nama_jenjang 
            FROM jenjang_pendidikan jp
            LEFT JOIN jenjang j ON jp.id_jenjang = j.id_jenjang
            WHERE jp.id_jenjang_pendidikan = ?
        `).bind(id).first();

        if (!result) {
            return c.json({ success: false, message: 'Program tidak ditemukan' }, 404);
        }
        return c.json({ success: true, data: result });
    } catch (error) {
        console.error('Get jenjang pendidikan by id error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

// Create jenjang pendidikan (admin only)
jenjangPendidikan.post('/', authMiddleware, adminMiddleware, async (c) => {
    try {
        const body = await c.req.json();
        const user = c.get('user') as { id: number };

        const slug = createSlug(body.judul_jenjang_pendidikan);

        await c.env.DB.prepare(`
            INSERT INTO jenjang_pendidikan (
                id_user, id_jenjang, slug_jenjang_pendidikan, judul_jenjang_pendidikan,
                ringkasan, isi, status_jenjang_pendidikan, urutan
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            user.id,
            body.id_jenjang,
            slug,
            body.judul_jenjang_pendidikan,
            body.ringkasan || '',
            body.isi || '',
            body.status_jenjang_pendidikan || 'Publish',
            body.urutan || 0
        ).run();

        return c.json({ success: true, message: 'Program berhasil ditambahkan' });
    } catch (error) {
        console.error('Create jenjang pendidikan error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

// Update jenjang pendidikan (admin only)
jenjangPendidikan.put('/:id', authMiddleware, adminMiddleware, async (c) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();

        const slug = body.judul_jenjang_pendidikan ? createSlug(body.judul_jenjang_pendidikan) : undefined;

        await c.env.DB.prepare(`
            UPDATE jenjang_pendidikan SET
                id_jenjang = COALESCE(?, id_jenjang),
                slug_jenjang_pendidikan = COALESCE(?, slug_jenjang_pendidikan),
                judul_jenjang_pendidikan = COALESCE(?, judul_jenjang_pendidikan),
                ringkasan = COALESCE(?, ringkasan),
                isi = COALESCE(?, isi),
                status_jenjang_pendidikan = COALESCE(?, status_jenjang_pendidikan),
                urutan = COALESCE(?, urutan)
            WHERE id_jenjang_pendidikan = ?
        `).bind(
            body.id_jenjang || null,
            slug || null,
            body.judul_jenjang_pendidikan || null,
            body.ringkasan || null,
            body.isi || null,
            body.status_jenjang_pendidikan || null,
            body.urutan !== undefined ? body.urutan : null,
            id
        ).run();

        return c.json({ success: true, message: 'Program berhasil diperbarui' });
    } catch (error) {
        console.error('Update jenjang pendidikan error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

// Delete jenjang pendidikan (admin only)
jenjangPendidikan.delete('/:id', authMiddleware, adminMiddleware, async (c) => {
    try {
        const id = c.req.param('id');

        // Check if jenjang is used by any siswa
        const siswaCount = await c.env.DB.prepare(
            'SELECT COUNT(*) as count FROM siswa WHERE id_jenjang = ?'
        ).bind(id).first<{ count: number }>();

        if (siswaCount && siswaCount.count > 0) {
            return c.json({
                success: false,
                message: `Tidak dapat menghapus. ${siswaCount.count} siswa terdaftar di program ini.`
            }, 400);
        }

        await c.env.DB.prepare(
            'DELETE FROM jenjang_pendidikan WHERE id_jenjang_pendidikan = ?'
        ).bind(id).run();

        return c.json({ success: true, message: 'Program berhasil dihapus' });
    } catch (error) {
        console.error('Delete jenjang pendidikan error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

export default jenjangPendidikan;
