import { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, Clock, Plus, X, Trash2 } from 'lucide-react';
import { siswaApi, pendaftaranApi } from '../../lib/api';
import toast from 'react-hot-toast';

interface Siswa {
    id_siswa: number;
    kode_siswa: string;
    nama_siswa: string;
    jenis_kelamin: string;
    asal_sekolah: string;
    status_siswa: string;
    nama_gelombang: string;
    nama_jenjang: string;
    tanggal_post: string;
}

interface Gelombang {
    id_gelombang: number;
    judul: string;
}

interface Jenjang {
    id_jenjang_pendidikan: number;
    judul_jenjang_pendidikan: string;
}

export default function AdminSiswa() {
    const [siswa, setSiswa] = useState<Siswa[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [gelombang, setGelombang] = useState<Gelombang[]>([]);
    const [jenjang, setJenjang] = useState<Jenjang[]>([]);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        nama_siswa: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        jenis_kelamin: 'Laki-laki',
        id_jenjang: '',
        id_gelombang: '',
        asal_sekolah: '',
        alamat: '',
        telepon: '',
        email: '',
        nama_ayah: '',
        telepon_ayah: '',
        nama_ibu: '',
        telepon_ibu: '',
    });

    useEffect(() => {
        fetchData();
        fetchDropdowns();
    }, [statusFilter]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await siswaApi.getAll({
                status: statusFilter || undefined,
                limit: 100
            });
            setSiswa(res.data.data || []);
        } catch (error) {
            toast.error('Gagal memuat data');
        } finally {
            setLoading(false);
        }
    };

    const fetchDropdowns = async () => {
        try {
            const [gelRes, jenjangRes] = await Promise.all([
                pendaftaranApi.getGelombang(),
                pendaftaranApi.getJenjang(),
            ]);
            setGelombang(gelRes.data.data || []);
            setJenjang(jenjangRes.data.data || []);
        } catch (error) {
            console.error('Dropdown error:', error);
        }
    };

    const updateStatus = async (id: number, status: string) => {
        try {
            await siswaApi.updateStatus(id, { status_siswa: status });
            toast.success(`Status diubah menjadi ${status}`);
            fetchData();
        } catch (error) {
            toast.error('Gagal mengubah status');
        }
    };

    const deleteSiswa = async (id: number) => {
        if (!confirm('Yakin ingin menghapus siswa ini?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/siswa/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed');
            toast.success('Siswa berhasil dihapus');
            fetchData();
        } catch (error) {
            toast.error('Gagal menghapus siswa');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.nama_siswa || !form.jenis_kelamin) {
            toast.error('Nama dan jenis kelamin harus diisi');
            return;
        }
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const kode_siswa = 'ADM' + Date.now().toString(36).toUpperCase();

            const res = await fetch('/api/siswa', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...form,
                    kode_siswa,
                    id_jenjang: form.id_jenjang ? parseInt(form.id_jenjang) : null,
                    id_gelombang: form.id_gelombang ? parseInt(form.id_gelombang) : null,
                    status_siswa: 'Diterima',
                })
            });

            if (!res.ok) throw new Error('Failed');
            toast.success('Siswa berhasil ditambahkan');
            setShowModal(false);
            resetForm();
            fetchData();
        } catch (error) {
            toast.error('Gagal menambahkan siswa');
        } finally {
            setSaving(false);
        }
    };

    const resetForm = () => {
        setForm({
            nama_siswa: '',
            tempat_lahir: '',
            tanggal_lahir: '',
            jenis_kelamin: 'Laki-laki',
            id_jenjang: '',
            id_gelombang: '',
            asal_sekolah: '',
            alamat: '',
            telepon: '',
            email: '',
            nama_ayah: '',
            telepon_ayah: '',
            nama_ibu: '',
            telepon_ibu: '',
        });
    };

    const filteredSiswa = siswa.filter(
        (item) =>
            item.nama_siswa?.toLowerCase().includes(search.toLowerCase()) ||
            item.kode_siswa?.toLowerCase().includes(search.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Diterima': return 'bg-green-100 text-green-700';
            case 'Ditolak': return 'bg-red-100 text-red-700';
            case 'Menunggu': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Kelola Siswa</h1>
                    <p className="text-gray-600">Manajemen data siswa terdaftar</p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn btn-primary">
                    <Plus className="w-4 h-4 mr-2" /> Tambah Siswa
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari siswa..."
                            className="form-input pl-10"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="form-input w-full md:w-48"
                    >
                        <option value="">Semua Status</option>
                        <option value="Menunggu">Menunggu</option>
                        <option value="Diterima">Diterima</option>
                        <option value="Ditolak">Ditolak</option>
                    </select>
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
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Kode</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Nama Siswa</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Asal Sekolah</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Gelombang</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Status</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Tanggal</th>
                                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSiswa.map((item) => (
                                <tr key={item.id_siswa} className="border-b border-gray-50 hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm font-mono text-gray-600">{item.kode_siswa?.slice(0, 8)}</td>
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-gray-900">{item.nama_siswa}</p>
                                        <p className="text-sm text-gray-500">{item.jenis_kelamin}</p>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{item.asal_sekolah || '-'}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{item.nama_gelombang || '-'}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status_siswa)}`}>
                                            {item.status_siswa}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {new Date(item.tanggal_post).toLocaleDateString('id-ID')}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => updateStatus(item.id_siswa, 'Diterima')}
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                                title="Terima"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => updateStatus(item.id_siswa, 'Ditolak')}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                title="Tolak"
                                            >
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => updateStatus(item.id_siswa, 'Menunggu')}
                                                className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg"
                                                title="Pending"
                                            >
                                                <Clock className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteSiswa(item.id_siswa)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                                title="Hapus"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredSiswa.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                                        Belum ada data siswa
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal Tambah Siswa */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
                            <h2 className="text-lg font-bold">Tambah Siswa Baru</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="form-label">Nama Lengkap *</label>
                                    <input
                                        type="text"
                                        value={form.nama_siswa}
                                        onChange={(e) => setForm({ ...form, nama_siswa: e.target.value })}
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Tempat Lahir</label>
                                    <input
                                        type="text"
                                        value={form.tempat_lahir}
                                        onChange={(e) => setForm({ ...form, tempat_lahir: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Tanggal Lahir</label>
                                    <input
                                        type="date"
                                        value={form.tanggal_lahir}
                                        onChange={(e) => setForm({ ...form, tanggal_lahir: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Jenis Kelamin *</label>
                                    <select
                                        value={form.jenis_kelamin}
                                        onChange={(e) => setForm({ ...form, jenis_kelamin: e.target.value })}
                                        className="form-input"
                                        required
                                    >
                                        <option value="Laki-laki">Laki-laki</option>
                                        <option value="Perempuan">Perempuan</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="form-label">Program/Jurusan</label>
                                    <select
                                        value={form.id_jenjang}
                                        onChange={(e) => setForm({ ...form, id_jenjang: e.target.value })}
                                        className="form-input"
                                    >
                                        <option value="">Pilih Program</option>
                                        {jenjang.map(j => (
                                            <option key={j.id_jenjang_pendidikan} value={j.id_jenjang_pendidikan}>{j.judul_jenjang_pendidikan}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="form-label">Gelombang</label>
                                    <select
                                        value={form.id_gelombang}
                                        onChange={(e) => setForm({ ...form, id_gelombang: e.target.value })}
                                        className="form-input"
                                    >
                                        <option value="">Pilih Gelombang</option>
                                        {gelombang.map(g => (
                                            <option key={g.id_gelombang} value={g.id_gelombang}>{g.judul}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="form-label">Asal Sekolah</label>
                                    <input
                                        type="text"
                                        value={form.asal_sekolah}
                                        onChange={(e) => setForm({ ...form, asal_sekolah: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="form-label">Alamat</label>
                                    <textarea
                                        value={form.alamat}
                                        onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                                        className="form-input"
                                        rows={2}
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Telepon</label>
                                    <input
                                        type="text"
                                        value={form.telepon}
                                        onChange={(e) => setForm({ ...form, telepon: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Nama Ayah</label>
                                    <input
                                        type="text"
                                        value={form.nama_ayah}
                                        onChange={(e) => setForm({ ...form, nama_ayah: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Telepon Ayah</label>
                                    <input
                                        type="text"
                                        value={form.telepon_ayah}
                                        onChange={(e) => setForm({ ...form, telepon_ayah: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Nama Ibu</label>
                                    <input
                                        type="text"
                                        value={form.nama_ibu}
                                        onChange={(e) => setForm({ ...form, nama_ibu: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Telepon Ibu</label>
                                    <input
                                        type="text"
                                        value={form.telepon_ibu}
                                        onChange={(e) => setForm({ ...form, telepon_ibu: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-4 border-t">
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">
                                    Batal
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? 'Menyimpan...' : 'Simpan Siswa'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
