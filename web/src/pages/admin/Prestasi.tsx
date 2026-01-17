import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Trophy } from 'lucide-react';
import { konfiguasiApi } from '../../lib/api';
import toast from 'react-hot-toast';

interface Prestasi {
    id_prestasi: number;
    judul_prestasi: string;
    tingkat_prestasi: string;
    tahun_prestasi: string;
    isi_prestasi: string;
    status_prestasi: string;
}

export default function AdminPrestasi() {
    const [prestasi, setPrestasi] = useState<Prestasi[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<Prestasi | null>(null);
    const [form, setForm] = useState({
        judul_prestasi: '',
        tingkat_prestasi: 'Kabupaten',
        tahun_prestasi: new Date().getFullYear().toString(),
        isi_prestasi: '',
        status_prestasi: 'Publish',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await konfiguasiApi.getPrestasi();
            setPrestasi(res.data.data || []);
        } catch (error) {
            toast.error('Gagal memuat data');
        } finally {
            setLoading(false);
        }
    };

    const openModal = (item?: Prestasi) => {
        if (item) {
            setEditingItem(item);
            setForm({
                judul_prestasi: item.judul_prestasi,
                tingkat_prestasi: item.tingkat_prestasi || 'Kabupaten',
                tahun_prestasi: item.tahun_prestasi || new Date().getFullYear().toString(),
                isi_prestasi: item.isi_prestasi || '',
                status_prestasi: item.status_prestasi || 'Publish',
            });
        } else {
            setEditingItem(null);
            setForm({
                judul_prestasi: '',
                tingkat_prestasi: 'Kabupaten',
                tahun_prestasi: new Date().getFullYear().toString(),
                isi_prestasi: '',
                status_prestasi: 'Publish',
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingItem(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const endpoint = editingItem
                ? `/api/konfigurasi/prestasi/${editingItem.id_prestasi}`
                : '/api/konfigurasi/prestasi';
            const method = editingItem ? 'PUT' : 'POST';

            const token = localStorage.getItem('token');
            const res = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error('Failed');
            toast.success(editingItem ? 'Prestasi berhasil diperbarui' : 'Prestasi berhasil ditambahkan');
            closeModal();
            fetchData();
        } catch (error) {
            toast.error('Terjadi kesalahan');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Yakin ingin menghapus prestasi ini?')) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/konfigurasi/prestasi/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            toast.success('Prestasi berhasil dihapus');
            fetchData();
        } catch (error) {
            toast.error('Gagal menghapus prestasi');
        }
    };

    const getTingkatColor = (tingkat: string) => {
        switch (tingkat) {
            case 'Internasional': return 'bg-purple-100 text-purple-700';
            case 'Nasional': return 'bg-blue-100 text-blue-700';
            case 'Provinsi': return 'bg-green-100 text-green-700';
            default: return 'bg-yellow-100 text-yellow-700';
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Kelola Prestasi</h1>
                    <p className="text-gray-600">Manajemen prestasi sekolah</p>
                </div>
                <button onClick={() => openModal()} className="btn btn-primary">
                    <Plus className="w-4 h-4 mr-2" /> Tambah Prestasi
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                    <div className="col-span-3 flex justify-center py-12"><div className="spinner" /></div>
                ) : prestasi.length === 0 ? (
                    <div className="col-span-3 text-center py-12 text-gray-500 bg-white rounded-xl">
                        <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>Belum ada data prestasi</p>
                    </div>
                ) : (
                    prestasi.map((item) => (
                        <div key={item.id_prestasi} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                            <div className="flex items-start justify-between mb-3">
                                <Trophy className="w-8 h-8 text-yellow-500" />
                                <span className={`px-2 py-0.5 text-xs rounded-full ${getTingkatColor(item.tingkat_prestasi)}`}>
                                    {item.tingkat_prestasi}
                                </span>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">{item.judul_prestasi}</h3>
                            <p className="text-sm text-gray-500">Tahun {item.tahun_prestasi}</p>
                            {item.isi_prestasi && (
                                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{item.isi_prestasi}</p>
                            )}
                            <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                                <button onClick={() => openModal(item)} className="flex-1 btn btn-outline text-sm py-1.5">
                                    <Edit2 className="w-3 h-3 mr-1" /> Edit
                                </button>
                                <button onClick={() => handleDelete(item.id_prestasi)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-xl w-full max-w-md">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-lg font-bold">{editingItem ? 'Edit Prestasi' : 'Tambah Prestasi'}</h2>
                            <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <label className="form-label">Judul Prestasi *</label>
                                <input
                                    type="text"
                                    value={form.judul_prestasi}
                                    onChange={(e) => setForm({ ...form, judul_prestasi: e.target.value })}
                                    className="form-input"
                                    required
                                    placeholder="Juara 1 Lomba..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="form-label">Tingkat</label>
                                    <select
                                        value={form.tingkat_prestasi}
                                        onChange={(e) => setForm({ ...form, tingkat_prestasi: e.target.value })}
                                        className="form-input"
                                    >
                                        <option value="Kabupaten">Kabupaten</option>
                                        <option value="Provinsi">Provinsi</option>
                                        <option value="Nasional">Nasional</option>
                                        <option value="Internasional">Internasional</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="form-label">Tahun</label>
                                    <input
                                        type="text"
                                        value={form.tahun_prestasi}
                                        onChange={(e) => setForm({ ...form, tahun_prestasi: e.target.value })}
                                        className="form-input"
                                        placeholder="2024"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="form-label">Deskripsi</label>
                                <textarea
                                    value={form.isi_prestasi}
                                    onChange={(e) => setForm({ ...form, isi_prestasi: e.target.value })}
                                    className="form-input"
                                    rows={3}
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button type="button" onClick={closeModal} className="btn btn-outline">Batal</button>
                                <button type="submit" className="btn btn-primary">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
