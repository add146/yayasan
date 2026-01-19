-- Migration: Add tampilkan_galeri field to konfigurasi table
ALTER TABLE konfigurasi ADD COLUMN tampilkan_galeri VARCHAR(10) DEFAULT 'Ya';
