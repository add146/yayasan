import { Hono } from 'hono';
import { authMiddleware, adminMiddleware } from '../lib/auth';
import { generateCode } from '../lib/jwt';
import { Env } from '../index';

const pendaftaran = new Hono<{ Bindings: Env }>();

// Get gelombang (public)
pendaftaran.get('/gelombang', async (c) => {
    try {
        const { status } = c.req.query();

        let query = 'SELECT * FROM gelombang WHERE 1=1';
        const params: unknown[] = [];

        if (status) {
            query += ' AND status_gelombang = ?';
            params.push(status);
        }

        query += ' ORDER BY tahun DESC, tahap DESC';

        const result = await c.env.DB.prepare(query).bind(...params).all();

        return c.json({
            success: true,
            data: result.results,
        });
    } catch (error) {
        console.error('Get gelombang error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan pada server' }, 500);
    }
});

// Get jenis dokumen (public)
pendaftaran.get('/jenis-dokumen', async (c) => {
    try {
        const result = await c.env.DB.prepare(
            'SELECT * FROM jenis_dokumen ORDER BY urutan ASC'
        ).all();

        return c.json({
            success: true,
            data: result.results,
        });
    } catch (error) {
        console.error('Get jenis dokumen error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan pada server' }, 500);
    }
});

// Get jenjang pendidikan (public)
pendaftaran.get('/jenjang', async (c) => {
    try {
        const result = await c.env.DB.prepare(`
      SELECT jp.*, j.nama_jenjang
      FROM jenjang_pendidikan jp
      LEFT JOIN jenjang j ON jp.id_jenjang = j.id_jenjang
      WHERE jp.status_jenjang_pendidikan = 'Publish'
      ORDER BY jp.urutan ASC
    `).all();

        return c.json({
            success: true,
            data: result.results,
        });
    } catch (error) {
        console.error('Get jenjang error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan pada server' }, 500);
    }
});

// Submit pendaftaran (requires siswa auth)
pendaftaran.post('/daftar', authMiddleware, async (c) => {
    try {
        const user = c.get('user');

        if (user.type !== 'siswa') {
            return c.json({ success: false, message: 'Akses ditolak' }, 403);
        }

        const body = await c.req.json();
        const kodeSiswa = generateCode(32);

        // Check if already registered
        const existing = await c.env.DB.prepare(
            'SELECT id_siswa FROM siswa WHERE id_akun = ?'
        ).bind(user.id).first();

        if (existing) {
            return c.json({
                success: false,
                message: 'Anda sudah terdaftar. Silakan lengkapi data pendaftaran.',
                data: { id_siswa: existing.id_siswa },
            }, 400);
        }

        const result = await c.env.DB.prepare(`
      INSERT INTO siswa (
        id_akun, id_gelombang, id_jenjang, id_agama, id_hubungan,
        id_pekerjaan_ayah, id_pekerjaan_ibu, id_pekerjaan_wali,
        kode_siswa, nama_siswa, tempat_lahir, tanggal_lahir, jenis_kelamin,
        anak_ke, jumlah_saudara, alamat, rt, rw, kelurahan, kecamatan, kota, provinsi,
        kode_pos, telepon, email, asal_sekolah, nama_ayah, telepon_ayah,
        nama_ibu, telepon_ibu, nama_wali, telepon_wali, alamat_ortu,
        status_siswa, status_pendaftar, tanggal_post
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Menunggu', 'Baru', datetime('now'))
    `).bind(
            user.id, body.id_gelombang, body.id_jenjang, body.id_agama, body.id_hubungan,
            body.id_pekerjaan_ayah || null, body.id_pekerjaan_ibu || null, body.id_pekerjaan_wali || null,
            kodeSiswa, body.nama_siswa, body.tempat_lahir, body.tanggal_lahir, body.jenis_kelamin,
            body.anak_ke || 1, body.jumlah_saudara || 0, body.alamat, body.rt || '', body.rw || '',
            body.kelurahan || '', body.kecamatan || '', body.kota || '', body.provinsi || '',
            body.kode_pos || '', body.telepon || '', body.email || '', body.asal_sekolah || '',
            body.nama_ayah || '', body.telepon_ayah || '', body.nama_ibu || '', body.telepon_ibu || '',
            body.nama_wali || '', body.telepon_wali || '', body.alamat_ortu || ''
        ).run();

        return c.json({
            success: true,
            message: 'Pendaftaran berhasil. Silakan lengkapi dokumen yang diperlukan.',
            data: { id_siswa: result.meta.last_row_id, kode_siswa: kodeSiswa },
        });
    } catch (error) {
        console.error('Submit pendaftaran error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan pada server' }, 500);
    }
});

