import { useState, useEffect } from 'react';
import { Newspaper, Image, Users, UserCheck, GraduationCap, TrendingUp, Mail, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_URL } from '../../lib/api';
import { Link } from 'react-router-dom';

interface Stats {
    berita: number;
    galeri: number;
    siswa: number;
    staff: number;
    pendaftar: number;
    pesan_baru: number;
}

export default function Dashboard() {
    const [stats, setStats] = useState<Stats>({
        berita: 0,
        galeri: 0,
        siswa: 0,
        staff: 0,
        pendaftar: 0,
        pesan_baru: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            setError(false);
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/dashboard/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setStats(data.data);
            } else {
                setError(true);
            }
        } catch (err) {
            console.error('Error fetching stats:', err);
            setError(true);
            toast.error('Gagal memuat statistik');
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { label: 'Total Berita', value: stats.berita, icon: Newspaper, color: 'bg-blue-500', link: '/admin/berita' },
        { label: 'Total Galeri', value: stats.galeri, icon: Image, color: 'bg-purple-500', link: '/admin/galeri' },
        { label: 'Total Siswa', value: stats.siswa, icon: GraduationCap, color: 'bg-green-500', link: '/admin/siswa' },
        { label: 'Total Staff', value: stats.staff, icon: Users, color: 'bg-orange-500', link: '/admin/staff' },
        { label: 'Pendaftar Baru', value: stats.pendaftar, icon: UserCheck, color: 'bg-pink-500', link: '/admin/siswa' },
        { label: 'Pesan Baru', value: stats.pesan_baru, icon: Mail, color: 'bg-cyan-500', link: '/admin/pesan' },
    ];

    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-600">Selamat datang di panel administrasi</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                {statCards.map((stat, index) => (
                    <Link
                        key={index}
                        to={stat.link}
                        className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                                <stat.icon className="w-5 h-5 text-white" />
                            </div>
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin" />
                            ) : error ? (
                                <AlertCircle className="w-4 h-4 text-red-400" />
                            ) : (
                                <TrendingUp className="w-4 h-4 text-green-500" />
                            )}
                        </div>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">
                            {loading ? '-' : stat.value.toLocaleString()}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">{stat.label}</p>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link to="/admin/berita" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center">
                        <Newspaper className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                        <span className="text-sm font-medium">Tambah Berita</span>
                    </Link>
                    <Link to="/admin/galeri" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center">
                        <Image className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                        <span className="text-sm font-medium">Tambah Galeri</span>
                    </Link>
                    <Link to="/admin/pesan" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center relative">
                        <Mail className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                        <span className="text-sm font-medium">Lihat Pesan</span>
                        {stats.pesan_baru > 0 && (
                            <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                {stats.pesan_baru}
                            </span>
                        )}
                    </Link>
                    <Link to="/admin/konfigurasi" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center">
                        <Users className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                        <span className="text-sm font-medium">Pengaturan</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
