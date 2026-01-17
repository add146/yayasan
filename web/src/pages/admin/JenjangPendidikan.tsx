import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, GraduationCap } from 'lucide-react';
import { jenjangPendidikanApi } from '../../lib/api';
import toast from 'react-hot-toast';

interface JenjangPendidikan {
    id_jenjang_pendidikan: number;
    judul_jenjang_pendidikan: string;
    nama_jenjang: string;
    id_jenjang: number;
    ringkasan: string;
    isi: string;
    status_jenjang_pendidikan: string;
    urutan: number;
}

interface JenjangMaster {
    id_jenjang: number;
    nama_jenjang: string;
}

export default function AdminJenjangPendidikan() {
    const [data, setData] = useState<JenjangPendidikan[]>([]);
    const [jenjangList, setJenjangList] = useState<JenjangMaster[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        judul_jenjang_pendidikan: '',
        id_jenjang: '',
        ringkasan: '',
        isi: '',
        status_jenjang_pendidikan: 'Publish',
        urutan: 0,
    });

    useEffect(() => {
        fetchData();
        fetchJenjangMaster();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await jenjangPendidikanApi.getAll();
            setData(res.data.data || []);
        } catch {
            toast.error('Gagal memuat data');
        } finally {
            setLoading(false);
        }
    };

    const fetchJenjangMaster = async () => {
        try {
            const res = await jenjangPendidikanApi.getJenjangMaster();
            setJenjangList(res.data.data || []);
        } catch {
            console.error('Failed to fetch jenjang');
        }
    };

    const openModal = (item?: JenjangPendidikan) => {
        if (item) {
            setEditId(item.id_jenjang_pendidikan);
            setForm({
                judul_jenjang_pendidikan: item.judul_jenjang_pendidikan,
                id_jenjang: item.id_jenjang.toString(),
                ringkasan: item.ringkasan || '',
                isi: item.isi || '',
                status_jenjang_pendidikan: item.status_jenjang_pendidikan,
                urutan: item.urutan,
            });
        } else {
            setEditId(null);
            setForm({
                judul_jenjang_pendidikan: '',
                id_jenjang: jenjangList[0]?.id_jenjang.toString() || '',
                ringkasan: '',
                isi: '',
                status_jenjang_pendidikan: 'Publish',
                urutan: 0,
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.judul_jenjang_pendidikan || !form.id_jenjang) {
            toast.error('Harap isi nama program dan pilih jenjang');
            return;
        }
        setSaving(true);
        try {
            const payload = {
                ...form,
                id_jenjang: parseInt(form.id_jenjang),
            };
            if (editId) {
                await jenjangPendidikanApi.update(editId, payload);
                toast.success('Program berhasil diperbarui');
            } else {
                await jenjangPendidikanApi.create(payload);
                toast.success('Program berhasil ditambahkan');
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
        if (!confirm('Yakin ingin menghapus program ini?')) return;
        try {
            await jenjangPendidikanApi.delete(id);
            toast.success('Program berhasil dihapus');
            fetchData();
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast.error(error.response?.data?.message || 'Gagal menghapus');
        }
    };

    const getStatusColor = (status: string) => {
        return status === 'Publish' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Kelola Program/Jurusan</h1>
                    <p className="text-gray-600">Atur program pendidikan yang tersedia</p>
                </div>
                <button onClick={() => openModal()} className="btn btn-primary">
                    <Plus className="w-4 h-4 mr-2" /> Tambah Program
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="flex justify-center py-12"><div className="spinner" /></div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Nama Program</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Jenjang</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Ringkasan</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Status</th>
                                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item.id_jenjang_pendidikan} className="border-b border-gray-50 hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <GraduationCap className="w-5 h-5 text-primary-600" />
                                            <span className="font-medium text-gray-900">{item.judul_jenjang_pendidikan}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{item.nama_jenjang}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{item.ringkasan || '-'}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status_jenjang_pendidikan)}`}>
                                            {item.status_jenjang_pendidikan}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => openModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(item.id_jenjang_pendidikan)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {data.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                                        Belum ada data program
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
                            <h2 className="text-lg font-bold">{editId ? 'Edit Program' : 'Tambah Program'}</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <label className="form-label">Nama Program/Jurusan *</label>
                                <input
                                    type="text"
                                    value={form.judul_jenjang_pendidikan}
                                    onChange={(e) => setForm({ ...form, judul_jenjang_pendidikan: e.target.value })}
                                    className="form-input"
                                    placeholder="Contoh: SMK Teknik Komputer Jaringan"
                                    required
                                />
                            </div>
                            <div>
                                <label className="form-label">Jenjang *</label>
                                <select
                                    value={form.id_jenjang}
                                    onChange={(e) => setForm({ ...form, id_jenjang: e.target.value })}
                                    className="form-input"
                                    required
                                >
                                    <option value="">Pilih Jenjang</option>
                                    {jenjangList.map(j => (
                                        <option key={j.id_jenjang} value={j.id_jenjang}>{j.nama_jenjang}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="form-label">Ringkasan</label>
                                <input
                                    type="text"
                                    value={form.ringkasan}
                                    onChange={(e) => setForm({ ...form, ringkasan: e.target.value })}
                                    className="form-input"
                                    placeholder="Ringkasan singkat program"
                                />
                            </div>
                            <div>
                                <label className="form-label">Deskripsi</label>
                                <textarea
                                    value={form.isi}
                                    onChange={(e) => setForm({ ...form, isi: e.target.value })}
                                    className="form-input"
                                    rows={3}
                                    placeholder="Deskripsi lengkap program"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="form-label">Status</label>
                                    <select
                                        value={form.status_jenjang_pendidikan}
                                        onChange={(e) => setForm({ ...form, status_jenjang_pendidikan: e.target.value })}
                                        className="form-input"
                                    >
                                        <option value="Publish">Publish</option>
                                        <option value="Draft">Draft</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="form-label">Urutan</label>
                                    <input
                                        type="number"
                                        value={form.urutan}
                                        onChange={(e) => setForm({ ...form, urutan: parseInt(e.target.value) })}
                                        className="form-input"
                                        min="0"
                                    />
                                </div>
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
