import { Hono } from 'hono';
import { authMiddleware, adminMiddleware } from '../lib/auth';
import { Env } from '../index';

const konfigurasi = new Hono<{ Bindings: Env }>();

// Get konfigurasi (public)
konfigurasi.get('/', async (c) => {
    try {
        const result = await c.env.DB.prepare(
            'SELECT * FROM konfigurasi LIMIT 1'
        ).first();

        return c.json({
            success: true,
            data: result || {},
        });
    } catch (error) {
        console.error('Get konfigurasi error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

// Update konfigurasi (admin only)
konfigurasi.put('/', authMiddleware, adminMiddleware, async (c) => {
    try {
        const body = await c.req.json();

        // Check if konfigurasi exists
        const existing = await c.env.DB.prepare('SELECT id_konfigurasi FROM konfigurasi LIMIT 1').first();

        if (existing) {
            await c.env.DB.prepare(`
        UPDATE konfigurasi SET
          nama_website = COALESCE(?, nama_website),
          tagline = COALESCE(?, tagline),
          deskripsi = COALESCE(?, deskripsi),
          keywords = COALESCE(?, keywords),
          meta_title = COALESCE(?, meta_title),
          meta_description = COALESCE(?, meta_description),
          og_image = COALESCE(?, og_image),
          email = COALESCE(?, email),
          telepon = COALESCE(?, telepon),
          whatsapp = COALESCE(?, whatsapp),
          alamat = COALESCE(?, alamat),
          google_map = COALESCE(?, google_map),
          facebook = COALESCE(?, facebook),
          twitter = COALESCE(?, twitter),
          instagram = COALESCE(?, instagram),
          youtube = COALESCE(?, youtube),
          linkedin = COALESCE(?, linkedin),
          logo = COALESCE(?, logo),
          icon = COALESCE(?, icon),
          favicon = COALESCE(?, favicon),
          about_us = COALESCE(?, about_us),
          stat1_value = COALESCE(?, stat1_value),
          stat1_label = COALESCE(?, stat1_label),
          stat2_value = COALESCE(?, stat2_value),
          stat2_label = COALESCE(?, stat2_label),
          stat3_value = COALESCE(?, stat3_value),
          stat3_label = COALESCE(?, stat3_label),
          stat4_value = COALESCE(?, stat4_value),
          stat4_label = COALESCE(?, stat4_label),
          visi = COALESCE(?, visi),
          misi = COALESCE(?, misi),
          rencana = COALESCE(?, rencana),
          program1_title = COALESCE(?, program1_title),
          program1_desc = COALESCE(?, program1_desc),
          program2_title = COALESCE(?, program2_title),
          program2_desc = COALESCE(?, program2_desc),
          program3_title = COALESCE(?, program3_title),
          program3_desc = COALESCE(?, program3_desc),
          program4_title = COALESCE(?, program4_title),
          program4_desc = COALESCE(?, program4_desc),
          warna_primary = COALESCE(?, warna_primary),
          warna_secondary = COALESCE(?, warna_secondary),
          poster1 = COALESCE(?, poster1),
          poster2 = COALESCE(?, poster2),
          tampilkan_statistik = COALESCE(?, tampilkan_statistik),
          tampilkan_konten = COALESCE(?, tampilkan_konten),
          tampilkan_program = COALESCE(?, tampilkan_program),
          tampilkan_berita = COALESCE(?, tampilkan_berita),
          tampilkan_galeri = COALESCE(?, tampilkan_galeri),
          tampilkan_fasilitas = COALESCE(?, tampilkan_fasilitas),
          kategori_berita = COALESCE(?, kategori_berita),
          tanggal_update = datetime('now')
        WHERE id_konfigurasi = ?
      `).bind(
                body.nama_website, body.tagline, body.deskripsi, body.keywords,
                body.meta_title, body.meta_description, body.og_image,
                body.email, body.telepon, body.whatsapp, body.alamat, body.google_map,
                body.facebook, body.twitter, body.instagram, body.youtube, body.linkedin,
                body.logo, body.icon, body.favicon, body.about_us,
                body.stat1_value, body.stat1_label, body.stat2_value, body.stat2_label,
                body.stat3_value, body.stat3_label, body.stat4_value, body.stat4_label,
                body.visi, body.misi, body.rencana,
                body.program1_title, body.program1_desc,
                body.program2_title, body.program2_desc,
                body.program3_title, body.program3_desc,
                body.program4_title, body.program4_desc,
                body.warna_primary, body.warna_secondary,
                body.poster1, body.poster2,
                body.tampilkan_statistik, body.tampilkan_konten, body.tampilkan_program, body.tampilkan_berita, body.tampilkan_galeri, body.tampilkan_fasilitas,
                body.kategori_berita,
                existing.id_konfigurasi
            ).run();
        } else {
            await c.env.DB.prepare(`
        INSERT INTO konfigurasi (
          nama_website, tagline, deskripsi, keywords, email, telepon, whatsapp,
          alamat, google_map, facebook, twitter, instagram, youtube, linkedin,
          logo, icon, favicon, about_us
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
                body.nama_website || '', body.tagline || '', body.deskripsi || '', body.keywords || '',
                body.email || '', body.telepon || '', body.whatsapp || '', body.alamat || '',
                body.google_map || '', body.facebook || '', body.twitter || '', body.instagram || '',
                body.youtube || '', body.linkedin || '', body.logo || '', body.icon || '',
                body.favicon || '', body.about_us || ''
            ).run();
        }

        return c.json({ success: true, message: 'Konfigurasi berhasil diperbarui' });
    } catch (error) {
        console.error('Update konfigurasi error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

// Get menu (public)
konfigurasi.get('/menu', async (c) => {
    try {
        const menus = await c.env.DB.prepare(
            "SELECT * FROM menu WHERE status_menu = 'Aktif' ORDER BY urutan ASC"
        ).all();

        // Get sub menus for each menu
        const menuWithSubs = await Promise.all(
            menus.results.map(async (menu: Record<string, unknown>) => {
                const subs = await c.env.DB.prepare(
                    "SELECT * FROM sub_menu WHERE id_menu = ? AND status_sub_menu = 'Aktif' ORDER BY urutan ASC"
                ).bind(menu.id_menu).all();

                return {
                    ...menu,
                    sub_menu: subs.results,
                };
            })
        );

        return c.json({ success: true, data: menuWithSubs });
    } catch (error) {
        console.error('Get menu error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

// Get link website (public)
konfigurasi.get('/links', async (c) => {
    try {
        const result = await c.env.DB.prepare(
            "SELECT * FROM link_website WHERE status_link_website = 'Publish' ORDER BY urutan ASC"
        ).all();

        return c.json({ success: true, data: result.results });
    } catch (error) {
        console.error('Get links error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

// Get video (public)
konfigurasi.get('/video', async (c) => {
    try {
        const { limit = '10', offset = '0' } = c.req.query();

        const result = await c.env.DB.prepare(`
      SELECT * FROM video WHERE status_video = 'Publish'
      ORDER BY urutan ASC, tanggal_post DESC
      LIMIT ? OFFSET ?
    `).bind(parseInt(limit), parseInt(offset)).all();

        return c.json({ success: true, data: result.results });
    } catch (error) {
        console.error('Get video error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

// Get download (public)
konfigurasi.get('/download', async (c) => {
    try {
        const { kategori, limit = '10', offset = '0' } = c.req.query();

        let query = `
      SELECT d.*, kd.nama_kategori_download
      FROM download d
      LEFT JOIN kategori_download kd ON d.id_kategori_download = kd.id_kategori_download
      WHERE d.status_download = 'Publish'
    `;
        const params: unknown[] = [];

        if (kategori) {
            query += ' AND kd.slug_kategori_download = ?';
            params.push(kategori);
        }

        query += ' ORDER BY d.tanggal_post DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const result = await c.env.DB.prepare(query).bind(...params).all();

        return c.json({ success: true, data: result.results });
    } catch (error) {
        console.error('Get download error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

// Get ekstrakurikuler (public)
konfigurasi.get('/ekstrakurikuler', async (c) => {
    try {
        const result = await c.env.DB.prepare(`
      SELECT e.*, ke.nama_kategori_ekstrakurikuler
      FROM ekstrakurikuler e
      LEFT JOIN kategori_ekstrakurikuler ke ON e.id_kategori_ekstrakurikuler = ke.id_kategori_ekstrakurikuler
      WHERE e.status_ekstrakurikuler = 'Publish'
      ORDER BY e.tanggal_post DESC
    `).all();

        return c.json({ success: true, data: result.results });
    } catch (error) {
        console.error('Get ekstrakurikuler error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

// Get fasilitas (public)
konfigurasi.get('/fasilitas', async (c) => {
    try {
        const result = await c.env.DB.prepare(`
      SELECT f.*, kf.nama_kategori_fasilitas
      FROM fasilitas f
      LEFT JOIN kategori_fasilitas kf ON f.id_kategori_fasilitas = kf.id_kategori_fasilitas
      WHERE f.status_fasilitas = 'Publish'
      ORDER BY f.tanggal_post DESC
    `).all();

        return c.json({ success: true, data: result.results });
    } catch (error) {
        console.error('Get fasilitas error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

// Get prestasi (public)
konfigurasi.get('/prestasi', async (c) => {
    try {
        const result = await c.env.DB.prepare(`
      SELECT p.*, kp.nama_kategori_prestasi
      FROM prestasi p
      LEFT JOIN kategori_prestasi kp ON p.id_kategori_prestasi = kp.id_kategori_prestasi
      WHERE p.status_prestasi = 'Publish'
      ORDER BY p.tahun_prestasi DESC, p.tanggal_post DESC
    `).all();

        return c.json({ success: true, data: result.results });
    } catch (error) {
        console.error('Get prestasi error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

// Get client/mitra (public)
konfigurasi.get('/client', async (c) => {
    try {
        const result = await c.env.DB.prepare(`
      SELECT c.*, kc.nama_kategori_client
      FROM client c
      LEFT JOIN kategori_client kc ON c.id_kategori_client = kc.id_kategori_client
      WHERE c.status_client = 'Publish'
      ORDER BY c.tanggal_post DESC
    `).all();

        return c.json({ success: true, data: result.results });
    } catch (error) {
        console.error('Get client error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

// ===== FASILITAS CRUD =====
konfigurasi.post('/fasilitas', authMiddleware, adminMiddleware, async (c) => {
    try {
        const user = c.get('user') as { id: number };
        const body = await c.req.json();

        await c.env.DB.prepare(`
            INSERT INTO fasilitas (id_kategori_fasilitas, id_user, judul_fasilitas, kondisi_fasilitas, isi, gambar, status_fasilitas, tanggal_post)
            VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `).bind(1, user.id, body.judul_fasilitas, body.kondisi_fasilitas || 'Baik', body.isi_fasilitas || '', body.icon || '', body.status_fasilitas || 'Publish').run();

        return c.json({ success: true, message: 'Fasilitas berhasil ditambahkan' });
    } catch (error) {
        console.error('Create fasilitas error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

konfigurasi.put('/fasilitas/:id', authMiddleware, adminMiddleware, async (c) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();

        await c.env.DB.prepare(`
            UPDATE fasilitas SET judul_fasilitas = ?, isi = ?, gambar = ?
            WHERE id_fasilitas = ?
        `).bind(body.judul_fasilitas, body.isi_fasilitas, body.icon, id).run();

        return c.json({ success: true, message: 'Fasilitas berhasil diperbarui' });
    } catch (error) {
        console.error('Update fasilitas error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

konfigurasi.delete('/fasilitas/:id', authMiddleware, adminMiddleware, async (c) => {
    try {
        const id = c.req.param('id');
        await c.env.DB.prepare('DELETE FROM fasilitas WHERE id_fasilitas = ?').bind(id).run();
        return c.json({ success: true, message: 'Fasilitas berhasil dihapus' });
    } catch (error) {
        console.error('Delete fasilitas error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

// ===== PRESTASI CRUD =====
konfigurasi.post('/prestasi', authMiddleware, adminMiddleware, async (c) => {
    try {
        const user = c.get('user') as { id: number };
        const body = await c.req.json();

        await c.env.DB.prepare(`
            INSERT INTO prestasi (id_kategori_prestasi, id_user, judul_prestasi, tingkat_prestasi, tahun_prestasi, isi, status_prestasi, tanggal_post)
            VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `).bind(1, user.id, body.judul_prestasi, body.tingkat_prestasi || 'Kabupaten', body.tahun_prestasi || new Date().getFullYear(), body.isi_prestasi || '', body.status_prestasi || 'Publish').run();

        return c.json({ success: true, message: 'Prestasi berhasil ditambahkan' });
    } catch (error) {
        console.error('Create prestasi error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

konfigurasi.put('/prestasi/:id', authMiddleware, adminMiddleware, async (c) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();

        await c.env.DB.prepare(`
            UPDATE prestasi SET judul_prestasi = ?, tingkat_prestasi = ?, tahun_prestasi = ?, isi = ?
            WHERE id_prestasi = ?
        `).bind(body.judul_prestasi, body.tingkat_prestasi, body.tahun_prestasi, body.isi_prestasi, id).run();

        return c.json({ success: true, message: 'Prestasi berhasil diperbarui' });
    } catch (error) {
        console.error('Update prestasi error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

konfigurasi.delete('/prestasi/:id', authMiddleware, adminMiddleware, async (c) => {
    try {
        const id = c.req.param('id');
        await c.env.DB.prepare('DELETE FROM prestasi WHERE id_prestasi = ?').bind(id).run();
        return c.json({ success: true, message: 'Prestasi berhasil dihapus' });
    } catch (error) {
        console.error('Delete prestasi error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

// ===== SLIDER CRUD =====
konfigurasi.get('/slider', async (c) => {
    try {
        const result = await c.env.DB.prepare(`
            SELECT * FROM slider WHERE status_slider = 'Publish' ORDER BY urutan ASC
        `).all();
        return c.json({ success: true, data: result.results });
    } catch (error) {
        console.error('Get slider error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

konfigurasi.post('/slider', authMiddleware, adminMiddleware, async (c) => {
    try {
        const user = c.get('user') as { id: number };
        const body = await c.req.json();

        await c.env.DB.prepare(`
            INSERT INTO slider (id_user, judul_slider, subjudul_slider, gambar, link, urutan, status_slider, tanggal_post)
            VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `).bind(user.id, body.judul_slider || '', body.subjudul_slider || '', body.gambar, body.link || '', body.urutan || 1, body.status_slider || 'Publish').run();

        return c.json({ success: true, message: 'Slider berhasil ditambahkan' });
    } catch (error) {
        console.error('Create slider error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

konfigurasi.put('/slider/:id', authMiddleware, adminMiddleware, async (c) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();

        await c.env.DB.prepare(`
            UPDATE slider SET judul_slider = ?, subjudul_slider = ?, gambar = ?, link = ?, urutan = ?, status_slider = ?, tanggal_update = datetime('now')
            WHERE id_slider = ?
        `).bind(body.judul_slider, body.subjudul_slider, body.gambar, body.link, body.urutan, body.status_slider, id).run();

        return c.json({ success: true, message: 'Slider berhasil diperbarui' });
    } catch (error) {
        console.error('Update slider error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

konfigurasi.delete('/slider/:id', authMiddleware, adminMiddleware, async (c) => {
    try {
        const id = c.req.param('id');
        await c.env.DB.prepare('DELETE FROM slider WHERE id_slider = ?').bind(id).run();
        return c.json({ success: true, message: 'Slider berhasil dihapus' });
    } catch (error) {
        console.error('Delete slider error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

export default konfigurasi;
