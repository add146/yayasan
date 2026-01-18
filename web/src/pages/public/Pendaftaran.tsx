import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { pendaftaranApi, konfiguasiApi, getImageUrl, API_URL } from '../../lib/api';
import { X, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Pendaftaran() {
    const [gelombang, setGelombang] = useState([]);
    const [jenjang, setJenjang] = useState([]);
    const [config, setConfig] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [kodePendaftaran, setKodePendaftaran] = useState('');
    const [selectedJenjang, setSelectedJenjang] = useState<any>(null);
    const { register, handleSubmit, formState: { isSubmitting }, reset } = useForm();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [gelombangRes, jenjangRes, configRes] = await Promise.all([
                    pendaftaranApi.getGelombang('Buka'),
                    pendaftaranApi.getJenjang(),
                    konfiguasiApi.get(),
                ]);
                setGelombang(gelombangRes.data.data || []);
                setJenjang(jenjangRes.data.data || []);
                setConfig(configRes.data.data || {});
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const onSubmit = async (data: any) => {
        try {
            const res = await fetch(`${API_URL}/api/pendaftaran/daftar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await res.json();

            if (result.success) {
                setKodePendaftaran(result.data.kode_siswa);
                setIsSuccess(true);
                reset();
                toast.success('Pendaftaran berhasil!');
            } else {
                toast.error(result.message || 'Terjadi kesalahan');
            }
        } catch (error: any) {
            toast.error('Terjadi kesalahan pada server');
        }
    };

    if (loading) {
        return <div className="flex justify-center py-20"><div className="spinner" /></div>;
    }

    // Success message after registration
    if (isSuccess) {
        return (
            <div className="py-12 animate-fade-in">
                <div className="container mx-auto px-4">
                    <div className="max-w-lg mx-auto text-center">
                        <div className="bg-white rounded-2xl p-8 shadow-lg">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-10 h-10 text-green-600" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Pendaftaran Berhasil!</h1>
                            <p className="text-gray-600 mb-6">
                                Terima kasih telah mendaftar. Silakan tunggu informasi selanjutnya dari pihak yayasan.
                            </p>
                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <p className="text-sm text-gray-500">Kode Pendaftaran Anda:</p>
                                <p className="text-lg font-mono font-bold text-primary-600">{kodePendaftaran.slice(0, 8).toUpperCase()}</p>
                            </div>
                            <button
                                onClick={() => setIsSuccess(false)}
                                className="btn btn-primary"
                            >
                                Daftar Lagi
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-12 animate-fade-in">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Pendaftaran Siswa Baru</h1>
                    <p className="text-gray-600 mt-2">Lengkapi formulir pendaftaran di bawah ini</p>
                </div>

                {/* Poster Brosur Section */}
                {(config.poster1 || config.poster2) && (
                    <div className="mb-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            {config.poster1 && (
                                <div
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                                    onClick={() => setLightboxImage(getImageUrl(config.poster1))}
                                >
                                    <img
                                        src={getImageUrl(config.poster1)}
                                        alt="Brosur Pendaftaran 1"
                                        className="w-full h-auto object-contain"
                                    />
                                </div>
                            )}
                            {config.poster2 && (
                                <div
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                                    onClick={() => setLightboxImage(getImageUrl(config.poster2))}
                                >
                                    <img
                                        src={getImageUrl(config.poster2)}
                                        alt="Brosur Pendaftaran 2"
                                        className="w-full h-auto object-contain"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Lightbox Modal */}
                {lightboxImage && (
                    <div
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                        onClick={() => setLightboxImage(null)}
                    >
                        <button
                            className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                            onClick={() => setLightboxImage(null)}
                        >
                            <X className="w-8 h-8" />
                        </button>
                        <img
                            src={lightboxImage}
                            alt="Brosur Pendaftaran"
                            className="max-w-full max-h-[90vh] rounded-lg object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                )}

                {/* Form Pendaftaran */}
                <div className="max-w-2xl mx-auto">

                    {gelombang.length === 0 ? (
                        <div className="text-center py-12 bg-yellow-50 rounded-xl">
                            <p className="text-yellow-700">Pendaftaran belum dibuka</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-4">
                            <div>
                                <label className="form-label">Gelombang Pendaftaran *</label>
                                <select {...register('id_gelombang', { required: true })} className="form-input">
                                    <option value="">Pilih Gelombang</option>
                                    {gelombang.map((g: any) => (
                                        <option key={g.id_gelombang} value={g.id_gelombang}>{g.judul}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="form-label">Jenjang</label>
                                <select
                                    {...register('id_jenjang')}
                                    className="form-input"
                                    onChange={(e) => {
                                        const selected = jenjang.find((j: any) => j.id_jenjang_pendidikan == e.target.value);
                                        setSelectedJenjang(selected || null);
                                    }}
                                >
                                    <option value="">Pilih Jenjang</option>
                                    {jenjang.map((j: any) => (
                                        <option key={j.id_jenjang_pendidikan} value={j.id_jenjang_pendidikan}>
                                            {j.nama_jenjang}{j.judul_jenjang_pendidikan ? ` - ${j.judul_jenjang_pendidikan}` : ''}
                                        </option>
                                    ))}
                                </select>
                                {selectedJenjang?.ringkasan && (
                                    <p className="text-sm text-gray-600 mt-2 p-3 bg-gray-50 rounded-lg">
                                        {selectedJenjang.ringkasan}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="form-label">Nama Lengkap *</label>
                                    <input {...register('nama_siswa', { required: true })} className="form-input" />
                                </div>
                                <div>
                                    <label className="form-label">Jenis Kelamin *</label>
                                    <select {...register('jenis_kelamin', { required: true })} className="form-input">
                                        <option value="">Pilih</option>
                                        <option value="Laki-laki">Laki-laki</option>
                                        <option value="Perempuan">Perempuan</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="form-label">Tempat Lahir</label>
                                    <input {...register('tempat_lahir')} className="form-input" />
                                </div>
                                <div>
                                    <label className="form-label">Tanggal Lahir</label>
                                    <input type="date" {...register('tanggal_lahir')} className="form-input" />
                                </div>
                            </div>

                            <div>
                                <label className="form-label">No. Telepon/WA</label>
                                <input {...register('telepon')} className="form-input" placeholder="08xxxxx" />
                            </div>

                            <div>
                                <label className="form-label">Alamat</label>
                                <textarea {...register('alamat')} className="form-input" rows={2} />
                            </div>

                            <div>
                                <label className="form-label">Asal Sekolah</label>
                                <input {...register('asal_sekolah')} className="form-input" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="form-label">Nama Ayah</label>
                                    <input {...register('nama_ayah')} className="form-input" />
                                </div>
                                <div>
                                    <label className="form-label">Nama Ibu</label>
                                    <input {...register('nama_ibu')} className="form-input" />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
                                    {isSubmitting ? 'Memproses...' : 'Daftar Sekarang'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
