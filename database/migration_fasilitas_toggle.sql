-- Migration: Add tampilkan_fasilitas field to konfigurasi table
ALTER TABLE konfigurasi ADD COLUMN tampilkan_fasilitas VARCHAR(10) DEFAULT 'Ya';
