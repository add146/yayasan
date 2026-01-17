import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, Search, X } from 'lucide-react';
import { beritaApi, kategoriApi, uploadApi } from '../../lib/api';
import toast from 'react-hot-toast';

interface Berita {
    id_berita: number;
    slug_berita: string;
    judul_berita: string;
    ringkasan: string;
    isi: string;
    gambar: string;
    status_berita: string;
    jenis_berita: string;
    nama_kategori: string;
    id_kategori: number;
    tanggal_post: string;
    hits: number;
}

interface Kategori {
    id_kategori: number;
    nama_kategori: string;
}

export default function AdminBerita() {
    const [berita, setBerita] = useState<Berita[]>([]);
    const [kategori, setKategori] = useState<Kategori[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<Berita | null>(null);
    const [form, setForm] = useState({
        id_kategori: '',
        judul_berita: '',
        ringkasan: '',
        isi: '',
        status_berita: 'Draft',
        jenis_berita: 'Berita',
        gambar: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [beritaRes, kategoriRes] = await Promise.all([
                beritaApi.getAll({ limit: 100 }),
                kategoriApi.getBerita(),
            ]);
            setBerita(beritaRes.data.data || []);
            setKategori(kategoriRes.data.data || []);
        } catch (error) {
            toast.error('Gagal memuat data');
        } finally {
            setLoading(false);
        }
    };

    const openModal = (item?: Berita) => {
        if (item) {
            setEditingItem(item);
            setForm({
                id_kategori: String(item.id_kategori),
                judul_berita: item.judul_berita,
                ringkasan: item.ringkasan || '',
                isi: item.isi || '',
                status_berita: item.status_berita,
                jenis_berita: item.jenis_berita,
                gambar: item.gambar || '',
            });
        } else {
            setEditingItem(null);
            setForm({
                id_kategori: '',
                judul_berita: '',
                ringkasan: '',
                isi: '',
                status_berita: 'Draft',
                jenis_berita: 'Berita',
                gambar: '',
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
            if (editingItem) {
                await beritaApi.update(editingItem.id_berita, {
                    ...form,
                    id_kategori: parseInt(form.id_kategori),
                });
                toast.success('Berita berhasil diperbarui');
            } else {
                await beritaApi.create({
                    ...form,
                    id_kategori: parseInt(form.id_kategori),
                });
                toast.success('Berita berhasil ditambahkan');
            }
            closeModal();
            fetchData();
        } catch (error) {
            toast.error('Terjadi kesalahan');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Yakin ingin menghapus berita ini?')) return;
        try {
            await beritaApi.delete(id);
            toast.success('Berita berhasil dihapus');
            fetchData();
        } catch (error) {
            toast.error('Gagal menghapus berita');
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const res = await uploadApi.upload(file, 'berita', 'image');
            setForm({ ...form, gambar: res.data.data.key });
            toast.success('Gambar berhasil diupload');
        } catch (error) {
            toast.error('Gagal upload gambar');
        }
    };

    const filteredBerita = berita.filter(
        (item) =>
            item.judul_berita.toLowerCase().includes(search.toLowerCase()) ||
            item.nama_kategori?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Kelola Berita</h1>
                    <p className="text-gray-600">Manajemen berita dan artikel</p>
                </div>
                <button onClick={() => openModal()} className="btn btn-primary">
                    <Plus className="w-4 h-4 mr-2" /> Tambah Berita
                </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
                <div className="relative">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari berita..."
                        className="form-input pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="flex justify-center py-12"><div className="spinner" /></div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Judul</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Kategori</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Status</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Views</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Tanggal</th>
                                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBerita.map((item) => (
                                <tr key={item.id_berita} className="border-b border-gray-50 hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            {item.gambar && (
                                                <img
                                                    src={`/api/upload/${item.gambar}`}
                                                    alt=""
                                                    className="w-12 h-12 rounded-lg object-cover"
                                                />
                                            )}
                                            <div>
                                                <p className="font-medium text-gray-900 line-clamp-1">{item.judul_berita}</p>
                                                <p className="text-sm text-gray-500">{item.jenis_berita}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{item.nama_kategori}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status_berita === 'Publish' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {item.status_berita}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{item.hits}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {new Date(item.tanggal_post).toLocaleDateString('id-ID')}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <a
                                                href={`/berita/${item.slug_berita}`}
                                                target="_blank"
                                                className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </a>
                                            <button
                                                onClick={() => openModal(item)}
                                                className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id_berita)}
                                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredBerita.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                                        Belum ada berita
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-lg font-bold">{editingItem ? 'Edit Berita' : 'Tambah Berita'}</h2>
                            <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="form-label">Kategori *</label>
                                    <select
                                        value={form.id_kategori}
                                        onChange={(e) => setForm({ ...form, id_kategori: e.target.value })}
                                        className="form-input"
                                        required
                                    >
                                        <option value="">Pilih Kategori</option>
                                        {kategori.map((k) => (
                                            <option key={k.id_kategori} value={k.id_kategori}>{k.nama_kategori}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="form-label">Jenis</label>
                                    <select
                                        value={form.jenis_berita}
                                        onChange={(e) => setForm({ ...form, jenis_berita: e.target.value })}
                                        className="form-input"
                                    >
                                        <option value="Berita">Berita</option>
                                        <option value="Pengumuman">Pengumuman</option>
                                        <option value="Artikel">Artikel</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="form-label">Judul *</label>
                                <input
                                    type="text"
                                    value={form.judul_berita}
                                    onChange={(e) => setForm({ ...form, judul_berita: e.target.value })}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div>
                                <label className="form-label">Ringkasan</label>
                                <textarea
                                    value={form.ringkasan}
                                    onChange={(e) => setForm({ ...form, ringkasan: e.target.value })}
                                    className="form-input"
                                    rows={2}
                                />
                            </div>

                            <div>
                                <label className="form-label">Isi Berita *</label>
                                <textarea
                                    value={form.isi}
                                    onChange={(e) => setForm({ ...form, isi: e.target.value })}
                                    className="form-input"
                                    rows={6}
                                    required
                                />
                            </div>

                            <div>
                                <label className="form-label">Gambar</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="form-input"
                                />
                                {form.gambar && (
                                    <img src={`/api/upload/${form.gambar}`} alt="" className="mt-2 h-24 rounded-lg" />
                                )}
                            </div>

                            <div>
                                <label className="form-label">Status</label>
                                <select
                                    value={form.status_berita}
                                    onChange={(e) => setForm({ ...form, status_berita: e.target.value })}
                                    className="form-input"
                                >
                                    <option value="Draft">Draft</option>
                                    <option value="Publish">Publish</option>
                                </select>
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
