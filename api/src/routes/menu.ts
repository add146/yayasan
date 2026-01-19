import { Hono } from 'hono';
import { authMiddleware, adminMiddleware } from '../lib/auth';
import { Env } from '../index';

const menu = new Hono<{ Bindings: Env; Variables: { user: { id: number } } }>();

// Get all menus (public)
menu.get('/', async (c) => {
    try {
        const menus = await c.env.DB.prepare(
            "SELECT * FROM menu WHERE status_menu = 'Aktif' ORDER BY urutan ASC"
        ).all();

        const menuWithSubs = await Promise.all(
            menus.results.map(async (menu: any) => {
                const subs = await c.env.DB.prepare(
                    "SELECT * FROM sub_menu WHERE id_menu = ? AND status_sub_menu = 'Aktif' ORDER BY urutan ASC"
                ).bind(menu.id_menu).all();

                return {
                    ...menu,
                    sub_menu: subs.results,
                };
            })
        );

        c.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        c.header('Pragma', 'no-cache');
        c.header('Expires', '0');
        return c.json({ success: true, data: menuWithSubs });
    } catch (error) {
        console.error('Get menu error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

// Get all menus for admin (including inactive)
menu.get('/admin', authMiddleware, adminMiddleware, async (c) => {
    try {
        const menus = await c.env.DB.prepare(
            "SELECT * FROM menu ORDER BY urutan ASC"
        ).all();

        const menuWithSubs = await Promise.all(
            menus.results.map(async (menu: any) => {
                const subs = await c.env.DB.prepare(
                    "SELECT * FROM sub_menu WHERE id_menu = ? ORDER BY urutan ASC"
                ).bind(menu.id_menu).all();

                return {
                    ...menu,
                    sub_menu: subs.results,
                };
            })
        );

        return c.json({ success: true, data: menuWithSubs });
    } catch (error) {
        console.error('Get menu admin error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

// Create menu
menu.post('/', authMiddleware, adminMiddleware, async (c) => {
    try {
        const user = c.get('user') as { id: number };
        const body = await c.req.json();

        // Generate slug if type is halaman
        let slug = body.slug;
        if (body.jenis === 'halaman' && !slug) {
            slug = body.nama_menu
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
        }

        const result = await c.env.DB.prepare(`
            INSERT INTO menu (
                id_user, nama_menu, link_menu, target_menu, icon_menu, 
                urutan, status_menu, slug, konten, jenis, tanggal
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `).bind(
            user.id,
            body.nama_menu,
            body.link_menu || '',
            body.target_menu || '_self',
            body.icon_menu || '',
            body.urutan || 0,
            body.status_menu || 'Aktif',
            slug || null,
            body.konten || null,
            body.jenis || 'link'
        ).run();

        return c.json({
            success: true,
            message: 'Menu berhasil ditambahkan',
            data: { id: result.meta.last_row_id }
        });
    } catch (error) {
        console.error('Create menu error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

// Update menu
menu.put('/:id', authMiddleware, adminMiddleware, async (c) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();

        // Generate slug if type is halaman
        let slug = body.slug;
        if (body.jenis === 'halaman' && !slug && body.nama_menu) {
            slug = body.nama_menu
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
        }

        await c.env.DB.prepare(`
            UPDATE menu SET
                nama_menu = ?, link_menu = ?, target_menu = ?, icon_menu = ?,
                urutan = ?, status_menu = ?, slug = ?, konten = ?, jenis = ?
            WHERE id_menu = ?
        `).bind(
            body.nama_menu,
            body.link_menu || '',
            body.target_menu || '_self',
            body.icon_menu || '',
            body.urutan || 0,
            body.status_menu || 'Aktif',
            slug || null,
            body.konten || null,
            body.jenis || 'link',
            id
        ).run();

        return c.json({ success: true, message: 'Menu berhasil diperbarui' });
    } catch (error) {
        console.error('Update menu error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

// Delete menu
menu.delete('/:id', authMiddleware, adminMiddleware, async (c) => {
    try {
        const id = c.req.param('id');

        // Check for submenus
        const submenus = await c.env.DB.prepare('SELECT COUNT(*) as count FROM sub_menu WHERE id_menu = ?').bind(id).first();
        if (submenus && (submenus.count as number) > 0) {
            return c.json({ success: false, message: 'Menu memiliki sub-menu, hapus sub-menu terlebih dahulu' }, 400);
        }

        await c.env.DB.prepare('DELETE FROM menu WHERE id_menu = ?').bind(id).run();
        return c.json({ success: true, message: 'Menu berhasil dihapus' });
    } catch (error) {
        console.error('Delete menu error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

export default menu;
