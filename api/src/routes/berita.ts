import { Hono } from 'hono';
import { authMiddleware, adminMiddleware } from '../lib/auth';
import { Env } from '../index';

const berita = new Hono<{ Bindings: Env }>();

// Helper to create slug
function createSlug(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

// Get all berita (public)
berita.get('/', async (c) => {
    try {
        const { kategori, jenis, limit = '10', offset = '0', search } = c.req.query();

        let query = `
      SELECT b.*, k.nama_kategori, u.nama as nama_penulis
      FROM berita b
      LEFT JOIN kategori k ON b.id_kategori = k.id_kategori
      LEFT JOIN users u ON b.id_user = u.id_user
      WHERE b.status_berita = 'Publish'
    `;
        const params: unknown[] = [];

        if (kategori) {
            query += ' AND k.slug_kategori = ?';
            params.push(kategori);
        }

        if (jenis) {
            query += ' AND b.jenis_berita = ?';
            params.push(jenis);
        }

        if (search) {
            query += ' AND (b.judul_berita LIKE ? OR b.ringkasan LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        query += ' ORDER BY b.tanggal_post DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const stmt = c.env.DB.prepare(query);
        const result = await stmt.bind(...params).all();

        // Get total count
        let countQuery = `
      SELECT COUNT(*) as total FROM berita b
      LEFT JOIN kategori k ON b.id_kategori = k.id_kategori
      WHERE b.status_berita = 'Publish'
    `;
        const countParams: unknown[] = [];

        if (kategori) {
            countQuery += ' AND k.slug_kategori = ?';
            countParams.push(kategori);
        }
        if (jenis) {
            countQuery += ' AND b.jenis_berita = ?';
            countParams.push(jenis);
        }
        if (search) {
            countQuery += ' AND (b.judul_berita LIKE ? OR b.ringkasan LIKE ?)';
            countParams.push(`%${search}%`, `%${search}%`);
        }

        const countStmt = c.env.DB.prepare(countQuery);
        const countResult = await countStmt.bind(...countParams).first();

        return c.json({
            success: true,
            data: result.results,
            pagination: {
                total: countResult?.total || 0,
                limit: parseInt(limit),
                offset: parseInt(offset),
            },
        });
    } catch (error) {
        console.error('Get berita error:', error);
        return c.json({
            success: false,
            message: 'Terjadi kesalahan pada server',
        }, 500);
    }
});

// Get single berita by slug (public)
berita.get('/:slug', async (c) => {
    try {
        const slug = c.req.param('slug');

        const result = await c.env.DB.prepare(`
      SELECT b.*, k.nama_kategori, u.nama as nama_penulis
      FROM berita b
      LEFT JOIN kategori k ON b.id_kategori = k.id_kategori
      LEFT JOIN users u ON b.id_user = u.id_user
      WHERE b.slug_berita = ? AND b.status_berita = 'Publish'
    `).bind(slug).first();

        if (!result) {
            return c.json({
                success: false,
                message: 'Berita tidak ditemukan',
            }, 404);
        }

        // Update hits
        await c.env.DB.prepare(
            'UPDATE berita SET hits = hits + 1 WHERE id_berita = ?'
        ).bind(result.id_berita).run();

        return c.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error('Get single berita error:', error);
        return c.json({
            success: false,
            message: 'Terjadi kesalahan pada server',
        }, 500);
    }
});

// Create berita (admin only)
berita.post('/', authMiddleware, adminMiddleware, async (c) => {
    try {
        const user = c.get('user');
        const body = await c.req.json();
        const {
            id_kategori,
            judul_berita,
            ringkasan,
            isi,
            status_berita = 'Draft',
            jenis_berita = 'Berita',
            keywords,
            gambar,
        } = body;

        if (!judul_berita || !isi || !id_kategori) {
            return c.json({
                success: false,
                message: 'Judul, isi, dan kategori harus diisi',
            }, 400);
        }

        const slug = createSlug(judul_berita);
        const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

        const result = await c.env.DB.prepare(`
      INSERT INTO berita (
        id_user, id_kategori, slug_berita, judul_berita, ringkasan, isi,
        status_berita, jenis_berita, keywords, gambar, hits, tanggal_post, tanggal_publish, tanggal
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?)
    `).bind(
            user.id, id_kategori, slug, judul_berita, ringkasan || '', isi,
            status_berita, jenis_berita, keywords || '', gambar || '', now, now, now
        ).run();

        return c.json({
            success: true,
            message: 'Berita berhasil ditambahkan',
            data: { id: result.meta.last_row_id },
        });
    } catch (error) {
        console.error('Create berita error:', error);
        return c.json({
            success: false,
            message: 'Terjadi kesalahan pada server',
        }, 500);
    }
});

// Update berita (admin only)
berita.put('/:id', authMiddleware, adminMiddleware, async (c) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();
        const {
            id_kategori,
            judul_berita,
            ringkasan,
            isi,
            status_berita,
            jenis_berita,
            keywords,
            gambar,
        } = body;

        // Check if exists
        const existing = await c.env.DB.prepare(
            'SELECT id_berita FROM berita WHERE id_berita = ?'
        ).bind(id).first();

        if (!existing) {
            return c.json({
                success: false,
                message: 'Berita tidak ditemukan',
            }, 404);
        }

        const slug = judul_berita ? createSlug(judul_berita) : undefined;

        await c.env.DB.prepare(`
      UPDATE berita SET
        id_kategori = COALESCE(?, id_kategori),
        slug_berita = COALESCE(?, slug_berita),
        judul_berita = COALESCE(?, judul_berita),
        ringkasan = COALESCE(?, ringkasan),
        isi = COALESCE(?, isi),
        status_berita = COALESCE(?, status_berita),
        jenis_berita = COALESCE(?, jenis_berita),
        keywords = COALESCE(?, keywords),
        gambar = COALESCE(?, gambar),
        tanggal = datetime('now')
      WHERE id_berita = ?
    `).bind(
            id_kategori, slug, judul_berita, ringkasan, isi,
            status_berita, jenis_berita, keywords, gambar, id
        ).run();

        return c.json({
            success: true,
            message: 'Berita berhasil diperbarui',
        });
    } catch (error) {
        console.error('Update berita error:', error);
        return c.json({
            success: false,
            message: 'Terjadi kesalahan pada server',
        }, 500);
    }
});

// Delete berita (admin only)
berita.delete('/:id', authMiddleware, adminMiddleware, async (c) => {
    try {
        const id = c.req.param('id');

        const result = await c.env.DB.prepare(
            'DELETE FROM berita WHERE id_berita = ?'
        ).bind(id).run();

        if (result.meta.changes === 0) {
            return c.json({
                success: false,
                message: 'Berita tidak ditemukan',
            }, 404);
        }

        return c.json({
            success: true,
            message: 'Berita berhasil dihapus',
        });
    } catch (error) {
        console.error('Delete berita error:', error);
        return c.json({
            success: false,
            message: 'Terjadi kesalahan pada server',
        }, 500);
    }
});

export default berita;
