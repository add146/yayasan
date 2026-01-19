import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight, Calendar, Eye, ChevronRight, ChevronLeft, X,
    Target, Compass, BookOpen, GraduationCap, Users, Award, Heart, Building2
} from 'lucide-react';
import { beritaApi, galeriApi, konfiguasiApi, getImageUrl } from '../../lib/api';

interface Berita {
    id_berita: number;
    slug_berita: string;
    judul_berita: string;
    ringkasan: string;
    gambar: string;
    tanggal_post: string;
    nama_kategori: string;
    hits: number;
}

interface Galeri {
    id_galeri: number;
    judul_galeri: string;
    gambar: string;
}

interface Slider {
    id_slider: number;
    judul_slider: string;
    subjudul_slider: string;
    gambar: string;
    link: string;
}

export default function Home() {
    const [berita, setBerita] = useState<Berita[]>([]);
    const [galeri, setGaleri] = useState<Galeri[]>([]);
    const [slider, setSlider] = useState<Slider[]>([]);
    const [config, setConfig] = useState<any>({});
    const [fasilitas, setFasilitas] = useState<any[]>([]);
    const [lightboxImage, setLightboxImage] = useState<Galeri | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [beritaRes, galeriRes, sliderRes, configRes] = await Promise.all([
                    beritaApi.getAll({ limit: 6 }),
                    galeriApi.getAll({ jenis: 'Homepage', limit: 8 }),
                    konfiguasiApi.getSlider(),
                    konfiguasiApi.get(),
                ]);
                setBerita(beritaRes.data.data || []);
                setGaleri(galeriRes.data.data || []);
                setSlider(sliderRes.data.data || []);
                setConfig(configRes.data.data || {});

                // Fetch fasilitas separately to avoid blocking main content
                try {
                    const fasilitasRes = await fetch('/api/fasilitas');
                    const fasilitasData = await fasilitasRes.json();
                    setFasilitas(fasilitasData.data || []);
                } catch (fasilitasError) {
                    console.error('Error fetching fasilitas:', fasilitasError);
                    setFasilitas([]);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Auto-slide
    useEffect(() => {
        if (slider.length > 1) {
            const interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % slider.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [slider.length]);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slider.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slider.length) % slider.length);

    return (
        <div className="animate-fade-in">
            {/* Hero Slider Section */}
            {slider.length > 0 ? (
                <section className="relative h-[600px] lg:h-[700px] overflow-hidden">
                    {slider.map((item, index) => (
                        <div
                            key={item.id_slider}
                            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                        >
                            <img
                                src={getImageUrl(item.gambar)}
                                alt={item.judul_slider}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
                            <div className="absolute inset-0 flex items-center">
                                <div className="container mx-auto px-4">
                                    <div className="max-w-2xl text-white">
                                        <h1 className="text-4xl lg:text-6xl font-bold mb-4 leading-tight">
                                            {item.judul_slider || 'Selamat Datang'}
                                        </h1>
                                        {item.subjudul_slider && (
                                            <p className="text-xl lg:text-2xl text-gray-200 mb-8">
                                                {item.subjudul_slider}
                                            </p>
                                        )}
                                        <div className="flex flex-wrap gap-4">
                                            <Link to="/pendaftaran" className="btn bg-primary-600 hover:bg-primary-700 text-white text-lg px-8 py-3">
                                                Daftar Sekarang
                                                <ArrowRight className="w-5 h-5 ml-2" />
                                            </Link>
                                            <Link to="/profil" className="btn border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-3">
                                                Tentang Kami
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Navigation Arrows */}
                    {slider.length > 1 && (
                        <>
                            <button
                                onClick={prevSlide}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-colors"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-colors"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}

                    {/* Slide Indicators */}
                    {slider.length > 1 && (
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
                            {slider.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white w-8' : 'bg-white/50'}`}
                                />
                            ))}
                        </div>
                    )}
                </section>
            ) : (
                <section className="gradient-primary py-24 lg:py-32 text-white">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                            {config?.nama_website || 'Selamat Datang'}
                        </h1>
                        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                            {config?.tagline || 'Lembaga Pendidikan Unggul'}
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link to="/pendaftaran" className="btn bg-white text-primary-700 hover:bg-gray-100 text-lg px-8">
                                Daftar Sekarang
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Link>
                            <Link to="/profil" className="btn border-2 border-white text-white hover:bg-white/10">
                                Tentang Kami
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Stats Section */}
            {config.tampilkan_statistik === 'Ya' && (
                <section className="py-8 bg-white shadow-lg relative -mt-16 mx-4 lg:mx-auto max-w-5xl rounded-2xl z-10">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-6">
                        {[
                            { value: config.stat1_value || '1000+', label: config.stat1_label || 'Siswa Aktif' },
                            { value: config.stat2_value || '50+', label: config.stat2_label || 'Guru & Staff' },
                            { value: config.stat3_value || '20+', label: config.stat3_label || 'Tahun Pengalaman' },
                            { value: config.stat4_value || '100%', label: config.stat4_label || 'Akreditasi A' },
                        ].map((stat, index) => (
                            <div key={index} className="text-center py-4">
                                <div className="text-3xl lg:text-4xl font-bold text-primary-600">{stat.value}</div>
                                <div className="text-gray-600 text-sm mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Tentang Kami Section */}
            {config.tampilkan_konten === 'Ya' && (
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <span className="text-primary-600 font-semibold uppercase tracking-wider text-sm">Tentang Kami</span>
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2">Visi, Misi & Rencana</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {/* Visi */}
                            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border-t-4 border-primary-500">
                                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-6">
                                    <Target className="w-8 h-8 text-primary-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Visi Kami</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {config.visi || 'Menjadi lembaga pendidikan unggul yang menghasilkan generasi berakhlak mulia, cerdas, dan kompetitif di tingkat nasional maupun internasional.'}
                                </p>
                            </div>

                            {/* Misi */}
                            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border-t-4 border-green-500">
                                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
                                    <Compass className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Misi Kami</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {config.misi || 'Menyelenggarakan pendidikan berkualitas dengan kurikulum terpadu, membentuk karakter islami, dan mengembangkan potensi siswa secara optimal.'}
                                </p>
                            </div>

                            {/* Rencana */}
                            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border-t-4 border-yellow-500">
                                <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-6">
                                    <BookOpen className="w-8 h-8 text-yellow-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Rencana Kami</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {config.rencana || 'Terus mengembangkan fasilitas, meningkatkan kualitas tenaga pendidik, dan memperluas kerjasama dengan institusi pendidikan terkemuka.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Program Section */}
            {config.tampilkan_program === 'Ya' && (
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <span className="text-primary-600 font-semibold uppercase tracking-wider text-sm">Program Kami</span>
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2">Program Unggulan</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                            {[
                                { icon: GraduationCap, title: config.program1_title || 'Kurikulum Terpadu', desc: config.program1_desc || 'Perpaduan kurikulum nasional dan keagamaan', color: 'blue' },
                                { icon: Users, title: config.program2_title || 'Ekstrakurikuler', desc: config.program2_desc || 'Berbagai kegiatan pengembangan bakat', color: 'green' },
                                { icon: Award, title: config.program3_title || 'Prestasi', desc: config.program3_desc || 'Bimbingan olimpiade dan kompetisi', color: 'purple' },
                                { icon: Heart, title: config.program4_title || 'Karakter Building', desc: config.program4_desc || 'Pembentukan akhlak dan kepribadian', color: 'red' },
                            ].map((item, index) => (
                                <div key={index} className="group relative bg-gray-50 rounded-2xl p-6 hover:bg-primary-600 transition-colors duration-300 cursor-pointer">
                                    <div className={`w-14 h-14 rounded-xl bg-${item.color}-100 group-hover:bg-white/20 flex items-center justify-center mb-4 transition-colors`}>
                                        <item.icon className={`w-7 h-7 text-${item.color}-600 group-hover:text-white transition-colors`} />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-white mb-2 transition-colors">{item.title}</h3>
                                    <p className="text-gray-600 group-hover:text-white/80 text-sm transition-colors">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Fasilitas Section */}
            {config.tampilkan_fasilitas === 'Ya' && (
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <span className="text-primary-600 font-semibold uppercase tracking-wider text-sm">Facilities</span>
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2">Fasilitas Kami</h2>
                            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                                Kami menyediakan berbagai fasilitas modern untuk mendukung kegiatan belajar dan perkembangan siswa
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                            {fasilitas.slice(0, 6).map((item: any) => (
                                <div key={item.id_fasilitas} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                                    <div className="p-6">
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0">
                                                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                                                    <Building2 className="w-6 h-6 text-primary-600" />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-gray-900 mb-1">{item.judul_fasilitas}</h3>
                                                <p className="text-gray-600 text-sm line-clamp-2">{item.isi_fasilitas}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {fasilitas.length > 6 && (
                            <div className="text-center mt-10">
                                <Link to="/profil" className="btn btn-outline px-8">
                                    Lihat Semua Fasilitas
                                </Link>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Berita Section */}
            {config.tampilkan_berita === 'Ya' && (
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <span className="text-primary-600 font-semibold uppercase tracking-wider text-sm">Informasi</span>
                                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2">Berita Terbaru</h2>
                            </div>
                            <Link to="/berita" className="hidden md:flex items-center text-primary-600 font-semibold hover:text-primary-700">
                                Lihat Semua <ChevronRight className="w-5 h-5 ml-1" />
                            </Link>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-12"><div className="spinner" /></div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {berita.slice(0, 3).map((item) => (
                                    <Link key={item.id_berita} to={`/berita/${item.slug_berita}`} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                                        {item.gambar && (
                                            <div className="aspect-video overflow-hidden">
                                                <img
                                                    src={getImageUrl(item.gambar)}
                                                    alt={item.judul_berita}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                        )}
                                        <div className="p-6">
                                            <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                                                <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-medium">
                                                    {item.nama_kategori}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(item.tanggal_post).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors text-lg line-clamp-2 mb-2">
                                                {item.judul_berita}
                                            </h3>
                                            <p className="text-gray-600 text-sm line-clamp-2">{item.ringkasan}</p>
                                            <div className="flex items-center text-sm text-gray-400 mt-4">
                                                <Eye className="w-4 h-4 mr-1" /> {item.hits} views
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        <Link to="/berita" className="md:hidden btn btn-outline w-full mt-8">
                            Lihat Semua Berita
                        </Link>
                    </div>
                </section>
            )}

            {/* Galeri Section */}
            {config.tampilkan_galeri === 'Ya' && (
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <span className="text-primary-600 font-semibold uppercase tracking-wider text-sm">Dokumentasi</span>
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2">Galeri Kegiatan</h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
                            {galeri.map((item) => (
                                <div
                                    key={item.id_galeri}
                                    className="aspect-square rounded-2xl overflow-hidden group cursor-pointer shadow-lg"
                                    onClick={() => setLightboxImage(item)}
                                >
                                    <img
                                        src={getImageUrl(item.gambar)}
                                        alt={item.judul_galeri}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-10">
                            <Link to="/galeri" className="btn btn-outline px-8">
                                Lihat Galeri Lengkap
                            </Link>
                        </div>
                    </div>
                </section>
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
                        src={getImageUrl(lightboxImage.gambar)}
                        alt={lightboxImage.judul_galeri}
                        className="max-w-full max-h-[90vh] rounded-lg object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                    {lightboxImage.judul_galeri && (
                        <div className="absolute bottom-8 left-0 right-0 text-center">
                            <p className="text-white text-lg font-medium">{lightboxImage.judul_galeri}</p>
                        </div>
                    )}
                </div>
            )}

            {/* CTA Section */}
            <section className="py-20 gradient-secondary text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-4">Siap Bergabung dengan Kami?</h2>
                    <p className="text-green-100 mb-10 max-w-2xl mx-auto text-lg">
                        Daftarkan putra-putri Anda sekarang dan jadilah bagian dari keluarga besar kami.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link to="/pendaftaran" className="btn bg-white text-green-700 hover:bg-green-50 text-lg px-10 py-3">
                            Daftar Sekarang
                        </Link>
                        <a
                            href={config?.whatsapp ? `https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}` : '/kontak'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn border-2 border-white text-white hover:bg-white/10 text-lg px-10 py-3"
                        >
                            Hubungi Kami
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
