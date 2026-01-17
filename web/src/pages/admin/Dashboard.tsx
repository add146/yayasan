import { useState, useEffect } from 'react';
import { Newspaper, Image, Users, UserCheck, GraduationCap, TrendingUp } from 'lucide-react';

export default function Dashboard() {
    const [stats, setStats] = useState({
        berita: 0,
        galeri: 0,
        siswa: 0,
        staff: 0,
        pendaftar: 0,
    });

    useEffect(() => {
        // TODO: Fetch actual stats from API
        setStats({
            berita: 12,
            galeri: 48,
            siswa: 350,
            staff: 25,
            pendaftar: 15,
        });
    }, []);

    const statCards = [
        { label: 'Total Berita', value: stats.berita, icon: Newspaper, color: 'bg-blue-500' },
        { label: 'Total Galeri', value: stats.galeri, icon: Image, color: 'bg-purple-500' },
        { label: 'Total Siswa', value: stats.siswa, icon: GraduationCap, color: 'bg-green-500' },
        { label: 'Total Staff', value: stats.staff, icon: Users, color: 'bg-orange-500' },
        { label: 'Pendaftar Baru', value: stats.pendaftar, icon: UserCheck, color: 'bg-pink-500' },
    ];

    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Selamat datang di panel administrasi</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                                <stat.icon className="w-5 h-5 text-white" />
                            </div>
                            <TrendingUp className="w-4 h-4 text-green-500" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <a href="/admin/berita" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center">
                        <Newspaper className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                        <span className="text-sm font-medium">Tambah Berita</span>
                    </a>
                    <a href="/admin/galeri" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center">
                        <Image className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                        <span className="text-sm font-medium">Tambah Galeri</span>
                    </a>
                    <a href="/admin/pendaftar" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center">
                        <UserCheck className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                        <span className="text-sm font-medium">Verifikasi Pendaftar</span>
                    </a>
                    <a href="/admin/konfigurasi" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center">
                        <Users className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                        <span className="text-sm font-medium">Pengaturan</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
