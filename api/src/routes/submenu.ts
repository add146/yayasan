import { Hono } from 'hono';
import { authMiddleware, adminMiddleware } from '../lib/auth';
import { Env } from '../index';

const submenu = new Hono<{ Bindings: Env; Variables: { user: { id: number } } }>();

// Create submenu
submenu.post('/', authMiddleware, adminMiddleware, async (c) => {
    try {
        const user = c.get('user') as { id: number };
        const body = await c.req.json();

        // Generate slug if type is halaman
        let slug = body.slug;
        if (body.jenis === 'halaman' && !slug) {
            slug = body.nama_sub_menu
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
        }

        const result = await c.env.DB.prepare(`
            INSERT INTO sub_menu (
                id_menu, id_user, nama_sub_menu, link_sub_menu, target_sub_menu, 
                icon_sub_menu, urutan, status_sub_menu, slug, konten, jenis, tanggal
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `).bind(
            body.id_menu,
            user.id,
            body.nama_sub_menu,
            body.link_sub_menu || '',
            body.target_sub_menu || '_self',
            body.icon_sub_menu || '',
            body.urutan || 0,
            body.status_sub_menu || 'Aktif',
            slug || null,
            body.konten || null,
            body.jenis || 'link'
        ).run();

        return c.json({
            success: true,
            message: 'Sub Menu berhasil ditambahkan',
            data: { id: result.meta.last_row_id }
        });
    } catch (error) {
        console.error('Create submenu error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

// Update submenu
submenu.put('/:id', authMiddleware, adminMiddleware, async (c) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();

        // Generate slug if type is halaman
        let slug = body.slug;
        if (body.jenis === 'halaman' && !slug && body.nama_sub_menu) {
            slug = body.nama_sub_menu
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
        }

        await c.env.DB.prepare(`
            UPDATE sub_menu SET
                id_menu = ?, nama_sub_menu = ?, link_sub_menu = ?, target_sub_menu = ?, 
                icon_sub_menu = ?, urutan = ?, status_sub_menu = ?, slug = ?, konten = ?, jenis = ?
            WHERE id_sub_menu = ?
        `).bind(
            body.id_menu,
            body.nama_sub_menu,
            body.link_sub_menu || '',
            body.target_sub_menu || '_self',
            body.icon_sub_menu || '',
            body.urutan || 0,
            body.status_sub_menu || 'Aktif',
            slug || null,
            body.konten || null,
            body.jenis || 'link',
            id
        ).run();

        return c.json({ success: true, message: 'Sub Menu berhasil diperbarui' });
    } catch (error) {
        console.error('Update submenu error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

// Delete submenu
submenu.delete('/:id', authMiddleware, adminMiddleware, async (c) => {
    try {
        const id = c.req.param('id');
        await c.env.DB.prepare('DELETE FROM sub_menu WHERE id_sub_menu = ?').bind(id).run();
        return c.json({ success: true, message: 'Sub Menu berhasil dihapus' });
    } catch (error) {
        console.error('Delete submenu error:', error);
        return c.json({ success: false, message: 'Terjadi kesalahan' }, 500);
    }
});

export default submenu;
