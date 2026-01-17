import { useState, useEffect } from 'react';
import { Plus, Trash2, X, Image as ImageIcon, Edit2 } from 'lucide-react';
import { galeriApi, kategoriApi, uploadApi } from '../../lib/api';
import toast from 'react-hot-toast';

interface Galeri {
    id_galeri: number;
    judul_galeri: string;
    gambar: string;
    jenis_galeri: string;
    nama_kategori_galeri: string;
    id_kategori_galeri: number;
}

interface KategoriGaleri {
    id_kategori_galeri: number;
    nama_kategori_galeri: string;
}

export default function AdminGaleri() {
    const [galeri, setGaleri] = useState<Galeri[]>([]);
    const [kategori, setKategori] = useState<KategoriGaleri[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [editingItem, setEditingItem] = useState<Galeri | null>(null);
    const [form, setForm] = useState({
        id_kategori_galeri: '',
        judul_galeri: '',
        jenis_galeri: 'Homepage',
        gambar: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [galeriRes, kategoriRes] = await Promise.all([
                galeriApi.getAll({ limit: 100 }),
                kategoriApi.getGaleri(),
            ]);
            setGaleri(galeriRes.data.data || []);
            setKategori(kategoriRes.data.data || []);
        } catch (error) {
            toast.error('Gagal memuat data');
        } finally {
            setLoading(false);
        }
    };

    const openModal = (item?: Galeri) => {
        if (item) {
            setEditingItem(item);
            setForm({
                id_kategori_galeri: item.id_kategori_galeri?.toString() || '',
                judul_galeri: item.judul_galeri || '',
                jenis_galeri: item.jenis_galeri || 'Homepage',
                gambar: item.gambar || '',
            });
        } else {
            setEditingItem(null);
            setForm({
                id_kategori_galeri: '',
                judul_galeri: '',
                jenis_galeri: 'Homepage',
                gambar: '',
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingItem(null);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const res = await uploadApi.upload(file, 'galeri', 'image');
            setForm({ ...form, gambar: res.data.data.key });
            toast.success('Gambar berhasil diupload');
        } catch (error) {
            toast.error('Gagal upload gambar');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.gambar) {
            toast.error('Gambar harus diupload');
            return;
        }
        if (!form.id_kategori_galeri) {
            toast.error('Pilih kategori terlebih dahulu');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const payload = {
                ...form,
                id_kategori_galeri: parseInt(form.id_kategori_galeri),
            };

            if (editingItem) {
                const res = await fetch(`/api/galeri/${editingItem.id_galeri}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                });
                if (!res.ok) throw new Error('Failed to update');
                toast.success('Galeri berhasil diperbarui');
            } else {
                await galeriApi.create(payload);
                toast.success('Galeri berhasil ditambahkan');
            }
            closeModal();
            fetchData();
        } catch (error) {
            console.error('Save error:', error);
            toast.error('Terjadi kesalahan');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Yakin ingin menghapus gambar ini?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/galeri/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Failed to delete');
            toast.success('Gambar berhasil dihapus');
            fetchData();
        } catch (error) {
            toast.error('Gagal menghapus gambar');
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Kelola Galeri</h1>
                    <p className="text-gray-600">Manajemen foto dan gambar</p>
                </div>
                <button onClick={() => openModal()} className="btn btn-primary">
                    <Plus className="w-4 h-4 mr-2" /> Upload Gambar
                </button>
            </div>

            {/* Gallery Grid */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                {loading ? (
                    <div className="flex justify-center py-12"><div className="spinner" /></div>
                ) : galeri.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>Belum ada gambar</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {galeri.map((item) => (
                            <div key={item.id_galeri} className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                                <img
                                    src={`/api/upload/${item.gambar}`}
                                    alt={item.judul_galeri}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => openModal(item)}
                                        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id_galeri)}
                                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                {item.judul_galeri && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                                        <p className="text-white text-xs truncate">{item.judul_galeri}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Upload/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-xl w-full max-w-md">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-lg font-bold">{editingItem ? 'Edit Gambar' : 'Upload Gambar'}</h2>
                            <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <label className="form-label">Kategori</label>
                                <select
                                    value={form.id_kategori_galeri}
                                    onChange={(e) => setForm({ ...form, id_kategori_galeri: e.target.value })}
                                    className="form-input"
                                >
                                    <option value="">Pilih Kategori</option>
                                    {kategori.map((k) => (
                                        <option key={k.id_kategori_galeri} value={k.id_kategori_galeri}>
                                            {k.nama_kategori_galeri}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="form-label">Judul Gambar</label>
                                <input
                                    type="text"
                                    value={form.judul_galeri}
                                    onChange={(e) => setForm({ ...form, judul_galeri: e.target.value })}
                                    className="form-input"
                                />
                            </div>

                            <div>
                                <label className="form-label">Jenis</label>
                                <select
                                    value={form.jenis_galeri}
                                    onChange={(e) => setForm({ ...form, jenis_galeri: e.target.value })}
                                    className="form-input"
                                >
                                    <option value="Homepage">Homepage</option>
                                    <option value="Galeri">Galeri</option>
                                </select>
                            </div>

                            <div>
                                <label className="form-label">Gambar *</label>
                                {form.gambar && (
                                    <img src={`/api/upload/${form.gambar}`} alt="" className="mb-2 h-32 rounded-lg object-cover" />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="form-input"
                                    disabled={uploading}
                                />
                                {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button type="button" onClick={closeModal} className="btn btn-outline">Batal</button>
                                <button type="submit" className="btn btn-primary" disabled={!form.gambar || uploading}>
                                    {editingItem ? 'Simpan Perubahan' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
