import { useState, useEffect } from 'react';
import { Trash2, Mail, Calendar, User, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_URL } from '../../lib/api';

interface Pesan {
    id_pesan: number;
    nama: string;
    email: string;
    pesan: string;
    status: string;
    tanggal_kirim: string;
}

export default function AdminPesan() {
    const [pesan, setPesan] = useState<Pesan[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPesan, setSelectedPesan] = useState<Pesan | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/pesan/admin`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setPesan(data.data || []);
        } catch (error) {
            toast.error('Gagal memuat data');
        } finally {
            setLoading(false);
        }
    };

    const handleView = async (item: Pesan) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/pesan/${item.id_pesan}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setSelectedPesan(data.data);
                fetchData(); // Refresh to update status
            }
        } catch (error) {
            toast.error('Gagal membuka pesan');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Yakin ingin menghapus pesan ini?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/pesan/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Failed');
            toast.success('Pesan berhasil dihapus');
            fetchData();
        } catch (error) {
            toast.error('Gagal menghapus pesan');
        }
    };

    const unreadCount = pesan.filter(p => p.status === 'Belum Dibaca').length;

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Pesan Kontak</h1>
                    <p className="text-sm text-gray-600">
                        {unreadCount > 0 ? `${unreadCount} pesan belum dibaca` : 'Tidak ada pesan baru'}
                    </p>
                </div>
            </div>

            {/* Messages List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="flex justify-center py-12"><div className="spinner" /></div>
                ) : pesan.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>Belum ada pesan masuk</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {pesan.map((item) => (
                            <div
                                key={item.id_pesan}
                                className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${item.status === 'Belum Dibaca' ? 'bg-blue-50/50' : ''
                                    }`}
                                onClick={() => handleView(item)}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            {item.status === 'Belum Dibaca' && (
                                                <span className="w-2 h-2 rounded-full bg-blue-500" />
                                            )}
                                            <p className={`font-medium text-gray-900 ${item.status === 'Belum Dibaca' ? 'font-bold' : ''
                                                }`}>
                                                {item.nama}
                                            </p>
                                        </div>
                                        <p className="text-sm text-gray-600 truncate">{item.email}</p>
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.pesan}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-xs text-gray-400">
                                            {new Date(item.tanggal_kirim).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(item.id_pesan); }}
                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg mt-2"
                                            title="Hapus"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedPesan && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
                            <h2 className="text-lg font-bold">Detail Pesan</h2>
                            <button onClick={() => setSelectedPesan(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="flex items-center gap-3 pb-4 border-b">
                                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                                    <User className="w-6 h-6 text-primary-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">{selectedPesan.nama}</p>
                                    <p className="text-sm text-gray-600">{selectedPesan.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Calendar className="w-4 h-4" />
                                {new Date(selectedPesan.tanggal_kirim).toLocaleString('id-ID', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-gray-700 whitespace-pre-wrap">{selectedPesan.pesan}</p>
                            </div>
                            <div className="flex gap-2 pt-4 border-t">
                                <a
                                    href={`mailto:${selectedPesan.email}`}
                                    className="btn btn-primary flex-1"
                                >
                                    <Mail className="w-4 h-4 mr-2" /> Balas via Email
                                </a>
                                <button
                                    onClick={() => setSelectedPesan(null)}
                                    className="btn btn-outline"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
