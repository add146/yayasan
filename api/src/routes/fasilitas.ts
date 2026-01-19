import { Hono } from 'hono';
import { authMiddleware, adminMiddleware } from '../lib/auth';
import { Env } from '../index';

const fasilitas = new Hono<{ Bindings: Env }>();

function createSlug(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9\\s-]/g, '').replace(/\\s+/g, '-').trim();
}

// Get all fasilitas (public)
fasilitas.get('/', async (c) => {
    try {
        const { kategori, limit = '20', offset = '0' } = c.req.query();

        let query = `
      SELECT f.*, kf.nama_kategori_fasilitas
      FROM fasilitas f
      LEFT JOIN kategori_fasilitas kf ON f.id_kategori_fasilitas = kf.id_kategori_fasilitas
      WHERE f.status_fasilitas = 'Publish'
    `;
        const params: unknown[] = [];

        if (kategori) {
            query += ' AND kf.slug_kategori_fasilitas = ?';
            params.push(kategori);
        }

        query += ' ORDER BY f.urutan ASC, f.judul_fasilitas ASC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const result = await c.env.DB.prepare(query).bind(...params).all();

        // Map isi to isi_fasilitas for frontend compatibility
        const data = result.results.map((item: any) => ({
            ...item,
            isi_fasilitas: item.isi
        }));

        return c.json({
            success: true,
            data: data,
        });
    } catch (error) {
        console.error('Get fasilitas error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan pada server' }, 500);
    }
});

// Get single fasilitas (public)
fasilitas.get('/:slug', async (c) => {
    try {
        const slug = c.req.param('slug');

        const result = await c.env.DB.prepare(`
      SELECT f.*, kf.nama_kategori_fasilitas
      FROM fasilitas f
      LEFT JOIN kategori_fasilitas kf ON f.id_kategori_fasilitas = kf.id_kategori_fasilitas
      WHERE f.slug_fasilitas = ? AND f.status_fasilitas = 'Publish'
    `).bind(slug).first();

        if (!result) {
            return c.json({ success: false, message: 'Fasilitas tidak ditemukan' }, 404);
        }

        // Map isi to isi_fasilitas for frontend compatibility
        const data = {
            ...result,
            isi_fasilitas: (result as any).isi
        };

        return c.json({ success: true, data: data });
    } catch (error) {
        console.error('Get single fasilitas error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan pada server' }, 500);
    }
});

// Create fasilitas (admin only)
fasilitas.post('/', authMiddleware, adminMiddleware, async (c) => {
    try {
        const user = c.get('user');
        const body = await c.req.json();

        const slug = createSlug(body.judul_fasilitas);

        const result = await c.env.DB.prepare(`
      INSERT INTO fasilitas (
        id_kategori_fasilitas, id_user, slug_fasilitas, judul_fasilitas,
        kode_nomor_fasilitas, kondisi_fasilitas, tahun_fasilitas, tanggal_fasilitas,
        isi, gambar, website, text_website, status_fasilitas, urutan, tanggal_post
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).bind(
            body.id_kategori_fasilitas, user.id, slug, body.judul_fasilitas,
            body.kode_nomor_fasilitas || '', body.kondisi_fasilitas || '',
            body.tahun_fasilitas || null, body.tanggal_fasilitas || null,
            body.isi || '', body.gambar || '', body.website || '', body.text_website || '',
            body.status_fasilitas || 'Publish', body.urutan || 0
        ).run();

        return c.json({
            success: true,
            message: 'Fasilitas berhasil ditambahkan',
            data: { id: result.meta.last_row_id },
        });
    } catch (error) {
        console.error('Create fasilitas error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan pada server' }, 500);
    }
});

// Update fasilitas (admin only)
fasilitas.put('/:id', authMiddleware, adminMiddleware, async (c) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();
        const slug = body.judul_fasilitas ? createSlug(body.judul_fasilitas) : undefined;

        await c.env.DB.prepare(`
      UPDATE fasilitas SET
        id_kategori_fasilitas = COALESCE(?, id_kategori_fasilitas),
        slug_fasilitas = COALESCE(?, slug_fasilitas),
        judul_fasilitas = COALESCE(?, judul_fasilitas),
        kode_nomor_fasilitas = COALESCE(?, kode_nomor_fasilitas),
        kondisi_fasilitas = COALESCE(?, kondisi_fasilitas),
        tahun_fasilitas = COALESCE(?, tahun_fasilitas),
        tanggal_fasilitas = COALESCE(?, tanggal_fasilitas),
        isi = COALESCE(?, isi),
        gambar = COALESCE(?, gambar),
        status_fasilitas = COALESCE(?, status_fasilitas),
        urutan = COALESCE(?, urutan),
        tanggal = datetime('now')
      WHERE id_fasilitas = ?
    `).bind(
            body.id_kategori_fasilitas, slug, body.judul_fasilitas,
            body.kode_nomor_fasilitas, body.kondisi_fasilitas, body.tahun_fasilitas, body.tanggal_fasilitas,
            body.isi, body.gambar, body.status_fasilitas, body.urutan, id
        ).run();

        return c.json({ success: true, message: 'Fasilitas berhasil diperbarui' });
    } catch (error) {
        console.error('Update fasilitas error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan pada server' }, 500);
    }
});

// Delete fasilitas (admin only)
fasilitas.delete('/:id', authMiddleware, adminMiddleware, async (c) => {
    try {
        const id = c.req.param('id');
        await c.env.DB.prepare('DELETE FROM fasilitas WHERE id_fasilitas = ?').bind(id).run();
        return c.json({ success: true, message: 'Fasilitas berhasil dihapus' });
    } catch (error) {
        console.error('Delete fasilitas error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan pada server' }, 500);
    }
});

export default fasilitas;
