import { Hono } from 'hono';
import { authMiddleware, adminMiddleware } from '../lib/auth';
import { Env } from '../index';

const kategori = new Hono<{ Bindings: Env }>();

function createSlug(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim();
}

// ==================== KATEGORI BERITA ====================
kategori.get('/berita', async (c) => {
    try {
        const result = await c.env.DB.prepare(
            'SELECT * FROM kategori ORDER BY urutan ASC'
        ).all();
        return c.json({ success: true, data: result.results });
    } catch (error) {
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

kategori.post('/berita', authMiddleware, adminMiddleware, async (c) => {
    try {
        const user = c.get('user');
        const { nama_kategori, urutan = 0 } = await c.req.json();
        const slug = createSlug(nama_kategori);

        await c.env.DB.prepare(
            'INSERT INTO kategori (id_user, slug_kategori, nama_kategori, urutan) VALUES (?, ?, ?, ?)'
        ).bind(user.id, slug, nama_kategori, urutan).run();

        return c.json({ success: true, message: 'Kategori berhasil ditambahkan' });
    } catch (error) {
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

// ==================== KATEGORI GALERI ====================
kategori.get('/galeri', async (c) => {
    try {
        const result = await c.env.DB.prepare(
            "SELECT * FROM kategori_galeri WHERE status_kategori_galeri = 'Publish' ORDER BY urutan ASC"
        ).all();
        return c.json({ success: true, data: result.results });
    } catch (error) {
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

kategori.post('/galeri', authMiddleware, adminMiddleware, async (c) => {
    try {
        const user = c.get('user');
        const body = await c.req.json();
        const slug = createSlug(body.nama_kategori_galeri);

        await c.env.DB.prepare(`
      INSERT INTO kategori_galeri (id_user, slug_kategori_galeri, nama_kategori_galeri, keterangan, urutan, status_kategori_galeri)
      VALUES (?, ?, ?, ?, ?, 'Publish')
    `).bind(user.id, slug, body.nama_kategori_galeri, body.keterangan || '', body.urutan || 0).run();

        return c.json({ success: true, message: 'Kategori galeri berhasil ditambahkan' });
    } catch (error) {
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

// ==================== KATEGORI STAFF ====================
kategori.get('/staff', async (c) => {
    try {
        const result = await c.env.DB.prepare(
            "SELECT * FROM kategori_staff WHERE status_kategori_staff = 'Publish' ORDER BY urutan ASC"
        ).all();
        return c.json({ success: true, data: result.results });
    } catch (error) {
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

kategori.post('/staff', authMiddleware, adminMiddleware, async (c) => {
    try {
        const user = c.get('user');
        const body = await c.req.json();
        const slug = createSlug(body.nama_kategori_staff);

        await c.env.DB.prepare(`
      INSERT INTO kategori_staff (id_user, slug_kategori_staff, nama_kategori_staff, keterangan, urutan, status_kategori_staff)
      VALUES (?, ?, ?, ?, ?, 'Publish')
    `).bind(user.id, slug, body.nama_kategori_staff, body.keterangan || '', body.urutan || 0).run();

        return c.json({ success: true, message: 'Kategori staff berhasil ditambahkan' });
    } catch (error) {
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

// ==================== KATEGORI DOWNLOAD ====================
kategori.get('/download', async (c) => {
    try {
        const result = await c.env.DB.prepare(
            "SELECT * FROM kategori_download WHERE status_kategori_download = 'Publish' ORDER BY urutan ASC"
        ).all();
        return c.json({ success: true, data: result.results });
    } catch (error) {
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

// ==================== KATEGORI EKSTRAKURIKULER ====================
kategori.get('/ekstrakurikuler', async (c) => {
    try {
        const result = await c.env.DB.prepare(
            "SELECT * FROM kategori_ekstrakurikuler WHERE status_kategori_ekstrakurikuler = 'Publish' ORDER BY urutan ASC"
        ).all();
        return c.json({ success: true, data: result.results });
    } catch (error) {
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

// ==================== KATEGORI FASILITAS ====================
kategori.get('/fasilitas', async (c) => {
    try {
        const result = await c.env.DB.prepare(
            "SELECT * FROM kategori_fasilitas WHERE status_kategori_fasilitas = 'Publish' ORDER BY urutan ASC"
        ).all();
        return c.json({ success: true, data: result.results });
    } catch (error) {
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

// ==================== KATEGORI PRESTASI ====================
kategori.get('/prestasi', async (c) => {
    try {
        const result = await c.env.DB.prepare(
            "SELECT * FROM kategori_prestasi WHERE status_kategori_prestasi = 'Publish' ORDER BY urutan ASC"
        ).all();
        return c.json({ success: true, data: result.results });
    } catch (error) {
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

// ==================== MASTER DATA ====================
kategori.get('/agama', async (c) => {
    try {
        const result = await c.env.DB.prepare('SELECT * FROM agama ORDER BY urutan ASC').all();
        return c.json({ success: true, data: result.results });
    } catch (error) {
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

kategori.get('/jenjang', async (c) => {
    try {
        const result = await c.env.DB.prepare(
            "SELECT * FROM jenjang WHERE status_aktif = 'Ya' ORDER BY urutan ASC"
        ).all();
        return c.json({ success: true, data: result.results });
    } catch (error) {
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

kategori.get('/hubungan', async (c) => {
    try {
        const result = await c.env.DB.prepare('SELECT * FROM hubungan ORDER BY urutan ASC').all();
        return c.json({ success: true, data: result.results });
    } catch (error) {
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

kategori.get('/pekerjaan', async (c) => {
    try {
        const result = await c.env.DB.prepare('SELECT * FROM pekerjaan ORDER BY urutan ASC').all();
        return c.json({ success: true, data: result.results });
    } catch (error) {
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

export default kategori;
