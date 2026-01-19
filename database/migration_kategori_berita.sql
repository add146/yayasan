-- Migration: Add kategori_berita field to konfigurasi table
ALTER TABLE konfigurasi ADD COLUMN kategori_berita TEXT DEFAULT NULL;
-- NULL means all categories, otherwise comma-separated IDs like "1,2,3"
