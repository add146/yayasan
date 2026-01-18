import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Calendar, Eye, Search } from 'lucide-react';
import { beritaApi, kategoriApi, getImageUrl } from '../../lib/api';

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

interface Kategori {
    id_kategori: number;
    slug_kategori: string;
    nama_kategori: string;
}

export default function Berita() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [berita, setBerita] = useState<Berita[]>([]);
    const [kategori, setKategori] = useState<Kategori[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(searchParams.get('search') || '');

    const currentKategori = searchParams.get('kategori') || '';

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [beritaRes, kategoriRes] = await Promise.all([
                    beritaApi.getAll({
                        kategori: currentKategori,
                        search: searchParams.get('search') || undefined,
                        limit: 12,
                    }),
                    kategoriApi.getBerita(),
                ]);
                setBerita(beritaRes.data.data || []);
                setKategori(kategoriRes.data.data || []);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [currentKategori, searchParams]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchParams({ search });
    };

    return (
        <div className="py-12 animate-fade-in">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Berita & Informasi</h1>
                    <p className="text-gray-600 mt-2">Berita dan informasi terbaru seputar yayasan</p>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <form onSubmit={handleSearch} className="flex-1 relative">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari berita..."
                            className="form-input pl-10"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </form>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        <button
                            onClick={() => setSearchParams({})}
                            className={`px-4 py-2 rounded-lg whitespace-nowrap ${!currentKategori ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Semua
                        </button>
                        {kategori.map((kat) => (
                            <button
                                key={kat.id_kategori}
                                onClick={() => setSearchParams({ kategori: kat.slug_kategori })}
                                className={`px-4 py-2 rounded-lg whitespace-nowrap ${currentKategori === kat.slug_kategori
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {kat.nama_kategori}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Berita Grid */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="spinner" />
                    </div>
                ) : berita.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        Belum ada berita
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {berita.map((item) => (
                            <Link key={item.id_berita} to={`/berita/${item.slug_berita}`} className="card group">
                                {item.gambar && (
                                    <div className="aspect-video overflow-hidden">
                                        <img
                                            src={getImageUrl(item.gambar)}
                                            alt={item.judul_berita}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                )}
                                <div className="p-5">
                                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                                        <span className="bg-primary-100 text-primary-700 px-2 py-0.5 rounded text-xs font-medium">
                                            {item.nama_kategori}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(item.tanggal_post).toLocaleDateString('id-ID')}
                                        </span>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                                        {item.judul_berita}
                                    </h3>
                                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">{item.ringkasan}</p>
                                    <div className="flex items-center text-sm text-gray-500 mt-3">
                                        <Eye className="w-3 h-3 mr-1" /> {item.hits} views
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
