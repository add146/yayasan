import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
    LayoutDashboard, Newspaper, Image, Users, UserCheck, Settings,
    LogOut, Menu, X, ChevronRight, GraduationCap, Building, Trophy, Layers, Calendar, BookOpen, FileText, Mail
} from 'lucide-react';
import { useAuthStore } from '../../lib/store';

const sidebarLinks = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { to: '/admin/berita', icon: Newspaper, label: 'Berita' },
    { to: '/admin/galeri', icon: Image, label: 'Galeri' },
    { to: '/admin/slider', icon: Layers, label: 'Slider' },
    { to: '/admin/halaman', icon: FileText, label: 'Halaman Profil' },
    { to: '/admin/pesan', icon: Mail, label: 'Pesan Kontak' },
    { to: '/admin/siswa', icon: GraduationCap, label: 'Siswa' },
    { to: '/admin/staff', icon: Users, label: 'Staff' },
    { to: '/admin/fasilitas', icon: Building, label: 'Fasilitas' },
    { to: '/admin/prestasi', icon: Trophy, label: 'Prestasi' },
    { to: '/admin/pendaftar', icon: UserCheck, label: 'Pendaftar' },
    { to: '/admin/gelombang', icon: Calendar, label: 'Gelombang' },
    { to: '/admin/program', icon: BookOpen, label: 'Program' },
    { to: '/admin/konfigurasi', icon: Settings, label: 'Konfigurasi' },
];

export default function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path: string, exact?: boolean) => {
        if (exact) return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar - Desktop */}
            <aside
                className={`hidden md:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'
                    }`}
            >
                {/* Sidebar Header */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
                    {isSidebarOpen && (
                        <span className="font-bold text-lg text-gray-900">Admin Panel</span>
                    )}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-lg hover:bg-gray-100"
                    >
                        <ChevronRight className={`w-5 h-5 transition-transform ${isSidebarOpen ? '' : 'rotate-180'}`} />
                    </button>
                </div>

                {/* Sidebar Links */}
                <nav className="flex-1 py-4 px-2 space-y-1">
                    {sidebarLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive(link.to, link.exact)
                                ? 'bg-primary-50 text-primary-700'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <link.icon className="w-5 h-5 flex-shrink-0" />
                            {isSidebarOpen && <span className="font-medium">{link.label}</span>}
                        </Link>
                    ))}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors ${isSidebarOpen ? '' : 'justify-center'
                            }`}
                    >
                        <LogOut className="w-5 h-5" />
                        {isSidebarOpen && <span className="font-medium">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-50 flex">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
                    <aside className="relative w-64 bg-white flex flex-col animate-slide-up">
                        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
                            <span className="font-bold text-lg text-gray-900">Admin Panel</span>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 rounded-lg hover:bg-gray-100"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <nav className="flex-1 py-4 px-2 space-y-1">
                            {sidebarLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive(link.to, link.exact)
                                        ? 'bg-primary-50 text-primary-700'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    <link.icon className="w-5 h-5" />
                                    <span className="font-medium">{link.label}</span>
                                </Link>
                            ))}
                        </nav>
                        <div className="p-4 border-t border-gray-200">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="font-medium">Logout</span>
                            </button>
                        </div>
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    <div className="flex-1" />

                    <Link to="/admin/profile" className="flex items-center gap-3 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                        <span className="text-sm text-gray-600">
                            Halo, <strong>{user?.nama}</strong>
                        </span>
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
                            {user?.foto ? (
                                <img src={user.foto} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-primary-700 font-medium text-sm">
                                    {user?.nama?.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                    </Link>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
