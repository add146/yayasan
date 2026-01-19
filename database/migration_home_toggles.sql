-- Migration: Add toggle fields to konfigurasi table
ALTER TABLE konfigurasi ADD COLUMN tampilkan_statistik VARCHAR(10) DEFAULT 'Ya';
ALTER TABLE konfigurasi ADD COLUMN tampilkan_konten VARCHAR(10) DEFAULT 'Ya';
ALTER TABLE konfigurasi ADD COLUMN tampilkan_program VARCHAR(10) DEFAULT 'Ya';
ALTER TABLE konfigurasi ADD COLUMN tampilkan_berita VARCHAR(10) DEFAULT 'Ya';
