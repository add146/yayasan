-- Seed Data for Sekolah Database

-- Insert default admin user (password: admin123)
INSERT INTO users (nama, email, username, password, level, status_user)
VALUES ('Administrator', 'admin@sekolah.com', 'admin', 'f865b53623b121fd34ee5426c792e5c33af8c227', 'Admin', 'Aktif');

-- Insert konfigurasi
INSERT INTO konfigurasi (nama_website, tagline, deskripsi, email, telepon, whatsapp, alamat)
VALUES (
  'SMK N 1 Digital',
  'Mewujudkan Generasi Unggul dan Berakhlak Mulia',
  'Sekolah Menengah Kejuruan Negeri 1 Digital adalah lembaga pendidikan unggulan yang berfokus pada pengembangan teknologi dan karakter siswa.',
  'info@sekolah.com',
  '021-12345678',
  '6281234567890',
  'Jl. Pendidikan No. 1, Kota Jakarta'
);

-- Insert kategori berita
INSERT INTO kategori (id_user, slug_kategori, nama_kategori, urutan) VALUES
(1, 'pengumuman', 'Pengumuman', 1),
(1, 'berita', 'Berita', 2),
(1, 'kegiatan', 'Kegiatan', 3);

-- Insert agama
INSERT INTO agama (id_user, nama_agama, urutan) VALUES
(1, 'Islam', 1),
(1, 'Kristen', 2),
(1, 'Katolik', 3),
(1, 'Hindu', 4),
(1, 'Buddha', 5),
(1, 'Konghucu', 6);

-- Insert hubungan keluarga
INSERT INTO hubungan (id_user, nama_hubungan, urutan) VALUES
(1, 'Anak Kandung', 1),
(1, 'Anak Tiri', 2),
(1, 'Anak Angkat', 3);

-- Insert pekerjaan
INSERT INTO pekerjaan (id_user, nama_pekerjaan, urutan) VALUES
(1, 'PNS', 1),
(1, 'Karyawan Swasta', 2),
(1, 'Wiraswasta', 3),
(1, 'TNI/POLRI', 4),
(1, 'Petani', 5),
(1, 'Buruh', 6),
(1, 'Tidak Bekerja', 7);

-- Insert jenjang
INSERT INTO jenjang (id_user, nama_jenjang, keterangan, urutan, status_aktif) VALUES
(1, 'SD/MI', 'Sekolah Dasar', 1, 'Ya'),
(1, 'SMP/MTs', 'Sekolah Menengah Pertama', 2, 'Ya'),
(1, 'SMA/SMK/MA', 'Sekolah Menengah Atas', 3, 'Ya');

-- Insert jenis dokumen
INSERT INTO jenis_dokumen (id_user, slug_jenis_dokumen, nama_jenis_dokumen, keterangan, status_jenis_dokumen, urutan) VALUES
(1, 'ijazah', 'Ijazah Terakhir', 'Scan ijazah terakhir', 'Wajib', 1),
(1, 'kartu-keluarga', 'Kartu Keluarga', 'Scan KK', 'Wajib', 2),
(1, 'akta-lahir', 'Akta Kelahiran', 'Scan akta lahir', 'Wajib', 3),
(1, 'foto', 'Pas Foto', 'Foto 3x4 latar merah', 'Wajib', 4);

-- Insert kategori staff
INSERT INTO kategori_staff (id_user, slug_kategori_staff, nama_kategori_staff, urutan, status_kategori_staff) VALUES
(1, 'pimpinan', 'Pimpinan', 1, 'Publish'),
(1, 'guru', 'Guru', 2, 'Publish'),
(1, 'tata-usaha', 'Tata Usaha', 3, 'Publish');

-- Insert kategori galeri
INSERT INTO kategori_galeri (id_user, slug_kategori_galeri, nama_kategori_galeri, urutan, status_kategori_galeri) VALUES
(1, 'kegiatan', 'Kegiatan', 1, 'Publish'),
(1, 'fasilitas', 'Fasilitas', 2, 'Publish'),
(1, 'prestasi', 'Prestasi', 3, 'Publish');

-- Insert gelombang PPDB
INSERT INTO gelombang (id_user, tahun_ajaran, tahap, tahun, slug, judul, isi, tanggal_buka, tanggal_tutup, status_gelombang) VALUES
(1, '2026/2027', 1, 2026, 'ppdb-gelombang-1-2026', 'PPDB Gelombang 1 Tahun 2026/2027', 'Penerimaan Peserta Didik Baru Gelombang 1', '2026-01-01', '2026-06-30', 'Buka');
