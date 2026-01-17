import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Image } from 'lucide-react';
import { uploadApi } from '../../lib/api';
import toast from 'react-hot-toast';

interface Slider {
    id_slider: number;
    judul_slider: string;
    subjudul_slider: string;
    gambar: string;
    link: string;
    urutan: number;
    status_slider: string;
}

export default function AdminSlider() {
    const [slider, setSlider] = useState<Slider[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<Slider | null>(null);
    const [form, setForm] = useState({
        judul_slider: '',
        subjudul_slider: '',
        gambar: '',
        link: '',
        urutan: 1,
        status_slider: 'Publish',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/konfigurasi/slider', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const data = await res.json();
            setSlider(data.data || []);
        } catch (error) {
            toast.error('Gagal memuat data');
        } finally {
            setLoading(false);
        }
    };

    const openModal = (item?: Slider) => {
        if (item) {
            setEditingItem(item);
            setForm({
                judul_slider: item.judul_slider || '',
                subjudul_slider: item.subjudul_slider || '',
                gambar: item.gambar || '',
                link: item.link || '',
                urutan: item.urutan || 1,
                status_slider: item.status_slider || 'Publish',
            });
        } else {
            setEditingItem(null);
            setForm({
                judul_slider: '',
                subjudul_slider: '',
                gambar: '',
                link: '',
                urutan: slider.length + 1,
                status_slider: 'Publish',
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
        try {
            const res = await uploadApi.upload(file, 'slider', 'image');
            setForm({ ...form, gambar: res.data.data.key });
            toast.success('Gambar berhasil diupload');
        } catch (error) {
            toast.error('Gagal upload gambar');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.gambar) {
            toast.error('Gambar harus diupload');
            return;
        }
        try {
            const endpoint = editingItem
                ? `/api/konfigurasi/slider/${editingItem.id_slider}`
                : '/api/konfigurasi/slider';
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
            toast.success(editingItem ? 'Slider berhasil diperbarui' : 'Slider berhasil ditambahkan');
            closeModal();
            fetchData();
        } catch (error) {
            toast.error('Terjadi kesalahan');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Yakin ingin menghapus slider ini?')) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/konfigurasi/slider/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            toast.success('Slider berhasil dihapus');
            fetchData();
        } catch (error) {
            toast.error('Gagal menghapus slider');
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Kelola Slider</h1>
                    <p className="text-gray-600">Manajemen slider halaman depan</p>
                </div>
                <button onClick={() => openModal()} className="btn btn-primary">
                    <Plus className="w-4 h-4 mr-2" /> Tambah Slider
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                    <div className="col-span-3 flex justify-center py-12"><div className="spinner" /></div>
                ) : slider.length === 0 ? (
                    <div className="col-span-3 text-center py-12 text-gray-500 bg-white rounded-xl">
                        <Image className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>Belum ada slider</p>
                        <p className="text-sm mt-2">Tambahkan minimal 3 slider untuk tampilan optimal</p>
                    </div>
                ) : (
                    slider.map((item) => (
                        <div key={item.id_slider} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                            <div className="aspect-video bg-gray-100">
                                {item.gambar && (
                                    <img src={`/api/upload/${item.gambar}`} alt="" className="w-full h-full object-cover" />
                                )}
                            </div>
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">#{item.urutan}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded ${item.status_slider === 'Publish' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {item.status_slider}
                                    </span>
                                </div>
                                <h3 className="font-semibold text-gray-900 truncate">{item.judul_slider || 'Tanpa Judul'}</h3>
                                {item.subjudul_slider && (
                                    <p className="text-sm text-gray-500 truncate">{item.subjudul_slider}</p>
                                )}
                                <div className="flex items-center gap-2 mt-4">
                                    <button onClick={() => openModal(item)} className="flex-1 btn btn-outline text-sm py-1.5">
                                        <Edit2 className="w-3 h-3 mr-1" /> Edit
                                    </button>
                                    <button onClick={() => handleDelete(item.id_slider)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
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
                            <h2 className="text-lg font-bold">{editingItem ? 'Edit Slider' : 'Tambah Slider'}</h2>
                            <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <label className="form-label">Judul</label>
                                <input
                                    type="text"
                                    value={form.judul_slider}
                                    onChange={(e) => setForm({ ...form, judul_slider: e.target.value })}
                                    className="form-input"
                                    placeholder="Selamat Datang..."
                                />
                            </div>
                            <div>
                                <label className="form-label">Subjudul</label>
                                <input
                                    type="text"
                                    value={form.subjudul_slider}
                                    onChange={(e) => setForm({ ...form, subjudul_slider: e.target.value })}
                                    className="form-input"
                                    placeholder="Deskripsi singkat..."
                                />
                            </div>
                            <div>
                                <label className="form-label">Gambar * (Ukuran ideal: 1920x600)</label>
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="form-input" />
                                {form.gambar && (
                                    <img src={`/api/upload/${form.gambar}`} alt="" className="mt-2 h-32 w-full object-cover rounded-lg" />
                                )}
                            </div>
                            <div>
                                <label className="form-label">Link (opsional)</label>
                                <input
                                    type="text"
                                    value={form.link}
                                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                                    className="form-input"
                                    placeholder="/pendaftaran"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="form-label">Urutan</label>
                                    <input
                                        type="number"
                                        value={form.urutan}
                                        onChange={(e) => setForm({ ...form, urutan: parseInt(e.target.value) })}
                                        className="form-input"
                                        min={1}
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Status</label>
                                    <select
                                        value={form.status_slider}
                                        onChange={(e) => setForm({ ...form, status_slider: e.target.value })}
                                        className="form-input"
                                    >
                                        <option value="Publish">Publish</option>
                                        <option value="Draft">Draft</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button type="button" onClick={closeModal} className="btn btn-outline">Batal</button>
                                <button type="submit" className="btn btn-primary" disabled={!form.gambar}>Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