// Upload dokumen (requires siswa auth)
pendaftaran.post('/dokumen', authMiddleware, async (c) => {
    try {
        const user = c.get('user');
        const body = await c.req.json();

        // Get siswa by akun
        const siswa = await c.env.DB.prepare(
            'SELECT id_siswa FROM siswa WHERE id_akun = ?'
        ).bind(user.id).first();

        if (!siswa) {
            return c.json({
                success: false,
                message: 'Data pendaftaran tidak ditemukan. Silakan daftar terlebih dahulu.',
            }, 400);
        }

        const kodeDokumen = generateCode(32);

        const result = await c.env.DB.prepare(`
      INSERT INTO dokumen (
        id_akun, id_siswa, id_jenis_dokumen, kode_dokumen, gambar,
        file_size, file_ext, status_dokumen, tanggal_post
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'Menunggu', datetime('now'))
    `).bind(
            user.id, siswa.id_siswa, body.id_jenis_dokumen, kodeDokumen,
            body.gambar, body.file_size || 0, body.file_ext || ''
        ).run();

        return c.json({
            success: true,
            message: 'Dokumen berhasil diupload',
            data: { id_dokumen: result.meta.last_row_id },
        });
    } catch (error) {
        console.error('Upload dokumen error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan pada server' }, 500);
    }
});

// Get my pendaftaran status (requires siswa auth)
pendaftaran.get('/status', authMiddleware, async (c) => {
    try {
        const user = c.get('user');

        const siswa = await c.env.DB.prepare(`
      SELECT s.*, g.judul as nama_gelombang, jp.judul_jenjang_pendidikan
      FROM siswa s
      LEFT JOIN gelombang g ON s.id_gelombang = g.id_gelombang
      LEFT JOIN jenjang_pendidikan jp ON s.id_jenjang = jp.id_jenjang_pendidikan
      WHERE s.id_akun = ?
    `).bind(user.id).first();

        if (!siswa) {
            return c.json({
                success: true,
                data: null,
                message: 'Belum ada pendaftaran',
            });
        }

        // Get documents
        const docs = await c.env.DB.prepare(`
      SELECT d.*, jd.nama_jenis_dokumen, jd.status_jenis_dokumen as wajib
      FROM dokumen d
      LEFT JOIN jenis_dokumen jd ON d.id_jenis_dokumen = jd.id_jenis_dokumen
      WHERE d.id_siswa = ?
    `).bind(siswa.id_siswa).all();

        return c.json({
            success: true,
            data: {
                ...siswa,
                dokumen: docs.results,
            },
        });
    } catch (error) {
        console.error('Get status error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan pada server' }, 500);
    }
});

// Admin: Update dokumen status
pendaftaran.put('/dokumen/:id/status', authMiddleware, adminMiddleware, async (c) => {
    try {
        const id = c.req.param('id');
        const { status_dokumen } = await c.req.json();

        await c.env.DB.prepare(`
      UPDATE dokumen SET status_dokumen = ?, tanggal_update = datetime('now')
      WHERE id_dokumen = ?
    `).bind(status_dokumen, id).run();

        return c.json({ success: true, message: 'Status dokumen berhasil diperbarui' });
    } catch (error) {
        console.error('Update dokumen status error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan pada server' }, 500);
    }
});

// Admin: Edit pendaftaran (gelombang dan program)
pendaftaran.put('/edit/:id', authMiddleware, adminMiddleware, async (c) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();

        // Build update query dynamically
        const updates: string[] = [];
        const params: unknown[] = [];

        if (body.id_gelombang !== undefined) {
            updates.push('id_gelombang = ?');
            params.push(body.id_gelombang);
        }

        if (body.id_jenjang !== undefined) {
            updates.push('id_jenjang = ?');
            params.push(body.id_jenjang);
        }

        if (updates.length === 0) {
            return c.json({ success: false, message: 'Tidak ada data yang diubah' }, 400);
        }

        updates.push('tanggal_update = datetime(\'now\')');
        params.push(id);

        const query = `UPDATE siswa SET ${updates.join(', ')} WHERE id_siswa = ?`;
        await c.env.DB.prepare(query).bind(...params).run();

        return c.json({ success: true, message: 'Data pendaftaran berhasil diperbarui' });
    } catch (error) {
        console.error('Edit pendaftaran error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan pada server' }, 500);
    }
});

// Get all gelombang for dropdown (admin)
pendaftaran.get('/gelombang/all', authMiddleware, adminMiddleware, async (c) => {
    try {
        const result = await c.env.DB.prepare(
            'SELECT * FROM gelombang ORDER BY tahun DESC, tahap DESC'
        ).all();

        return c.json({
            success: true,
            data: result.results,
        });
    } catch (error) {
        console.error('Get all gelombang error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan pada server' }, 500);
    }
});

// Get all jenjang for dropdown (admin)
pendaftaran.get('/jenjang/all', authMiddleware, adminMiddleware, async (c) => {
    try {
        const result = await c.env.DB.prepare(`
      SELECT jp.*, j.nama_jenjang
      FROM jenjang_pendidikan jp
      LEFT JOIN jenjang j ON jp.id_jenjang = j.id_jenjang
      ORDER BY jp.urutan ASC
    `).all();

        return c.json({
            success: true,
            data: result.results,
        });
    } catch (error) {
        console.error('Get all jenjang error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan pada server' }, 500);
    }
});

export default pendaftaran;

