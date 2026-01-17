import { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, FileText, Eye, Edit2, X } from 'lucide-react';
import { siswaApi, pendaftaranApi } from '../../lib/api';
import toast from 'react-hot-toast';

interface Pendaftar {
    id_siswa: number;
    kode_siswa: string;
    nama_siswa: string;
    jenis_kelamin: string;
    telepon: string;
    asal_sekolah: string;
    status_siswa: string;
    nama_gelombang: string;
    judul_jenjang_pendidikan?: string;
    id_gelombang?: number;
    id_jenjang?: number;
    tanggal_post: string;
    dokumen?: Dokumen[];
}

interface Dokumen {
    id_dokumen: number;
    nama_jenis_dokumen: string;
    gambar: string;
    status_dokumen: string;
}

interface Gelombang {
    id_gelombang: number;
    judul: string;
    tahun_ajaran?: string;
}

interface Jenjang {
    id_jenjang_pendidikan: number;
    judul_jenjang_pendidikan: string;
}

export default function AdminPendaftar() {
    const [pendaftar, setPendaftar] = useState<Pendaftar[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedPendaftar, setSelectedPendaftar] = useState<Pendaftar | null>(null);
    const [dokumen, setDokumen] = useState<Dokumen[]>([]);

    // Edit modal states
    const [showEditModal, setShowEditModal] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [gelombangList, setGelombangList] = useState<Gelombang[]>([]);
    const [jenjangList, setJenjangList] = useState<Jenjang[]>([]);
    const [editData, setEditData] = useState<{ id_gelombang: number; id_jenjang: number }>({
        id_gelombang: 0,
        id_jenjang: 0,
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await siswaApi.getAll({ status: 'Menunggu', limit: 100 });
            setPendaftar(res.data.data || []);
        } catch (error) {
            toast.error('Gagal memuat data');
        } finally {
            setLoading(false);
        }
    };

    const viewDetail = async (item: Pendaftar) => {
        try {
            const res = await siswaApi.getById(item.id_siswa);
            setSelectedPendaftar(res.data.data);
            setDokumen(res.data.data?.dokumen || []);
        } catch (error) {
            toast.error('Gagal memuat detail');
        }
    };

    const updateStatus = async (id: number, status: string) => {
        try {
            await siswaApi.updateStatus(id, { status_siswa: status });
            toast.success(`Status diubah menjadi ${status}`);
            fetchData();
            setSelectedPendaftar(null);
        } catch (error) {
            toast.error('Gagal mengubah status');
        }
    };

    const updateDokumenStatus = async (id: number, status: string) => {
        try {
            await pendaftaranApi.updateDokumenStatus(id, status);
            toast.success(`Dokumen ${status.toLowerCase()}`);
            if (selectedPendaftar) {
                viewDetail(selectedPendaftar);
            }
        } catch (error) {
            toast.error('Gagal mengubah status dokumen');
        }
    };

    const openEditModal = async () => {
        if (!selectedPendaftar) return;

        try {
            // Fetch gelombang and jenjang lists
            const [gelRes, jenRes] = await Promise.all([
                pendaftaranApi.getAllGelombang(),
                pendaftaranApi.getAllJenjang(),
            ]);

            setGelombangList(gelRes.data.data || []);
            setJenjangList(jenRes.data.data || []);
            setEditData({
                id_gelombang: selectedPendaftar.id_gelombang || 0,
                id_jenjang: selectedPendaftar.id_jenjang || 0,
            });
            setShowEditModal(true);
        } catch (error) {
            toast.error('Gagal memuat data dropdown');
        }
    };

    const handleEditSubmit = async () => {
        if (!selectedPendaftar) return;

        setEditLoading(true);
        try {
            await pendaftaranApi.editPendaftaran(selectedPendaftar.id_siswa, editData);
            toast.success('Data pendaftaran berhasil diperbarui');
            setShowEditModal(false);
            fetchData();
            // Refresh selected pendaftar
            viewDetail(selectedPendaftar);
        } catch (error) {
            toast.error('Gagal memperbarui data');
        } finally {
            setEditLoading(false);
        }
    };

    const filteredPendaftar = pendaftar.filter(
        (item) => item.nama_siswa?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Verifikasi Pendaftar</h1>
                    <p className="text-gray-600">Verifikasi dokumen pendaftaran siswa baru</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* List */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari pendaftar..."
                                    className="form-input pl-10 text-sm"
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                        </div>
                        <div className="max-h-[600px] overflow-y-auto">
                            {loading ? (
                                <div className="flex justify-center py-8"><div className="spinner" /></div>
                            ) : filteredPendaftar.length === 0 ? (
                                <div className="text-center py-8 text-gray-500 text-sm">
                                    Tidak ada pendaftar menunggu
                                </div>
                            ) : (
                                filteredPendaftar.map((item) => (
                                    <div
                                        key={item.id_siswa}
                                        onClick={() => viewDetail(item)}
                                        className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${selectedPendaftar?.id_siswa === item.id_siswa ? 'bg-primary-50' : ''
                                            }`}
                                    >
                                        <p className="font-medium text-gray-900">{item.nama_siswa}</p>
                                        <p className="text-sm text-gray-500">{item.asal_sekolah || 'Asal sekolah belum diisi'}</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {new Date(item.tanggal_post).toLocaleDateString('id-ID')}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Detail */}
                <div className="lg:col-span-2">
                    {selectedPendaftar ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{selectedPendaftar.nama_siswa}</h2>
                                    <p className="text-gray-600">{selectedPendaftar.kode_siswa}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={openEditModal}
                                        className="btn bg-blue-600 text-white hover:bg-blue-700"
                                    >
                                        <Edit2 className="w-4 h-4 mr-2" /> Edit
                                    </button>
                                    <button
                                        onClick={() => updateStatus(selectedPendaftar.id_siswa, 'Diterima')}
                                        className="btn bg-green-600 text-white hover:bg-green-700"
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" /> Terima
                                    </button>
                                    <button
                                        onClick={() => updateStatus(selectedPendaftar.id_siswa, 'Ditolak')}
                                        className="btn bg-red-600 text-white hover:bg-red-700"
                                    >
                                        <XCircle className="w-4 h-4 mr-2" /> Tolak
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <p className="text-sm text-gray-500">Jenis Kelamin</p>
                                    <p className="font-medium">{selectedPendaftar.jenis_kelamin}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Telepon</p>
                                    <p className="font-medium">{selectedPendaftar.telepon || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Asal Sekolah</p>
                                    <p className="font-medium">{selectedPendaftar.asal_sekolah || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Gelombang</p>
                                    <p className="font-medium">{selectedPendaftar.nama_gelombang || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Program</p>
                                    <p className="font-medium">{selectedPendaftar.judul_jenjang_pendidikan || '-'}</p>
                                </div>
                            </div>

                            <h3 className="font-bold text-gray-900 mb-4">
                                <FileText className="w-5 h-5 inline mr-2" />
                                Dokumen Pendaftaran
                            </h3>

                            {dokumen.length === 0 ? (
                                <p className="text-gray-500 text-sm">Belum ada dokumen yang diupload</p>
                            ) : (
                                <div className="space-y-3">
                                    {dokumen.map((doc) => (
                                        <div key={doc.id_dokumen} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                            <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden">
                                                <img src={`/api/upload/${doc.gambar}`} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{doc.nama_jenis_dokumen}</p>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${doc.status_dokumen === 'Disetujui' ? 'bg-green-100 text-green-700' :
                                                    doc.status_dokumen === 'Ditolak' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {doc.status_dokumen}
                                                </span>
                                            </div>
                                            <div className="flex gap-1">
                                                <a
                                                    href={`/api/upload/${doc.gambar}`}
                                                    target="_blank"
                                                    className="p-2 text-gray-500 hover:bg-gray-200 rounded"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </a>
                                                <button
                                                    onClick={() => updateDokumenStatus(doc.id_dokumen, 'Disetujui')}
                                                    className="p-2 text-green-600 hover:bg-green-100 rounded"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => updateDokumenStatus(doc.id_dokumen, 'Ditolak')}
                                                    className="p-2 text-red-600 hover:bg-red-100 rounded"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">
                            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>Pilih pendaftar dari daftar untuk melihat detail</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-lg font-bold text-gray-900">Edit Pendaftaran</h3>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Gelombang Pendaftaran
                                </label>
                                <select
                                    value={editData.id_gelombang}
                                    onChange={(e) => setEditData({ ...editData, id_gelombang: Number(e.target.value) })}
                                    className="form-input w-full"
                                >
                                    <option value="">Pilih Gelombang</option>
                                    {gelombangList.map((g) => (
                                        <option key={g.id_gelombang} value={g.id_gelombang}>
                                            {g.judul} {g.tahun_ajaran ? `- ${g.tahun_ajaran}` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Program / Jenjang Pendidikan
                                </label>
                                <select
                                    value={editData.id_jenjang}
                                    onChange={(e) => setEditData({ ...editData, id_jenjang: Number(e.target.value) })}
                                    className="form-input w-full"
                                >
                                    <option value="">Pilih Program</option>
                                    {jenjangList.map((j) => (
                                        <option key={j.id_jenjang_pendidikan} value={j.id_jenjang_pendidikan}>
                                            {j.judul_jenjang_pendidikan}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 p-4 border-t">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="btn bg-gray-200 text-gray-700 hover:bg-gray-300"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleEditSubmit}
                                disabled={editLoading}
                                className="btn bg-blue-600 text-white hover:bg-blue-700"
                            >
                                {editLoading ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

