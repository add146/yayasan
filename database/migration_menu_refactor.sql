-- Add columns to menu table
ALTER TABLE menu ADD COLUMN slug VARCHAR(255);
ALTER TABLE menu ADD COLUMN konten TEXT;
ALTER TABLE menu ADD COLUMN jenis VARCHAR(20) DEFAULT 'link';

-- Add columns to sub_menu table
ALTER TABLE sub_menu ADD COLUMN slug VARCHAR(255);
ALTER TABLE sub_menu ADD COLUMN konten TEXT;
ALTER TABLE sub_menu ADD COLUMN jenis VARCHAR(20) DEFAULT 'link';

-- Create indexes for slugs (allows NULLs for existing rows)
CREATE UNIQUE INDEX IF NOT EXISTS idx_menu_slug ON menu(slug);
CREATE UNIQUE INDEX IF NOT EXISTS idx_submenu_slug ON sub_menu(slug);
