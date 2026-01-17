import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import { staffApi, kategoriApi, uploadApi } from '../../lib/api';
import toast from 'react-hot-toast';

interface Staff {
    id_staff: number;
    slug_staff: string;
    nama_staff: string;
    jabatan: string;
    nip: string;
    gambar: string;
    status_staff: string;
    nama_kategori_staff: string;
    id_kategori_staff: number;
}

interface KategoriStaff {
    id_kategori_staff: number;
    nama_kategori_staff: string;
}

export default function AdminStaff() {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [kategori, setKategori] = useState<KategoriStaff[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<Staff | null>(null);
    const [form, setForm] = useState({
        id_kategori_staff: '',
        nama_staff: '',
        gelar_depan: '',
        gelar_belakang: '',
        jabatan: '',
        nip: '',
        email: '',
        telepon: '',
        isi: '',
        gambar: '',
        status_staff: 'Publish',
        urutan: 0,
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [staffRes, kategoriRes] = await Promise.all([
                staffApi.getAll({ limit: 100 }),
                kategoriApi.getStaff(),
            ]);
            setStaff(staffRes.data.data || []);
            setKategori(kategoriRes.data.data || []);
        } catch (error) {
            toast.error('Gagal memuat data');
        } finally {
            setLoading(false);
        }
    };

    const openModal = (item?: Staff) => {
        if (item) {
            setEditingItem(item);
            setForm({
                id_kategori_staff: String(item.id_kategori_staff || ''),
                nama_staff: item.nama_staff,
                gelar_depan: '',
                gelar_belakang: '',
                jabatan: item.jabatan || '',
                nip: item.nip || '',
                email: '',
                telepon: '',
                isi: '',
                gambar: item.gambar || '',
                status_staff: item.status_staff,
                urutan: 0,
            });
        } else {
            setEditingItem(null);
            setForm({
                id_kategori_staff: '',
                nama_staff: '',
                gelar_depan: '',
                gelar_belakang: '',
                jabatan: '',
                nip: '',
                email: '',
                telepon: '',
                isi: '',
                gambar: '',
                status_staff: 'Publish',
                urutan: 0,
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
            const data = {
                ...form,
                id_kategori_staff: form.id_kategori_staff ? parseInt(form.id_kategori_staff) : null,
            };
            if (editingItem) {
                await staffApi.update(editingItem.id_staff, data);
                toast.success('Staff berhasil diperbarui');
            } else {
                await staffApi.create(data);
                toast.success('Staff berhasil ditambahkan');
            }
            closeModal();
            fetchData();
        } catch (error) {
            toast.error('Terjadi kesalahan');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Yakin ingin menghapus staff ini?')) return;
        try {
            await staffApi.delete(id);
            toast.success('Staff berhasil dihapus');
            fetchData();
        } catch (error) {
            toast.error('Gagal menghapus staff');
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const res = await uploadApi.upload(file, 'staff', 'image');
            setForm({ ...form, gambar: res.data.data.key });
            toast.success('Foto berhasil diupload');
        } catch (error) {
            toast.error('Gagal upload foto');
        }
    };

    const filteredStaff = staff.filter(
        (item) => item.nama_staff?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Kelola Staff</h1>
                    <p className="text-gray-600">Manajemen data guru dan karyawan</p>
                </div>
                <button onClick={() => openModal()} className="btn btn-primary">
                    <Plus className="w-4 h-4 mr-2" /> Tambah Staff
                </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
                <div className="relative">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari staff..."
                        className="form-input pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {loading ? (
                    <div className="col-span-4 flex justify-center py-12"><div className="spinner" /></div>
                ) : filteredStaff.length === 0 ? (
                    <div className="col-span-4 text-center py-12 text-gray-500 bg-white rounded-xl">
                        Belum ada data staff
                    </div>
                ) : (
                    filteredStaff.map((item) => (
                        <div key={item.id_staff} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                            <div className="flex items-start gap-3">
                                <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                                    {item.gambar ? (
                                        <img src={`/api/upload/${item.gambar}`} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-2xl text-gray-400">
                                            {item.nama_staff?.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 truncate">{item.nama_staff}</h3>
                                    <p className="text-sm text-gray-600 truncate">{item.jabatan || '-'}</p>
                                    <p className="text-xs text-gray-500">{item.nama_kategori_staff}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                                <button
                                    onClick={() => openModal(item)}
                                    className="flex-1 btn btn-outline text-sm py-1.5"
                                >
                                    <Edit2 className="w-3 h-3 mr-1" /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id_staff)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                >
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
                    <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-lg font-bold">{editingItem ? 'Edit Staff' : 'Tambah Staff'}</h2>
                            <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <label className="form-label">Kategori</label>
                                <select
                                    value={form.id_kategori_staff}
                                    onChange={(e) => setForm({ ...form, id_kategori_staff: e.target.value })}
                                    className="form-input"
                                >
                                    <option value="">Pilih Kategori</option>
                                    {kategori.map((k) => (
                                        <option key={k.id_kategori_staff} value={k.id_kategori_staff}>
                                            {k.nama_kategori_staff}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="form-label">Nama Lengkap *</label>
                                <input
                                    type="text"
                                    value={form.nama_staff}
                                    onChange={(e) => setForm({ ...form, nama_staff: e.target.value })}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="form-label">Jabatan</label>
                                    <input
                                        type="text"
                                        value={form.jabatan}
                                        onChange={(e) => setForm({ ...form, jabatan: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                                <div>
                                    <label className="form-label">NIP</label>
                                    <input
                                        type="text"
                                        value={form.nip}
                                        onChange={(e) => setForm({ ...form, nip: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="form-label">Foto</label>
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="form-input" />
                                {form.gambar && (
                                    <img src={`/api/upload/${form.gambar}`} alt="" className="mt-2 h-20 rounded-lg" />
                                )}
                            </div>

                            <div>
                                <label className="form-label">Status</label>
                                <select
                                    value={form.status_staff}
                                    onChange={(e) => setForm({ ...form, status_staff: e.target.value })}
                                    className="form-input"
                                >
                                    <option value="Publish">Publish</option>
                                    <option value="Draft">Draft</option>
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
