import { Outlet, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu as MenuIcon, X, Phone, Mail, Facebook, Instagram, Youtube, ChevronDown } from 'lucide-react';
import { useKonfigurasiStore } from '../../lib/store';
import { getImageUrl, menuApi } from '../../lib/api';

interface SubMenu {
    id_sub_menu: number;
    nama_sub_menu: string;
    link_sub_menu: string;
    jenis: 'link' | 'halaman';
    slug: string;
    target_sub_menu: string;
}

interface Menu {
    id_menu: number;
    nama_menu: string;
    link_menu: string;
    jenis: 'link' | 'halaman';
    slug: string;
    target_menu: string;
    sub_menu?: SubMenu[];
}

export default function PublicLayout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
    const [menus, setMenus] = useState<Menu[]>([]);
    const { config, fetchConfig } = useKonfigurasiStore();

    useEffect(() => {
        fetchConfig();
        fetchMenus();
    }, [fetchConfig]);

    const fetchMenus = async () => {
        try {
            const res = await menuApi.getAll();
            if (res.data.success) {
                setMenus(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching menus:', error);
        }
    };

    // Apply theme colors dynamically
    useEffect(() => {
        if (config?.warna_primary) {
            const primary = config.warna_primary;
            document.documentElement.style.setProperty('--color-primary-50', adjustColor(primary, 0.95));
            // ... (keep existing color logic if needed, simplifed for brevity in this replace but I should preserve it)
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

    function adjustColor(hex: string, percent: number): string {
        const num = parseInt(hex.replace('#', ''), 16);
        const r = Math.min(255, Math.max(0, (num >> 16) + Math.round(255 * percent)));
        const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + Math.round(255 * percent)));
        const b = Math.min(255, Math.max(0, (num & 0x0000FF) + Math.round(255 * percent)));
        return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`;
    }

    const getLinkProps = (item: any) => {
        const isPage = item.jenis === 'halaman';
        const url = isPage ? `/p/${item.slug}` : (item.link_menu || item.link_sub_menu || '#');
        const target = item.target_menu || item.target_sub_menu || '_self';

        return {
            to: item.jenis === 'link' && url.startsWith('http') ? undefined : url,
            href: item.jenis === 'link' && url.startsWith('http') ? url : undefined,
            target: target === '_blank' ? '_blank' : undefined,
            rel: target === '_blank' ? 'noopener noreferrer' : undefined
        };
    };

    const LinkItem = ({ item, className, onClick }: { item: any, className?: string, onClick?: () => void }) => {
        const props = getLinkProps(item);

        if (props.href) {
            return (
                <a href={props.href} target={props.target} rel={props.rel} className={className} onClick={onClick}>
                    {item.nama_menu || item.nama_sub_menu}
                </a>
            );
        }
        return (
            <Link to={props.to!} target={props.target} className={className} onClick={onClick}>
                {item.nama_menu || item.nama_sub_menu}
            </Link>
        );
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Top Bar */}
            <div className="bg-primary-900 text-white py-2 text-sm">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        {config?.telepon && (
                            <a href={`tel:${config.telepon}`} className="flex items-center gap-1 hover:text-primary-200">
                                <Phone className="w-3 h-3" /> {config.telepon}
                            </a>
                        )}
                        {config?.email && (
                            <a href={`mailto:${config.email}`} className="flex items-center gap-1 hover:text-primary-200">
                                <Mail className="w-3 h-3" /> {config.email}
                            </a>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        {config?.facebook && <a href={config.facebook} target="_blank" rel="noreferrer"><Facebook className="w-4 h-4" /></a>}
                        {config?.instagram && <a href={config.instagram} target="_blank" rel="noreferrer"><Instagram className="w-4 h-4" /></a>}
                        {config?.youtube && <a href={config.youtube} target="_blank" rel="noreferrer"><Youtube className="w-4 h-4" /></a>}
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
                                <img src={getImageUrl(config.logo)} alt="Logo" className="h-10 w-auto object-contain" />
                            )}
                            <span className="font-bold text-xl text-gray-900">{config?.nama_website || 'Yayasan'}</span>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-6">
                            {menus.map((menu) => (
                                <div key={menu.id_menu} className="relative group">
                                    {menu.sub_menu && menu.sub_menu.length > 0 ? (
                                        <button className="flex items-center gap-1 text-gray-700 hover:text-primary-600 font-medium transition-colors py-2">
                                            {menu.nama_menu}
                                            <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                                        </button>
                                    ) : (
                                        <LinkItem
                                            item={menu}
                                            className="text-gray-700 hover:text-primary-600 font-medium transition-colors block py-2"
                                        />
                                    )}

                                    {/* Dropdown */}
                                    {menu.sub_menu && menu.sub_menu.length > 0 && (
                                        <div className="absolute top-full left-0 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                                            {menu.sub_menu.map((sub) => (
                                                <LinkItem
                                                    key={sub.id_sub_menu}
                                                    item={sub}
                                                    className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
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
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-gray-700">
                            {isMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                        </button>
                    </div>

                    {/* Mobile Nav */}
                    {isMenuOpen && (
                        <nav className="md:hidden py-4 border-t animate-slide-up">
                            {menus.map((menu) => (
                                <div key={menu.id_menu} className="py-2">
                                    {menu.sub_menu && menu.sub_menu.length > 0 ? (
                                        <>
                                            <button
                                                onClick={() => setActiveDropdown(activeDropdown === menu.id_menu ? null : menu.id_menu)}
                                                className="flex items-center justify-between w-full text-gray-700 hover:text-primary-600 font-medium"
                                            >
                                                {menu.nama_menu}
                                                <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === menu.id_menu ? 'rotate-180' : ''}`} />
                                            </button>
                                            {activeDropdown === menu.id_menu && (
                                                <div className="ml-4 mt-2 space-y-1">
                                                    {menu.sub_menu.map((sub) => (
                                                        <LinkItem
                                                            key={sub.id_sub_menu}
                                                            item={sub}
                                                            className="block py-2 text-sm text-gray-600 hover:text-primary-600"
                                                            onClick={() => setIsMenuOpen(false)}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <LinkItem
                                            item={menu}
                                            className="block py-2 text-gray-700 hover:text-primary-600 font-medium"
                                            onClick={() => setIsMenuOpen(false)}
                                        />
                                    )}
                                </div>
                            ))}
                        </nav>
                    )}
                </div>
            </header>

            <main className="flex-1">
                <Outlet />
            </main>

            <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="font-bold text-lg mb-4">{config?.nama_website || 'Yayasan'}</h3>
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
                            <h3 className="font-bold text-lg mb-4">Menu</h3>
                            <div className="space-y-2">
                                {menus.slice(0, 5).map(menu => (
                                    <LinkItem key={menu.id_menu} item={menu} className="block text-gray-400 hover:text-white text-sm transition-colors" />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} {config?.nama_website || 'Yayasan'}. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
