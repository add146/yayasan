import { Hono } from 'hono';
import { authMiddleware, adminMiddleware } from '../lib/auth';

type Bindings = {
    DB: D1Database;
};

const dashboard = new Hono<{ Bindings: Bindings }>();

// Get dashboard statistics
dashboard.get('/stats', authMiddleware, adminMiddleware, async (c) => {
    try {
        // Execute all count queries in parallel
        const [beritaResult, galeriResult, siswaResult, staffResult, pendaftarResult, pesanResult] = await Promise.all([
            c.env.DB.prepare('SELECT COUNT(*) as count FROM berita').first(),
            c.env.DB.prepare('SELECT COUNT(*) as count FROM galeri').first(),
            c.env.DB.prepare('SELECT COUNT(*) as count FROM siswa').first(),
            c.env.DB.prepare('SELECT COUNT(*) as count FROM staff').first(),
            c.env.DB.prepare("SELECT COUNT(*) as count FROM siswa WHERE status_siswa = 'Menunggu'").first(),
            c.env.DB.prepare("SELECT COUNT(*) as count FROM pesan_kontak WHERE status = 'Belum Dibaca'").first(),
        ]);

        return c.json({
            success: true,
            data: {
                berita: beritaResult?.count || 0,
                galeri: galeriResult?.count || 0,
                siswa: siswaResult?.count || 0,
                staff: staffResult?.count || 0,
                pendaftar: pendaftarResult?.count || 0,
                pesan_baru: pesanResult?.count || 0,
            }
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan pada server' }, 500);
    }
});

// Get recent activity
dashboard.get('/activity', authMiddleware, adminMiddleware, async (c) => {
    try {
        // Get recent data from various tables
        const [recentBerita, recentSiswa, recentPesan] = await Promise.all([
            c.env.DB.prepare(`
                SELECT id_berita, judul, tanggal_post, 'berita' as type 
                FROM berita 
                ORDER BY tanggal_post DESC 
                LIMIT 5
            `).all(),
            c.env.DB.prepare(`
                SELECT id_siswa, nama_siswa, tanggal_post, status_siswa, 'siswa' as type 
                FROM siswa 
                ORDER BY tanggal_post DESC 
                LIMIT 5
            `).all(),
            c.env.DB.prepare(`
                SELECT id_pesan, nama, tanggal_kirim, 'pesan' as type 
                FROM pesan_kontak 
                ORDER BY tanggal_kirim DESC 
                LIMIT 5
            `).all(),
        ]);

        return c.json({
            success: true,
            data: {
                recent_berita: recentBerita.results,
                recent_siswa: recentSiswa.results,
                recent_pesan: recentPesan.results,
            }
        });
    } catch (error) {
        console.error('Get dashboard activity error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan pada server' }, 500);
    }
});

export default dashboard;
