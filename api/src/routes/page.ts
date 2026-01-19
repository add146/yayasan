import { Hono } from 'hono';
import { Env } from '../index';

const page = new Hono<{ Bindings: Env }>();

// Get page content by slug (public)
page.get('/:slug', async (c) => {
    try {
        const slug = c.req.param('slug');

        // Check in menu
        const menuResult = await c.env.DB.prepare(
            "SELECT * FROM menu WHERE slug = ? AND status_menu = 'Aktif'"
        ).bind(slug).first();

        if (menuResult) {
            if (menuResult.jenis !== 'halaman') {
                return c.json({ success: false, message: 'Ini adalah link, bukan halaman' }, 400);
            }
            c.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            return c.json({ success: true, data: menuResult });
        }

        // Check in sub_menu
        const subMenuResult = await c.env.DB.prepare(
            "SELECT * FROM sub_menu WHERE slug = ? AND status_sub_menu = 'Aktif'"
        ).bind(slug).first();

        if (subMenuResult) {
            if (subMenuResult.jenis !== 'halaman') {
                return c.json({ success: false, message: 'Ini adalah link, bukan halaman' }, 400);
            }
            c.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            return c.json({ success: true, data: subMenuResult });
        }

        return c.json({ success: false, message: 'Halaman tidak ditemukan' }, 404);
    } catch (error) {
        console.error('Get page error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

export default page;
