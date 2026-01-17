import { Hono } from 'hono';
import { authMiddleware, adminMiddleware } from '../lib/auth';
import { Env } from '../index';

const siswa = new Hono<{ Bindings: Env }>();

// Get all siswa (admin only)
siswa.get('/', authMiddleware, adminMiddleware, async (c) => {
    try {
        const { status, gelombang, limit = '20', offset = '0', search } = c.req.query();

        let query = `
      SELECT s.*, g.judul as nama_gelombang, a.nama_agama, j.nama_jenjang
      FROM siswa s
      LEFT JOIN gelombang g ON s.id_gelombang = g.id_gelombang
      LEFT JOIN agama a ON s.id_agama = a.id_agama
      LEFT JOIN jenjang j ON s.id_jenjang = j.id_jenjang
      WHERE 1=1
    `;
        const params: unknown[] = [];

        if (status) {
            query += ' AND s.status_siswa = ?';
            params.push(status);
        }

        if (gelombang) {
            query += ' AND s.id_gelombang = ?';
            params.push(gelombang);
        }

        if (search) {
            query += ' AND (s.nama_siswa LIKE ? OR s.nis LIKE ? OR s.nisn LIKE ?)';
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        query += ' ORDER BY s.tanggal_post DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const result = await c.env.DB.prepare(query).bind(...params).all();

        return c.json({
            success: true,
            data: result.results,
        });
    } catch (error) {
        console.error('Get siswa error:', error);
        return c.json({
            success: false,
            message: 'Terjadi kesalahan pada server',
        }, 500);
    }
});

// Create new siswa (admin only)
siswa.post('/', authMiddleware, adminMiddleware, async (c) => {
    try {
        const body = await c.req.json();

        const result = await c.env.DB.prepare(`
            INSERT INTO siswa (
                id_gelombang, id_agama, kode_siswa, nama_siswa, tempat_lahir, tanggal_lahir,
                jenis_kelamin, alamat, telepon, email, asal_sekolah, nama_ayah, telepon_ayah,
                nama_ibu, telepon_ibu, status_siswa, tanggal_post
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `).bind(
            body.id_gelombang || null,
            body.id_agama || null,
            body.kode_siswa || ('ADM' + Date.now().toString(36).toUpperCase()),
            body.nama_siswa,
            body.tempat_lahir || '',
            body.tanggal_lahir || null,
            body.jenis_kelamin || 'Laki-laki',
            body.alamat || '',
            body.telepon || '',
            body.email || '',
            body.asal_sekolah || '',
            body.nama_ayah || '',
            body.telepon_ayah || '',
            body.nama_ibu || '',
            body.telepon_ibu || '',
            body.status_siswa || 'Diterima'
        ).run();

        return c.json({
            success: true,
            message: 'Siswa berhasil ditambahkan',
            data: { id_siswa: result.meta.last_row_id }
        });
    } catch (error) {
        console.error('Create siswa error:', error);
        return c.json({
            success: false,
            message: 'Terjadi kesalahan pada server',
        }, 500);
    }
});

// Get single siswa
siswa.get('/:id', authMiddleware, async (c) => {
    try {
        const id = c.req.param('id');
        const user = c.get('user');

        let query = `
      SELECT s.*, g.judul as nama_gelombang, a.nama_agama, j.nama_jenjang,
             h.nama_hubungan, pa.nama_pekerjaan as pekerjaan_ayah,
             pi.nama_pekerjaan as pekerjaan_ibu, pw.nama_pekerjaan as pekerjaan_wali
      FROM siswa s
      LEFT JOIN gelombang g ON s.id_gelombang = g.id_gelombang
      LEFT JOIN agama a ON s.id_agama = a.id_agama
      LEFT JOIN jenjang j ON s.id_jenjang = j.id_jenjang
      LEFT JOIN hubungan h ON s.id_hubungan = h.id_hubungan
      LEFT JOIN pekerjaan pa ON s.id_pekerjaan_ayah = pa.id_pekerjaan
      LEFT JOIN pekerjaan pi ON s.id_pekerjaan_ibu = pi.id_pekerjaan
      LEFT JOIN pekerjaan pw ON s.id_pekerjaan_wali = pw.id_pekerjaan
      WHERE s.id_siswa = ?
    `;

        // If not admin, only allow viewing own data
        if (user.type !== 'admin') {
            query += ' AND s.id_akun = ?';
        }

        const params = user.type === 'admin' ? [id] : [id, user.id];
        const result = await c.env.DB.prepare(query).bind(...params).first();

        if (!result) {
            return c.json({
                success: false,
                message: 'Siswa tidak ditemukan',
            }, 404);
        }

        // Get documents
        const docs = await c.env.DB.prepare(`
      SELECT d.*, jd.nama_jenis_dokumen
      FROM dokumen d
      LEFT JOIN jenis_dokumen jd ON d.id_jenis_dokumen = jd.id_jenis_dokumen
      WHERE d.id_siswa = ?
    `).bind(id).all();

        return c.json({
            success: true,
            data: {
                ...result,
                dokumen: docs.results,
            },
        });
    } catch (error) {
        console.error('Get single siswa error:', error);
        return c.json({
            success: false,
            message: 'Terjadi kesalahan pada server',
        }, 500);
    }
});

// Update siswa status (admin only)
siswa.put('/:id/status', authMiddleware, adminMiddleware, async (c) => {
    try {
        const id = c.req.param('id');
        const { status_siswa, catatan } = await c.req.json();

        await c.env.DB.prepare(`
      UPDATE siswa SET
        status_siswa = ?,
        catatan = COALESCE(?, catatan),
        tanggal_update = datetime('now')
      WHERE id_siswa = ?
    `).bind(status_siswa, catatan, id).run();

        return c.json({
            success: true,
            message: 'Status siswa berhasil diperbarui',
        });
    } catch (error) {
        console.error('Update siswa status error:', error);
        return c.json({
            success: false,
            message: 'Terjadi kesalahan pada server',
        }, 500);
    }
});

// Update siswa data (admin only)
siswa.put('/:id', authMiddleware, adminMiddleware, async (c) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();

        await c.env.DB.prepare(`
      UPDATE siswa SET
        nis = COALESCE(?, nis),
        nisn = COALESCE(?, nisn),
        nama_siswa = COALESCE(?, nama_siswa),
        tempat_lahir = COALESCE(?, tempat_lahir),
        tanggal_lahir = COALESCE(?, tanggal_lahir),
        jenis_kelamin = COALESCE(?, jenis_kelamin),
        id_agama = COALESCE(?, id_agama),
        alamat = COALESCE(?, alamat),
        telepon = COALESCE(?, telepon),
        email = COALESCE(?, email),
        tanggal_update = datetime('now')
      WHERE id_siswa = ?
    `).bind(
            body.nis, body.nisn, body.nama_siswa, body.tempat_lahir,
            body.tanggal_lahir, body.jenis_kelamin, body.id_agama,
            body.alamat, body.telepon, body.email, id
        ).run();

        return c.json({
            success: true,
            message: 'Data siswa berhasil diperbarui',
        });
    } catch (error) {
        console.error('Update siswa error:', error);
        return c.json({
            success: false,
            message: 'Terjadi kesalahan pada server',
        }, 500);
    }
});

// Delete siswa (admin only)
siswa.delete('/:id', authMiddleware, adminMiddleware, async (c) => {
    try {
        const id = c.req.param('id');

        // Delete related documents first
        await c.env.DB.prepare('DELETE FROM dokumen WHERE id_siswa = ?').bind(id).run();
        // Delete siswa
        await c.env.DB.prepare('DELETE FROM siswa WHERE id_siswa = ?').bind(id).run();

        return c.json({
            success: true,
            message: 'Siswa berhasil dihapus',
        });
    } catch (error) {
        console.error('Delete siswa error:', error);
        return c.json({
            success: false,
            message: 'Terjadi kesalahan pada server',
        }, 500);
    }
});

export default siswa;
