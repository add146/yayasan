import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Calendar } from 'lucide-react';
import { gelombangApi } from '../../lib/api';
import toast from 'react-hot-toast';

interface Gelombang {
    id_gelombang: number;
    judul: string;
    tahun_ajaran: string;
    tahap: number;
    tahun: number;
    tanggal_buka: string;
    tanggal_tutup: string;
    status_gelombang: string;
    isi: string;
}

export default function AdminGelombang() {
    const [data, setData] = useState<Gelombang[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        judul: '',
        tahun_ajaran: '',
        tahap: 1,
        tahun: new Date().getFullYear(),
        tanggal_buka: '',
        tanggal_tutup: '',
        status_gelombang: 'Tutup',
        isi: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await gelombangApi.getAll();
            setData(res.data.data || []);
        } catch {
            toast.error('Gagal memuat data');
        } finally {
            setLoading(false);
        }
    };

    const openModal = (item?: Gelombang) => {
        if (item) {
            setEditId(item.id_gelombang);
            setForm({
                judul: item.judul,
                tahun_ajaran: item.tahun_ajaran,
                tahap: item.tahap,
                tahun: item.tahun,
                tanggal_buka: item.tanggal_buka,
                tanggal_tutup: item.tanggal_tutup,
                status_gelombang: item.status_gelombang,
                isi: item.isi || '',
            });
        } else {
            setEditId(null);
            setForm({
                judul: '',
                tahun_ajaran: '',
                tahap: 1,
                tahun: new Date().getFullYear(),
                tanggal_buka: '',
                tanggal_tutup: '',
                status_gelombang: 'Tutup',
                isi: '',
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.judul || !form.tahun_ajaran || !form.tanggal_buka || !form.tanggal_tutup) {
            toast.error('Harap isi semua field yang diperlukan');
            return;
        }
        setSaving(true);
        try {
            if (editId) {
                await gelombangApi.update(editId, form);
                toast.success('Gelombang berhasil diperbarui');
            } else {
                await gelombangApi.create(form);
                toast.success('Gelombang berhasil ditambahkan');
            }
            setShowModal(false);
            fetchData();
        } catch {
            toast.error('Gagal menyimpan data');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Yakin ingin menghapus gelombang ini?')) return;
        try {
            await gelombangApi.delete(id);
            toast.success('Gelombang berhasil dihapus');
            fetchData();
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast.error(error.response?.data?.message || 'Gagal menghapus');
        }
    };

    const getStatusColor = (status: string) => {
        return status === 'Buka' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
    };

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Kelola Gelombang</h1>
                    <p className="text-gray-600">Atur periode pendaftaran siswa baru</p>
                </div>
                <button onClick={() => openModal()} className="btn btn-primary">
                    <Plus className="w-4 h-4 mr-2" /> Tambah Gelombang
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="flex justify-center py-12"><div className="spinner" /></div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Judul</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Tahun Ajaran</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Tahap</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Periode</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Status</th>
                                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item.id_gelombang} className="border-b border-gray-50 hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">{item.judul}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{item.tahun_ajaran}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">Tahap {item.tahap}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(item.tanggal_buka).toLocaleDateString('id-ID')} - {new Date(item.tanggal_tutup).toLocaleDateString('id-ID')}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status_gelombang)}`}>
                                            {item.status_gelombang}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => openModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(item.id_gelombang)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                                        Belum ada data gelombang
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
                            <h2 className="text-lg font-bold">{editId ? 'Edit Gelombang' : 'Tambah Gelombang'}</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <label className="form-label">Judul Gelombang *</label>
                                <input
                                    type="text"
                                    value={form.judul}
                                    onChange={(e) => setForm({ ...form, judul: e.target.value })}
                                    className="form-input"
                                    placeholder="Contoh: PPDB Gelombang 1"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="form-label">Tahun Ajaran *</label>
                                    <input
                                        type="text"
                                        value={form.tahun_ajaran}
                                        onChange={(e) => setForm({ ...form, tahun_ajaran: e.target.value })}
                                        className="form-input"
                                        placeholder="2025/2026"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Tahap</label>
                                    <input
                                        type="number"
                                        value={form.tahap}
                                        onChange={(e) => setForm({ ...form, tahap: parseInt(e.target.value) })}
                                        className="form-input"
                                        min="1"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="form-label">Tanggal Buka *</label>
                                    <input
                                        type="date"
                                        value={form.tanggal_buka}
                                        onChange={(e) => setForm({ ...form, tanggal_buka: e.target.value })}
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Tanggal Tutup *</label>
                                    <input
                                        type="date"
                                        value={form.tanggal_tutup}
                                        onChange={(e) => setForm({ ...form, tanggal_tutup: e.target.value })}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="form-label">Status</label>
                                <select
                                    value={form.status_gelombang}
                                    onChange={(e) => setForm({ ...form, status_gelombang: e.target.value })}
                                    className="form-input"
                                >
                                    <option value="Tutup">Tutup</option>
                                    <option value="Buka">Buka</option>
                                </select>
                            </div>
                            <div>
                                <label className="form-label">Keterangan</label>
                                <textarea
                                    value={form.isi}
                                    onChange={(e) => setForm({ ...form, isi: e.target.value })}
                                    className="form-input"
                                    rows={3}
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-4 border-t">
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">Batal</button>
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
