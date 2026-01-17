import { Outlet, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail, Facebook, Instagram, Youtube } from 'lucide-react';
import { useKonfigurasiStore } from '../../lib/store';

export default function PublicLayout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { config, fetchConfig } = useKonfigurasiStore();

    useEffect(() => {
        fetchConfig();
    }, [fetchConfig]);

    // Apply theme colors dynamically
    useEffect(() => {
        if (config?.warna_primary) {
            const primary = config.warna_primary;
            // Generate all color shades for Tailwind (50-950)
            document.documentElement.style.setProperty('--color-primary-50', adjustColor(primary, 0.95));
            document.documentElement.style.setProperty('--color-primary-100', adjustColor(primary, 0.85));
            document.documentElement.style.setProperty('--color-primary-200', adjustColor(primary, 0.7));
            document.documentElement.style.setProperty('--color-primary-300', adjustColor(primary, 0.5));
            document.documentElement.style.setProperty('--color-primary-400', adjustColor(primary, 0.25));
            document.documentElement.style.setProperty('--color-primary-500', primary);
            document.documentElement.style.setProperty('--color-primary-600', adjustColor(primary, -0.1));
            document.documentElement.style.setProperty('--color-primary-700', adjustColor(primary, -0.2));
            document.documentElement.style.setProperty('--color-primary-800', adjustColor(primary, -0.3));
            document.documentElement.style.setProperty('--color-primary-900', adjustColor(primary, -0.4));
            document.documentElement.style.setProperty('--color-primary-950', adjustColor(primary, -0.5));
        }
        if (config?.warna_secondary) {
            const secondary = config.warna_secondary;
            // Generate all color shades for secondary
            document.documentElement.style.setProperty('--color-secondary-50', adjustColor(secondary, 0.95));
            document.documentElement.style.setProperty('--color-secondary-100', adjustColor(secondary, 0.85));
            document.documentElement.style.setProperty('--color-secondary-200', adjustColor(secondary, 0.7));
            document.documentElement.style.setProperty('--color-secondary-300', adjustColor(secondary, 0.5));
            document.documentElement.style.setProperty('--color-secondary-400', adjustColor(secondary, 0.25));
            document.documentElement.style.setProperty('--color-secondary-500', secondary);
            document.documentElement.style.setProperty('--color-secondary-600', adjustColor(secondary, -0.1));
            document.documentElement.style.setProperty('--color-secondary-700', adjustColor(secondary, -0.2));
            document.documentElement.style.setProperty('--color-secondary-800', adjustColor(secondary, -0.3));
            document.documentElement.style.setProperty('--color-secondary-900', adjustColor(secondary, -0.4));
            document.documentElement.style.setProperty('--color-secondary-950', adjustColor(secondary, -0.5));
        }
    }, [config?.warna_primary, config?.warna_secondary]);

    // Helper function to adjust color brightness
    function adjustColor(hex: string, percent: number): string {
        const num = parseInt(hex.replace('#', ''), 16);
        const r = Math.min(255, Math.max(0, (num >> 16) + Math.round(255 * percent)));
        const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + Math.round(255 * percent)));
        const b = Math.min(255, Math.max(0, (num & 0x0000FF) + Math.round(255 * percent)));
        return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`;
    }

    const navLinks = [
        { to: '/', label: 'Beranda' },
        { to: '/profil', label: 'Profil' },
        { to: '/berita', label: 'Berita' },
        { to: '/galeri', label: 'Galeri' },
        { to: '/pendaftaran', label: 'Pendaftaran' },
        { to: '/kontak', label: 'Kontak' },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            {/* Top Bar */}
            <div className="bg-primary-900 text-white py-2 text-sm">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        {config?.telepon && (
                            <a
                                href={config.whatsapp ? `https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}` : `tel:${config.telepon}`}
                                target={config.whatsapp ? "_blank" : undefined}
                                rel={config.whatsapp ? "noopener noreferrer" : undefined}
                                className="flex items-center gap-1 hover:text-primary-200"
                            >
                                <Phone className="w-3 h-3" />
                                {config.telepon}
                            </a>
                        )}
                        {config?.email && (
                            <a href={`mailto:${config.email}`} className="flex items-center gap-1 hover:text-primary-200">
                                <Mail className="w-3 h-3" />
                                {config.email}
                            </a>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        {config?.facebook && (
                            <a href={config.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-primary-200">
                                <Facebook className="w-4 h-4" />
                            </a>
                        )}
                        {config?.instagram && (
                            <a href={config.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-primary-200">
                                <Instagram className="w-4 h-4" />
                            </a>
                        )}
                        {config?.youtube && (
                            <a href={config.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-primary-200">
                                <Youtube className="w-4 h-4" />
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3">
                            {config?.logo && (
                                <img
                                    src={config.logo.startsWith('http') || config.logo.startsWith('/') ? config.logo : `/api/upload/${config.logo}`}
                                    alt="Logo"
                                    className="h-10 w-auto object-contain"
                                />
                            )}
                            <span className="font-bold text-xl text-gray-900">
                                {config?.nama_website || 'Sekolah'}
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <a
                                href={config?.whatsapp ? `https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}` : '/kontak'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary text-sm"
                            >
                                Hubungi Kami
                            </a>
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-gray-700"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                    {/* Mobile Nav */}
                    {isMenuOpen && (
                        <nav className="md:hidden py-4 border-t animate-slide-up">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className="block py-2 text-gray-700 hover:text-primary-600"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <a
                                href={config?.whatsapp ? `https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}` : '/kontak'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block py-2 text-primary-600 font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Hubungi Kami
                            </a>
                        </nav>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="font-bold text-lg mb-4">{config?.nama_website || 'Sekolah'}</h3>
                            <p className="text-gray-400 text-sm">{config?.tagline}</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-4">Kontak</h3>
                            <div className="space-y-2 text-gray-400 text-sm">
                                {config?.telepon && <p>📞 {config.telepon}</p>}
                                {config?.email && <p>✉️ {config.email}</p>}
                                {config?.alamat && <p>📍 {config.alamat}</p>}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-4">Link Cepat</h3>
                            <div className="space-y-2">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        className="block text-gray-400 hover:text-white text-sm transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} {config?.nama_website || 'Sekolah'}. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
