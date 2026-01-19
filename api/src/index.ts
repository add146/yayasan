import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

// Import routes
import auth from './routes/auth';
import berita from './routes/berita';
import galeri from './routes/galeri';
import siswa from './routes/siswa';
import staff from './routes/staff';
import pendaftaran from './routes/pendaftaran';
import upload from './routes/upload';
import konfigurasi from './routes/konfigurasi';
import kategori from './routes/kategori';
import gelombang from './routes/gelombang';
import jenjangPendidikan from './routes/jenjang';
import halaman from './routes/halaman';
import pesan from './routes/pesan';
import dashboard from './routes/dashboard';
import menu from './routes/menu';
import submenu from './routes/submenu';
import page from './routes/page';
import fasilitas from './routes/fasilitas';

// Types
export interface Env {
    DB: D1Database;
    R2: R2Bucket;

    JWT_SECRET: string;
}

// Create app
const app = new Hono<{ Bindings: Env }>();

// Middleware
app.use('*', logger());
app.use('*', cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
}));

// Health check
app.get('/', (c) => {
    return c.json({
        success: true,
        message: 'Yayasan API - Cloudflare Workers',
        version: '1.0.0',
    });
});

// API Routes
app.route('/api/auth', auth);
app.route('/api/berita', berita);
app.route('/api/galeri', galeri);
app.route('/api/siswa', siswa);
app.route('/api/staff', staff);
app.route('/api/pendaftaran', pendaftaran);
app.route('/api/upload', upload);
app.route('/api/konfigurasi', konfigurasi);
app.route('/api/kategori', kategori);
app.route('/api/gelombang', gelombang);
app.route('/api/jenjang-pendidikan', jenjangPendidikan);
app.route('/api/halaman', halaman);
app.route('/api/pesan', pesan);
app.route('/api/dashboard', dashboard);
app.route('/api/menu', menu);
app.route('/api/submenu', submenu);
app.route('/api/page', page);
app.route('/api/fasilitas', fasilitas);



// 404 handler
app.notFound((c) => {
    return c.json({
        success: false,
        message: 'Endpoint not found',
    }, 404);
});

// Error handler
app.onError((err, c) => {
    console.error(`Error: ${err.message}`);
    return c.json({
        success: false,
        message: err.message || 'Internal Server Error',
    }, 500);
});

export default app;
