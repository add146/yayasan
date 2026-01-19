INSERT INTO menu (id_user, nama_menu, link_menu, target_menu, urutan, status_menu, jenis) VALUES 
(1, 'Beranda', '/', '_self', 1, 'Aktif', 'link'),
(1, 'Profil', '#', '_self', 2, 'Aktif', 'link'), -- Placeholder for children
(1, 'Berita', '/berita', '_self', 3, 'Aktif', 'link'),
(1, 'Galeri', '/galeri', '_self', 4, 'Aktif', 'link'),
(1, 'Pendaftaran', '/pendaftaran', '_self', 5, 'Aktif', 'link'),
(1, 'Kontak', '/kontak', '_self', 6, 'Aktif', 'link');

-- Add submenus for Profil (from old hardcoded logic)
-- Assuming id_menu=2 for Profil (based on order above, but IDs might differ if auto-increment is used. 
-- Safer to use nested select or just insert assuming empty table resets ID or just checks result.
-- Since table was empty, ID 1-6 is likely.

INSERT INTO sub_menu (id_menu, id_user, nama_sub_menu, link_sub_menu, urutan, status_sub_menu, jenis) VALUES
(2, 1, 'Tentang Kami', '/profil', 1, 'Aktif', 'link');
