import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { pendaftaranApi, konfiguasiApi } from '../../lib/api';
import { useAuthStore } from '../../lib/store';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Pendaftaran() {
    const navigate = useNavigate();
    const { isAuthenticated, userType } = useAuthStore();
    const [gelombang, setGelombang] = useState([]);
    const [jenjang, setJenjang] = useState([]);
    const [config, setConfig] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

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
        if (!isAuthenticated || userType !== 'siswa') {
            toast.error('Silakan login terlebih dahulu');
            navigate('/signin');
            return;
        }

        try {
            await pendaftaranApi.daftar(data);
            toast.success('Pendaftaran berhasil!');
            navigate('/signin');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Terjadi kesalahan');
        }
    };

    const getImageUrl = (img: string) => {
        return img.startsWith('http') || img.startsWith('/') ? img : `/api/upload/${img}`;
    };

    if (loading) {
        return <div className="flex justify-center py-20"><div className="spinner" /></div>;
    }

    return (
        <div className="py-12 animate-fade-in">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900">Pendaftaran Siswa Baru</h1>
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
                                <label className="form-label">Program/Jurusan *</label>
                                <select {...register('id_jenjang', { required: true })} className="form-input">
                                    <option value="">Pilih Program</option>
                                    {jenjang.map((j: any) => (
                                        <option key={j.id_jenjang_pendidikan} value={j.id_jenjang_pendidikan}>{j.judul_jenjang_pendidikan}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
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

                            <div className="grid grid-cols-2 gap-4">
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
                                <label className="form-label">Alamat</label>
                                <textarea {...register('alamat')} className="form-input" rows={2} />
                            </div>

                            <div>
                                <label className="form-label">Asal Sekolah</label>
                                <input {...register('asal_sekolah')} className="form-input" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
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

                            {!isAuthenticated && (
                                <p className="text-center text-sm text-gray-600 mt-4">
                                    Belum punya akun? <a href="/signin" className="text-primary-600 hover:underline">Daftar dulu di sini</a>
                                </p>
                            )}
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
