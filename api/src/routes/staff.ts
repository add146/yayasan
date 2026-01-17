import { Hono } from 'hono';
import { authMiddleware, adminMiddleware } from '../lib/auth';
import { Env } from '../index';

const staff = new Hono<{ Bindings: Env }>();

function createSlug(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim();
}

// Get all staff (public)
staff.get('/', async (c) => {
    try {
        const { kategori, limit = '20', offset = '0' } = c.req.query();

        let query = `
      SELECT s.*, ks.nama_kategori_staff
      FROM staff s
      LEFT JOIN kategori_staff ks ON s.id_kategori_staff = ks.id_kategori_staff
      WHERE s.status_staff = 'Publish'
    `;
        const params: unknown[] = [];

        if (kategori) {
            query += ' AND ks.slug_kategori_staff = ?';
            params.push(kategori);
        }

        query += ' ORDER BY s.urutan ASC, s.nama_staff ASC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const result = await c.env.DB.prepare(query).bind(...params).all();

        return c.json({
            success: true,
            data: result.results,
        });
    } catch (error) {
        console.error('Get staff error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan pada server' }, 500);
    }
});

// Get single staff (public)
staff.get('/:slug', async (c) => {
    try {
        const slug = c.req.param('slug');

        const result = await c.env.DB.prepare(`
      SELECT s.*, ks.nama_kategori_staff
      FROM staff s
      LEFT JOIN kategori_staff ks ON s.id_kategori_staff = ks.id_kategori_staff
      WHERE s.slug_staff = ? AND s.status_staff = 'Publish'
    `).bind(slug).first();

        if (!result) {
            return c.json({ success: false, message: 'Staff tidak ditemukan' }, 404);
        }

        return c.json({ success: true, data: result });
    } catch (error) {
        console.error('Get single staff error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan pada server' }, 500);
    }
});

// Create staff (admin only)
staff.post('/', authMiddleware, adminMiddleware, async (c) => {
    try {
        const user = c.get('user');
        const body = await c.req.json();

        const slug = createSlug(body.nama_staff);

        const result = await c.env.DB.prepare(`
      INSERT INTO staff (
        id_kategori_staff, id_user, slug_staff, nama_staff, gelar_depan, gelar_belakang,
        jabatan, nip, email, telepon, tempat_lahir, tanggal_lahir, jenis_kelamin,
        alamat, isi, gambar, facebook, twitter, instagram, linkedin,
        status_staff, urutan, tanggal_post
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).bind(
            body.id_kategori_staff, user.id, slug, body.nama_staff, body.gelar_depan || '',
            body.gelar_belakang || '', body.jabatan || '', body.nip || '', body.email || '',
            body.telepon || '', body.tempat_lahir || '', body.tanggal_lahir || null,
            body.jenis_kelamin || '', body.alamat || '', body.isi || '', body.gambar || '',
            body.facebook || '', body.twitter || '', body.instagram || '', body.linkedin || '',
            body.status_staff || 'Publish', body.urutan || 0
        ).run();

        return c.json({
            success: true,
            message: 'Staff berhasil ditambahkan',
            data: { id: result.meta.last_row_id },
        });
    } catch (error) {
        console.error('Create staff error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan pada server' }, 500);
    }
});

// Update staff (admin only)
staff.put('/:id', authMiddleware, adminMiddleware, async (c) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();
        const slug = body.nama_staff ? createSlug(body.nama_staff) : undefined;

        await c.env.DB.prepare(`
      UPDATE staff SET
        id_kategori_staff = COALESCE(?, id_kategori_staff),
        slug_staff = COALESCE(?, slug_staff),
        nama_staff = COALESCE(?, nama_staff),
        gelar_depan = COALESCE(?, gelar_depan),
        gelar_belakang = COALESCE(?, gelar_belakang),
        jabatan = COALESCE(?, jabatan),
        nip = COALESCE(?, nip),
        email = COALESCE(?, email),
        telepon = COALESCE(?, telepon),
        isi = COALESCE(?, isi),
        gambar = COALESCE(?, gambar),
        status_staff = COALESCE(?, status_staff),
        urutan = COALESCE(?, urutan),
        tanggal = datetime('now')
      WHERE id_staff = ?
    `).bind(
            body.id_kategori_staff, slug, body.nama_staff, body.gelar_depan,
            body.gelar_belakang, body.jabatan, body.nip, body.email, body.telepon,
            body.isi, body.gambar, body.status_staff, body.urutan, id
        ).run();

        return c.json({ success: true, message: 'Staff berhasil diperbarui' });
    } catch (error) {
        console.error('Update staff error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan pada server' }, 500);
    }
});

// Delete staff (admin only)
staff.delete('/:id', authMiddleware, adminMiddleware, async (c) => {
    try {
        const id = c.req.param('id');
        await c.env.DB.prepare('DELETE FROM staff WHERE id_staff = ?').bind(id).run();
        return c.json({ success: true, message: 'Staff berhasil dihapus' });
    } catch (error) {
        console.error('Delete staff error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan pada server' }, 500);
    }
});

export default staff;
