-- =====================================================
-- Sekolah Database Schema for Cloudflare D1 (SQLite)
-- Converted from MySQL
-- =====================================================

-- Users (Admin)
CREATE TABLE IF NOT EXISTS users (
    id_user INTEGER PRIMARY KEY AUTOINCREMENT,
    nama VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    level VARCHAR(20) DEFAULT 'Admin',
    foto VARCHAR(255),
    status_user VARCHAR(20) DEFAULT 'Aktif',
    tanggal_post DATETIME DEFAULT CURRENT_TIMESTAMP,
    tanggal_update DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Akun (Siswa/Pendaftar)
CREATE TABLE IF NOT EXISTS akun (
    id_akun INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER DEFAULT 0,
    nis VARCHAR(32),
    nisn VARCHAR(32),
    jenis_akun VARCHAR(20) NOT NULL,
    status_akun VARCHAR(20) DEFAULT 'Menunggu',
    nama VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(64) NOT NULL,
    password_hint VARCHAR(64),
    telepon VARCHAR(50),
    alamat VARCHAR(300),
    foto VARCHAR(255),
    kode_akun VARCHAR(255),
    link_reset VARCHAR(255),
    tanggal_post DATETIME DEFAULT CURRENT_TIMESTAMP,
    tanggal_update DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Agama
CREATE TABLE IF NOT EXISTS agama (
    id_agama INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER NOT NULL,
    nama_agama VARCHAR(255) NOT NULL,
    urutan INTEGER DEFAULT 0,
    tanggal_update DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Kategori Berita
CREATE TABLE IF NOT EXISTS kategori (
    id_kategori INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER NOT NULL,
    slug_kategori VARCHAR(255) NOT NULL,
    nama_kategori VARCHAR(255) NOT NULL,
    urutan INTEGER DEFAULT 0,
    hits INTEGER DEFAULT 0,
    tanggal DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Berita
CREATE TABLE IF NOT EXISTS berita (
    id_berita INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER NOT NULL,
    id_kategori INTEGER NOT NULL,
    slug_berita VARCHAR(255) NOT NULL,
    judul_berita VARCHAR(255) NOT NULL,
    ringkasan VARCHAR(500),
    isi TEXT NOT NULL,
    status_berita VARCHAR(20) DEFAULT 'Draft',
    jenis_berita VARCHAR(20) DEFAULT 'Berita',
    keywords TEXT,
    gambar VARCHAR(255),
    icon VARCHAR(255),
    hits INTEGER DEFAULT 0,
    urutan INTEGER DEFAULT 0,
    tanggal_post DATETIME DEFAULT CURRENT_TIMESTAMP,
    tanggal_publish DATETIME,
    tanggal DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_kategori) REFERENCES kategori(id_kategori)
);

-- Galeri
CREATE TABLE IF NOT EXISTS galeri (
    id_galeri INTEGER PRIMARY KEY AUTOINCREMENT,
    id_kategori_galeri INTEGER NOT NULL,
    id_user INTEGER NOT NULL,
    judul_galeri VARCHAR(200),
    jenis_galeri VARCHAR(20) DEFAULT 'Homepage',
    isi TEXT,
    gambar VARCHAR(255) NOT NULL,
    website VARCHAR(255),
    text_website VARCHAR(255),
    hits INTEGER DEFAULT 0,
    status_text VARCHAR(10) DEFAULT 'Ya',
    tanggal_post DATETIME DEFAULT CURRENT_TIMESTAMP,
    tanggal DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Kategori Galeri
CREATE TABLE IF NOT EXISTS kategori_galeri (
    id_kategori_galeri INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER NOT NULL,
    slug_kategori_galeri VARCHAR(255) NOT NULL,
    nama_kategori_galeri VARCHAR(255) NOT NULL,
    keterangan TEXT,
    urutan INTEGER DEFAULT 0,
    hits INTEGER DEFAULT 0,
    gambar VARCHAR(255),
    status_kategori_galeri VARCHAR(255) DEFAULT 'Publish',
    tanggal DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Video
CREATE TABLE IF NOT EXISTS video (
    id_video INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER NOT NULL,
    judul_video VARCHAR(255) NOT NULL,
    link_video VARCHAR(255) NOT NULL,
    keterangan TEXT,
    status_video VARCHAR(20) DEFAULT 'Publish',
    urutan INTEGER DEFAULT 0,
    tanggal_post DATETIME DEFAULT CURRENT_TIMESTAMP,
    tanggal DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Staff
CREATE TABLE IF NOT EXISTS staff (
    id_staff INTEGER PRIMARY KEY AUTOINCREMENT,
    id_kategori_staff INTEGER NOT NULL,
    id_user INTEGER NOT NULL,
    slug_staff VARCHAR(255),
    nama_staff VARCHAR(255) NOT NULL,
    gelar_depan VARCHAR(50),
    gelar_belakang VARCHAR(50),
    jabatan VARCHAR(255),
    nip VARCHAR(50),
    email VARCHAR(255),
    telepon VARCHAR(50),
    tempat_lahir VARCHAR(255),
    tanggal_lahir DATE,
    jenis_kelamin VARCHAR(20),
    alamat TEXT,
    isi TEXT,
    gambar VARCHAR(255),
    facebook VARCHAR(255),
    twitter VARCHAR(255),
    instagram VARCHAR(255),
    linkedin VARCHAR(255),
    status_staff VARCHAR(20) DEFAULT 'Publish',
    urutan INTEGER DEFAULT 0,
    tanggal_post DATETIME DEFAULT CURRENT_TIMESTAMP,
    tanggal DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Kategori Staff
CREATE TABLE IF NOT EXISTS kategori_staff (
    id_kategori_staff INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER NOT NULL,
    slug_kategori_staff VARCHAR(255) NOT NULL,
    nama_kategori_staff VARCHAR(255) NOT NULL,
    keterangan TEXT,
    urutan INTEGER DEFAULT 0,
    gambar VARCHAR(255),
    status_kategori_staff VARCHAR(255) DEFAULT 'Publish',
    tanggal DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Siswa
CREATE TABLE IF NOT EXISTS siswa (
    id_siswa INTEGER PRIMARY KEY AUTOINCREMENT,
    id_akun INTEGER,
    id_user INTEGER,
    id_gelombang INTEGER,
    id_jenjang INTEGER,
    id_agama INTEGER,
    id_hubungan INTEGER,
    id_pekerjaan_ayah INTEGER,
    id_pekerjaan_ibu INTEGER,
    id_pekerjaan_wali INTEGER,
    kode_siswa VARCHAR(32),
    nis VARCHAR(32),
    nisn VARCHAR(32),
    nama_siswa VARCHAR(255) NOT NULL,
    tempat_lahir VARCHAR(255),
    tanggal_lahir DATE,
    jenis_kelamin VARCHAR(20),
    anak_ke INTEGER,
    jumlah_saudara INTEGER,
    alamat TEXT,
    rt VARCHAR(10),
    rw VARCHAR(10),
    kelurahan VARCHAR(100),
    kecamatan VARCHAR(100),
    kota VARCHAR(100),
    provinsi VARCHAR(100),
    kode_pos VARCHAR(10),
    telepon VARCHAR(50),
    email VARCHAR(255),
    asal_sekolah VARCHAR(255),
    nama_ayah VARCHAR(255),
    telepon_ayah VARCHAR(50),
    nama_ibu VARCHAR(255),
    telepon_ibu VARCHAR(50),
    nama_wali VARCHAR(255),
    telepon_wali VARCHAR(50),
    alamat_ortu TEXT,
    gambar VARCHAR(255),
    status_siswa VARCHAR(20) DEFAULT 'Menunggu',
    status_pendaftar VARCHAR(20) DEFAULT 'Baru',
    catatan TEXT,
    tanggal_post DATETIME DEFAULT CURRENT_TIMESTAMP,
    tanggal_update DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Gelombang PPDB
CREATE TABLE IF NOT EXISTS gelombang (
    id_gelombang INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER NOT NULL,
    tahun_ajaran VARCHAR(10) NOT NULL,
    tahap INTEGER,
    tahun INTEGER NOT NULL,
    slug VARCHAR(255) NOT NULL,
    judul VARCHAR(200) NOT NULL,
    isi TEXT NOT NULL,
    tanggal_buka DATE NOT NULL,
    tanggal_tutup DATE NOT NULL,
    tanggal_pengumuman DATE,
    status_gelombang VARCHAR(11) DEFAULT 'Tutup',
    gambar VARCHAR(200),
    tanggal DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Jenjang Pendidikan Master
CREATE TABLE IF NOT EXISTS jenjang (
    id_jenjang INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER,
    nama_jenjang VARCHAR(255) NOT NULL,
    keterangan VARCHAR(255),
    urutan INTEGER DEFAULT 0,
    status_aktif VARCHAR(10) DEFAULT 'Ya',
    tanggal_update DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Jenjang Pendidikan (Jurusan)
CREATE TABLE IF NOT EXISTS jenjang_pendidikan (
    id_jenjang_pendidikan INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER NOT NULL,
    id_jenjang INTEGER NOT NULL,
    slug_jenjang_pendidikan VARCHAR(255) NOT NULL,
    judul_jenjang_pendidikan VARCHAR(255) NOT NULL,
    ringkasan VARCHAR(500),
    isi TEXT NOT NULL,
    status_jenjang_pendidikan VARCHAR(20) DEFAULT 'Publish',
    jenis_jenjang_pendidikan VARCHAR(20) DEFAULT 'Jenjang',
    keywords TEXT,
    gambar VARCHAR(255),
    icon VARCHAR(255),
    hits INTEGER DEFAULT 0,
    urutan INTEGER DEFAULT 0,
    tanggal_post DATETIME DEFAULT CURRENT_TIMESTAMP,
    tanggal_publish DATETIME,
    tanggal DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Dokumen Pendaftaran
CREATE TABLE IF NOT EXISTS dokumen (
    id_dokumen INTEGER PRIMARY KEY AUTOINCREMENT,
    id_akun INTEGER NOT NULL,
    id_siswa INTEGER NOT NULL,
    id_jenis_dokumen INTEGER NOT NULL,
    kode_dokumen VARCHAR(32) NOT NULL,
    gambar VARCHAR(255) NOT NULL,
    file_size DECIMAL(4,3),
    file_ext VARCHAR(20),
    status_dokumen VARCHAR(20) DEFAULT 'Menunggu',
    tanggal_post DATETIME DEFAULT CURRENT_TIMESTAMP,
    tanggal_update DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Jenis Dokumen
CREATE TABLE IF NOT EXISTS jenis_dokumen (
    id_jenis_dokumen INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER,
    slug_jenis_dokumen VARCHAR(255) NOT NULL,
    nama_jenis_dokumen VARCHAR(255) NOT NULL,
    keterangan TEXT,
    status_jenis_dokumen VARCHAR(20) DEFAULT 'Wajib',
    urutan INTEGER DEFAULT 0,
    gambar VARCHAR(255),
    tanggal_post DATETIME DEFAULT CURRENT_TIMESTAMP,
    tanggal DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Download
CREATE TABLE IF NOT EXISTS download (
    id_download INTEGER PRIMARY KEY AUTOINCREMENT,
    id_kategori_download INTEGER NOT NULL,
    id_user INTEGER NOT NULL,
    judul_download VARCHAR(200),
    jenis_download VARCHAR(20) DEFAULT 'Download',
    isi TEXT,
    gambar VARCHAR(255) NOT NULL,
    website VARCHAR(255),
    hits INTEGER DEFAULT 0,
    file_ext VARCHAR(255),
    file_size DECIMAL(4,3),
    status_download VARCHAR(20) DEFAULT 'Publish',
    tanggal_post DATETIME DEFAULT CURRENT_TIMESTAMP,
    tanggal DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Kategori Download
CREATE TABLE IF NOT EXISTS kategori_download (
    id_kategori_download INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER NOT NULL,
    slug_kategori_download VARCHAR(255) NOT NULL,
    nama_kategori_download VARCHAR(255) NOT NULL,
    keterangan TEXT,
    urutan INTEGER DEFAULT 0,
    hits INTEGER DEFAULT 0,
    gambar VARCHAR(255),
    status_kategori_download VARCHAR(255) DEFAULT 'Publish',
    tanggal_post DATETIME,
    tanggal DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Ekstrakurikuler
CREATE TABLE IF NOT EXISTS ekstrakurikuler (
    id_ekstrakurikuler INTEGER PRIMARY KEY AUTOINCREMENT,
    id_kategori_ekstrakurikuler INTEGER NOT NULL,
    id_user INTEGER NOT NULL,
    slug_ekstrakurikuler VARCHAR(255) NOT NULL,
    judul_ekstrakurikuler VARCHAR(200),
    nama_penanggung_jawab VARCHAR(255),
    isi TEXT,
    gambar VARCHAR(255),
    website VARCHAR(255),
    text_website VARCHAR(255),
    hits INTEGER DEFAULT 0,
    status_text VARCHAR(10) DEFAULT 'Ya',
    status_ekstrakurikuler VARCHAR(20) DEFAULT 'Publish',
    tanggal_post DATETIME DEFAULT CURRENT_TIMESTAMP,
    tanggal DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Kategori Ekstrakurikuler
CREATE TABLE IF NOT EXISTS kategori_ekstrakurikuler (
    id_kategori_ekstrakurikuler INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER NOT NULL,
    slug_kategori_ekstrakurikuler VARCHAR(255) NOT NULL,
    nama_kategori_ekstrakurikuler VARCHAR(255) NOT NULL,
    keterangan TEXT,
    urutan INTEGER DEFAULT 0,
    hits INTEGER DEFAULT 0,
    gambar VARCHAR(255),
    status_kategori_ekstrakurikuler VARCHAR(255) DEFAULT 'Publish',
    tanggal_post DATETIME,
    tanggal DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Fasilitas
CREATE TABLE IF NOT EXISTS fasilitas (
    id_fasilitas INTEGER PRIMARY KEY AUTOINCREMENT,
    id_kategori_fasilitas INTEGER NOT NULL,
    id_user INTEGER NOT NULL,
    slug_fasilitas VARCHAR(255),
    judul_fasilitas VARCHAR(200),
    kode_nomor_fasilitas VARCHAR(255),
    kondisi_fasilitas VARCHAR(200),
    tahun_fasilitas INTEGER,
    tanggal_fasilitas DATE,
    isi TEXT,
    gambar VARCHAR(255),
    website VARCHAR(255),
    text_website VARCHAR(255),
    hits INTEGER DEFAULT 0,
    status_text VARCHAR(10) DEFAULT 'Ya',
    status_fasilitas VARCHAR(20) DEFAULT 'Publish',
    tanggal_post DATETIME DEFAULT CURRENT_TIMESTAMP,
    tanggal DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Kategori Fasilitas
CREATE TABLE IF NOT EXISTS kategori_fasilitas (
    id_kategori_fasilitas INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER NOT NULL,
    slug_kategori_fasilitas VARCHAR(255) NOT NULL,
    nama_kategori_fasilitas VARCHAR(255) NOT NULL,
    keterangan TEXT,
    urutan INTEGER DEFAULT 0,
    hits INTEGER DEFAULT 0,
    gambar VARCHAR(255),
    status_kategori_fasilitas VARCHAR(255) DEFAULT 'Publish',
    tanggal_post DATETIME,
    tanggal DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Prestasi
CREATE TABLE IF NOT EXISTS prestasi (
    id_prestasi INTEGER PRIMARY KEY AUTOINCREMENT,
    id_kategori_prestasi INTEGER NOT NULL,
    id_user INTEGER NOT NULL,
    slug_prestasi VARCHAR(255),
    judul_prestasi VARCHAR(200),
    tingkat_prestasi VARCHAR(100),
    tahun_prestasi INTEGER,
    isi TEXT,
    gambar VARCHAR(255),
    status_prestasi VARCHAR(20) DEFAULT 'Publish',
    urutan INTEGER DEFAULT 0,
    tanggal_post DATETIME DEFAULT CURRENT_TIMESTAMP,
    tanggal DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Kategori Prestasi
CREATE TABLE IF NOT EXISTS kategori_prestasi (
    id_kategori_prestasi INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER NOT NULL,
    slug_kategori_prestasi VARCHAR(255) NOT NULL,
    nama_kategori_prestasi VARCHAR(255) NOT NULL,
    keterangan TEXT,
    urutan INTEGER DEFAULT 0,
    hits INTEGER DEFAULT 0,
    gambar VARCHAR(255),
    status_kategori_prestasi VARCHAR(255) DEFAULT 'Publish',
    tanggal_post DATETIME,
    tanggal DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Hubungan Keluarga
CREATE TABLE IF NOT EXISTS hubungan (
    id_hubungan INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER,
    nama_hubungan VARCHAR(255) NOT NULL,
    keterangan VARCHAR(255),
    urutan INTEGER DEFAULT 0,
    tanggal_update DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Pekerjaan
CREATE TABLE IF NOT EXISTS pekerjaan (
    id_pekerjaan INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER,
    nama_pekerjaan VARCHAR(255) NOT NULL,
    keterangan VARCHAR(255),
    urutan INTEGER DEFAULT 0,
    tanggal_update DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Konfigurasi Website
CREATE TABLE IF NOT EXISTS konfigurasi (
    id_konfigurasi INTEGER PRIMARY KEY AUTOINCREMENT,
    nama_website VARCHAR(255),
    tagline VARCHAR(500),
    deskripsi TEXT,
    keywords TEXT,
    email VARCHAR(255),
    telepon VARCHAR(50),
    whatsapp VARCHAR(50),
    alamat TEXT,
    google_map TEXT,
    facebook VARCHAR(255),
    twitter VARCHAR(255),
    instagram VARCHAR(255),
    youtube VARCHAR(255),
    linkedin VARCHAR(255),
    logo VARCHAR(255),
    icon VARCHAR(255),
    favicon VARCHAR(255),
    about_us TEXT,
    visi TEXT,
    misi TEXT,
    rencana TEXT,
    warna_primary VARCHAR(20),
    warna_secondary VARCHAR(20),
    tanggal_update DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Menu Navigation
CREATE TABLE IF NOT EXISTS menu (
    id_menu INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER NOT NULL,
    nama_menu VARCHAR(255) NOT NULL,
    link_menu VARCHAR(255),
    target_menu VARCHAR(20) DEFAULT '_self',
    icon_menu VARCHAR(100),
    urutan INTEGER DEFAULT 0,
    status_menu VARCHAR(20) DEFAULT 'Aktif',
    slug VARCHAR(255),
    konten TEXT,
    jenis VARCHAR(20) DEFAULT 'link',
    tanggal DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_menu_slug ON menu(slug);

-- Sub Menu
CREATE TABLE IF NOT EXISTS sub_menu (
    id_sub_menu INTEGER PRIMARY KEY AUTOINCREMENT,
    id_menu INTEGER NOT NULL,
    id_user INTEGER NOT NULL,
    nama_sub_menu VARCHAR(255) NOT NULL,
    link_sub_menu VARCHAR(255),
    target_sub_menu VARCHAR(20) DEFAULT '_self',
    icon_sub_menu VARCHAR(100),
    urutan INTEGER DEFAULT 0,
    status_sub_menu VARCHAR(20) DEFAULT 'Aktif',
    slug VARCHAR(255),
    konten TEXT,
    jenis VARCHAR(20) DEFAULT 'link',
    tanggal DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_menu) REFERENCES menu(id_menu)
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_submenu_slug ON sub_menu(slug);

-- Client/Mitra
CREATE TABLE IF NOT EXISTS client (
    id_client INTEGER PRIMARY KEY AUTOINCREMENT,
    id_kategori_client INTEGER NOT NULL,
    id_user INTEGER,
    jenis_client VARCHAR(255) DEFAULT 'Perusahaan',
    jenis_kelamin VARCHAR(25),
    nama_client VARCHAR(255) NOT NULL,
    nama_perusahaan VARCHAR(255),
    pimpinan VARCHAR(255),
    alamat VARCHAR(300),
    telepon VARCHAR(255),
    website VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    password_hint VARCHAR(255),
    isi_testimoni TEXT,
    gambar VARCHAR(200),
    status_client VARCHAR(20) DEFAULT 'Publish',
    tempat_lahir VARCHAR(255),
    tanggal_lahir DATE,
    tanggal_post DATETIME DEFAULT CURRENT_TIMESTAMP,
    tanggal DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Kategori Client
CREATE TABLE IF NOT EXISTS kategori_client (
    id_kategori_client INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER NOT NULL,
    slug_kategori_client VARCHAR(255) NOT NULL,
    nama_kategori_client VARCHAR(255) NOT NULL,
    keterangan TEXT,
    urutan INTEGER DEFAULT 0,
    hits INTEGER DEFAULT 0,
    gambar VARCHAR(255),
    status_kategori_client VARCHAR(255) DEFAULT 'Publish',
    tanggal DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Agenda/Event
CREATE TABLE IF NOT EXISTS agenda (
    id_agenda INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER NOT NULL,
    id_kategori_agenda INTEGER NOT NULL,
    slug_agenda VARCHAR(255) NOT NULL,
    kode_agenda VARCHAR(20),
    nama_agenda VARCHAR(255) NOT NULL,
    status_agenda VARCHAR(20) DEFAULT 'Publish',
    status_pendaftaran VARCHAR(255),
    urutan INTEGER DEFAULT 0,
    deskripsi TEXT,
    isi TEXT NOT NULL,
    gambar VARCHAR(255),
    keywords VARCHAR(500),
    harga INTEGER,
    harga_diskon INTEGER,
    tanggal_mulai DATE,
    tanggal_selesai DATE,
    jam_mulai TIME,
    jam_selesai TIME,
    tanggal_buka DATE,
    tanggal_tutup DATE,
    nama_tempat VARCHAR(255),
    google_map TEXT,
    link_google_map VARCHAR(255),
    alamat VARCHAR(255),
    hits INTEGER DEFAULT 0,
    tanggal_post DATETIME DEFAULT CURRENT_TIMESTAMP,
    tanggal DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Kategori Agenda
CREATE TABLE IF NOT EXISTS kategori_agenda (
    id_kategori_agenda INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER,
    slug_kategori_agenda VARCHAR(255) NOT NULL,
    nama_kategori_agenda VARCHAR(255) NOT NULL,
    keterangan TEXT,
    status_kategori_agenda VARCHAR(20) DEFAULT 'Publish',
    urutan INTEGER DEFAULT 0,
    gambar VARCHAR(255),
    tanggal_post DATETIME DEFAULT CURRENT_TIMESTAMP,
    tanggal DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Rombongan Belajar
CREATE TABLE IF NOT EXISTS rombel (
    id_rombel INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER NOT NULL,
    id_tahun INTEGER NOT NULL,
    id_tingkatan INTEGER,
    id_kelas INTEGER,
    nama_rombel VARCHAR(255) NOT NULL,
    keterangan TEXT,
    status_rombel VARCHAR(20) DEFAULT 'Aktif',
    tanggal_post DATETIME DEFAULT CURRENT_TIMESTAMP,
    tanggal DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tahun Ajaran
CREATE TABLE IF NOT EXISTS tahun (
    id_tahun INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER NOT NULL,
    nama_tahun VARCHAR(50) NOT NULL,
    keterangan TEXT,
    status_tahun VARCHAR(20) DEFAULT 'Aktif',
    tanggal DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Kelas
CREATE TABLE IF NOT EXISTS kelas (
    id_kelas INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER NOT NULL,
    nama_kelas VARCHAR(100) NOT NULL,
    keterangan TEXT,
    urutan INTEGER DEFAULT 0,
    status_kelas VARCHAR(20) DEFAULT 'Aktif',
    tanggal DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tingkatan
CREATE TABLE IF NOT EXISTS tingkatan (
    id_tingkatan INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER NOT NULL,
    nama_tingkatan VARCHAR(100) NOT NULL,
    keterangan TEXT,
    urutan INTEGER DEFAULT 0,
    status_tingkatan VARCHAR(20) DEFAULT 'Aktif',
    tanggal DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Siswa Rombel (Many-to-Many)
CREATE TABLE IF NOT EXISTS siswa_rombel (
    id_siswa_rombel INTEGER PRIMARY KEY AUTOINCREMENT,
    id_siswa INTEGER NOT NULL,
    id_rombel INTEGER NOT NULL,
    tanggal_post DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_siswa) REFERENCES siswa(id_siswa),
    FOREIGN KEY (id_rombel) REFERENCES rombel(id_rombel)
);

-- Staff Rombel (Wali Kelas)
CREATE TABLE IF NOT EXISTS staff_rombel (
    id_staff_rombel INTEGER PRIMARY KEY AUTOINCREMENT,
    id_staff INTEGER NOT NULL,
    id_rombel INTEGER NOT NULL,
    jenis_staff_rombel VARCHAR(50) DEFAULT 'Wali Kelas',
    tanggal_post DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_staff) REFERENCES staff(id_staff),
    FOREIGN KEY (id_rombel) REFERENCES rombel(id_rombel)
);

-- Link Website
CREATE TABLE IF NOT EXISTS link_website (
    id_link_website INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER NOT NULL,
    nama_link_website VARCHAR(255) NOT NULL,
    url_link_website VARCHAR(255) NOT NULL,
    gambar VARCHAR(255),
    urutan INTEGER DEFAULT 0,
    status_link_website VARCHAR(20) DEFAULT 'Publish',
    tanggal DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Slider Homepage
CREATE TABLE IF NOT EXISTS slider (
    id_slider INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER NOT NULL,
    judul_slider VARCHAR(255),
    subjudul_slider VARCHAR(500),
    gambar VARCHAR(255) NOT NULL,
    link VARCHAR(255),
    urutan INTEGER DEFAULT 1,
    status_slider VARCHAR(20) DEFAULT 'Publish',
    tanggal_post DATETIME DEFAULT CURRENT_TIMESTAMP,
    tanggal_update DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_berita_slug ON berita(slug_berita);
CREATE INDEX IF NOT EXISTS idx_berita_kategori ON berita(id_kategori);
CREATE INDEX IF NOT EXISTS idx_berita_status ON berita(status_berita);
CREATE INDEX IF NOT EXISTS idx_siswa_akun ON siswa(id_akun);
CREATE INDEX IF NOT EXISTS idx_siswa_gelombang ON siswa(id_gelombang);
CREATE INDEX IF NOT EXISTS idx_dokumen_siswa ON dokumen(id_siswa);
CREATE INDEX IF NOT EXISTS idx_staff_kategori ON staff(id_kategori_staff);
CREATE INDEX IF NOT EXISTS idx_galeri_kategori ON galeri(id_kategori_galeri);
