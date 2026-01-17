import { Hono } from 'hono';
import { authMiddleware, adminMiddleware } from '../lib/auth';
import { Env } from '../index';

const galeri = new Hono<{ Bindings: Env }>();

// Get all galeri (public)
galeri.get('/', async (c) => {
    try {
        const { kategori, jenis, limit = '12', offset = '0' } = c.req.query();

        let query = `
      SELECT g.*, kg.nama_kategori_galeri
      FROM galeri g
      LEFT JOIN kategori_galeri kg ON g.id_kategori_galeri = kg.id_kategori_galeri
      WHERE 1=1
    `;
        const params: unknown[] = [];

        if (kategori) {
            query += ' AND kg.slug_kategori_galeri = ?';
            params.push(kategori);
        }

        if (jenis) {
            query += ' AND g.jenis_galeri = ?';
            params.push(jenis);
        }

        query += ' ORDER BY g.tanggal_post DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const result = await c.env.DB.prepare(query).bind(...params).all();

        return c.json({
            success: true,
            data: result.results,
        });
    } catch (error) {
        console.error('Get galeri error:', error);
        return c.json({
            success: false,
            message: 'Terjadi kesalahan pada server',
        }, 500);
    }
});

// Get single galeri
galeri.get('/:id', async (c) => {
    try {
        const id = c.req.param('id');

        const result = await c.env.DB.prepare(`
      SELECT g.*, kg.nama_kategori_galeri
      FROM galeri g
      LEFT JOIN kategori_galeri kg ON g.id_kategori_galeri = kg.id_kategori_galeri
      WHERE g.id_galeri = ?
    `).bind(id).first();

        if (!result) {
            return c.json({
                success: false,
                message: 'Galeri tidak ditemukan',
            }, 404);
        }

        return c.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error('Get single galeri error:', error);
        return c.json({
            success: false,
            message: 'Terjadi kesalahan pada server',
        }, 500);
    }
});

// Create galeri (admin only)
galeri.post('/', authMiddleware, adminMiddleware, async (c) => {
    try {
        const user = c.get('user');
        const body = await c.req.json();
        const {
            id_kategori_galeri,
            judul_galeri,
            jenis_galeri = 'Homepage',
            isi,
            gambar,
            website,
            text_website,
            status_text = 'Ya',
        } = body;

        if (!gambar) {
            return c.json({
                success: false,
                message: 'Gambar harus diisi',
            }, 400);
        }

        const result = await c.env.DB.prepare(`
      INSERT INTO galeri (
        id_kategori_galeri, id_user, judul_galeri, jenis_galeri, isi, gambar,
        website, text_website, status_text, tanggal_post
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).bind(
            id_kategori_galeri, user.id, judul_galeri || '', jenis_galeri,
            isi || '', gambar, website || '', text_website || '', status_text
        ).run();

        return c.json({
            success: true,
            message: 'Galeri berhasil ditambahkan',
            data: { id: result.meta.last_row_id },
        });
    } catch (error) {
        console.error('Create galeri error:', error);
        return c.json({
            success: false,
            message: 'Terjadi kesalahan pada server',
        }, 500);
    }
});

// Update galeri (admin only)
galeri.put('/:id', authMiddleware, adminMiddleware, async (c) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();

        // Handle null id_kategori_galeri - default to 1 if not provided
        const id_kategori = body.id_kategori_galeri || 1;

        await c.env.DB.prepare(`
            UPDATE galeri SET
                id_kategori_galeri = ?,
                judul_galeri = ?,
                jenis_galeri = ?,
                gambar = ?,
                tanggal = datetime('now')
            WHERE id_galeri = ?
        `).bind(
            id_kategori,
            body.judul_galeri || '',
            body.jenis_galeri || 'Homepage',
            body.gambar || '',
            id
        ).run();

        return c.json({
            success: true,
            message: 'Galeri berhasil diperbarui',
        });
    } catch (error) {
        console.error('Update galeri error:', error);
        return c.json({
            success: false,
            message: 'Terjadi kesalahan pada server',
        }, 500);
    }
});

// Delete galeri (admin only)
galeri.delete('/:id', authMiddleware, adminMiddleware, async (c) => {
    try {
        const id = c.req.param('id');

        await c.env.DB.prepare('DELETE FROM galeri WHERE id_galeri = ?').bind(id).run();

        return c.json({
            success: true,
            message: 'Galeri berhasil dihapus',
        });
    } catch (error) {
        console.error('Delete galeri error:', error);
        return c.json({
            success: false,
            message: 'Terjadi kesalahan pada server',
        }, 500);
    }
});

export default galeri;
