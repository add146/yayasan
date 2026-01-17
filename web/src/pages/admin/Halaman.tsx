import { useState, useEffect } from 'react';
import { Plus, Trash2, X, Edit2, Eye, EyeOff, GripVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_URL } from '../../lib/api';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface Halaman {
    id_halaman: number;
    judul: string;
    slug: string;
    konten: string;
    urutan: number;
    status: string;
    tanggal_post: string;
}

export default function AdminHalaman() {
    const [halaman, setHalaman] = useState<Halaman[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<Halaman | null>(null);
    const [form, setForm] = useState({
        judul: '',
        konten: '',
        urutan: 0,
        status: 'Publish',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/halaman/admin`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setHalaman(data.data || []);
        } catch (error) {
            toast.error('Gagal memuat data');
        } finally {
            setLoading(false);
        }
    };

    const openModal = (item?: Halaman) => {
        if (item) {
            setEditingItem(item);
            setForm({
                judul: item.judul,
                konten: item.konten || '',
                urutan: item.urutan,
                status: item.status,
            });
        } else {
            setEditingItem(null);
            setForm({
                judul: '',
                konten: '',
                urutan: halaman.length,
                status: 'Publish',
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingItem(null);
        setForm({ judul: '', konten: '', urutan: 0, status: 'Publish' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.judul) {
            toast.error('Judul harus diisi');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const url = editingItem
                ? `${API_URL}/api/halaman/${editingItem.id_halaman}`
                : `${API_URL}/api/halaman`;
            const method = editingItem ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error('Failed');
            toast.success(editingItem ? 'Halaman berhasil diperbarui' : 'Halaman berhasil ditambahkan');
            closeModal();
            fetchData();
        } catch (error) {
            toast.error('Terjadi kesalahan');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Yakin ingin menghapus halaman ini?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/halaman/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Failed');
            toast.success('Halaman berhasil dihapus');
            fetchData();
        } catch (error) {
            toast.error('Gagal menghapus halaman');
        }
    };

    const toggleStatus = async (item: Halaman) => {
        try {
            const token = localStorage.getItem('token');
            const newStatus = item.status === 'Publish' ? 'Draft' : 'Publish';
            await fetch(`${API_URL}/api/halaman/${item.id_halaman}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });
            toast.success(`Status diubah ke ${newStatus}`);
            fetchData();
        } catch (error) {
            toast.error('Gagal mengubah status');
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Halaman Profil</h1>
                    <p className="text-gray-600">Kelola submenu dan halaman di menu Profil</p>
                </div>
                <button onClick={() => openModal()} className="btn btn-primary">
                    <Plus className="w-4 h-4 mr-2" /> Tambah Halaman
                </button>
            </div>

            {/* Info Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-sm">
                    📌 Halaman yang ditambahkan di sini akan muncul sebagai submenu dropdown di menu "Profil" pada navigasi website.
                </p>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="flex justify-center py-12"><div className="spinner" /></div>
                ) : halaman.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p>Belum ada halaman profil</p>
                        <p className="text-sm mt-1">Klik tombol "Tambah Halaman" untuk membuat halaman baru</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 w-12">#</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Judul</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Slug</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Status</th>
                                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {halaman.map((item, index) => (
                                <tr key={item.id_halaman} className="border-b border-gray-50 hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-400">
                                        <GripVertical className="w-4 h-4 inline mr-1" />
                                        {index + 1}
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-gray-900">{item.judul}</p>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600 font-mono">
                                        /halaman/{item.slug}
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => toggleStatus(item)}
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'Publish'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-600'
                                                }`}
                                        >
                                            {item.status === 'Publish' ? (
                                                <><Eye className="w-3 h-3 inline mr-1" /> Publish</>
                                            ) : (
                                                <><EyeOff className="w-3 h-3 inline mr-1" /> Draft</>
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => openModal(item)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                title="Edit"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id_halaman)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                title="Hapus"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
                            <h2 className="text-lg font-bold">
                                {editingItem ? 'Edit Halaman' : 'Tambah Halaman Baru'}
                            </h2>
                            <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="form-label">Judul Halaman *</label>
                                    <input
                                        type="text"
                                        value={form.judul}
                                        onChange={(e) => setForm({ ...form, judul: e.target.value })}
                                        className="form-input"
                                        placeholder="Contoh: Visi Misi"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="form-label">Urutan</label>
                                        <input
                                            type="number"
                                            value={form.urutan}
                                            onChange={(e) => setForm({ ...form, urutan: parseInt(e.target.value) || 0 })}
                                            className="form-input"
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Status</label>
                                        <select
                                            value={form.status}
                                            onChange={(e) => setForm({ ...form, status: e.target.value })}
                                            className="form-input"
                                        >
                                            <option value="Publish">Publish</option>
                                            <option value="Draft">Draft</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="form-label">Konten</label>
                                <div className="bg-white min-h-[300px]">
                                    <ReactQuill
                                        theme="snow"
                                        value={form.konten}
                                        onChange={(value) => setForm({ ...form, konten: value })}
                                        modules={{
                                            toolbar: [
                                                [{ header: [1, 2, 3, false] }],
                                                ['bold', 'italic', 'underline', 'strike'],
                                                [{ list: 'ordered' }, { list: 'bullet' }],
                                                [{ align: [] }],
                                                ['link', 'image'],
                                                ['clean'],
                                            ],
                                        }}
                                        formats={[
                                            'header', 'bold', 'italic', 'underline', 'strike',
                                            'list', 'bullet', 'align', 'link', 'image'
                                        ]}
                                        placeholder="Tulis konten halaman di sini..."
                                        style={{ minHeight: '250px' }}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t">
                                <button type="button" onClick={closeModal} className="btn btn-outline">
                                    Batal
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingItem ? 'Simpan Perubahan' : 'Tambah Halaman'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
