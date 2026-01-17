import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Eye, ArrowLeft, Share2 } from 'lucide-react';
import { beritaApi } from '../../lib/api';

interface BeritaDetail {
    id_berita: number;
    judul_berita: string;
    isi: string;
    gambar: string;
    tanggal_post: string;
    nama_kategori: string;
    nama_penulis: string;
    hits: number;
}

export default function BeritaDetail() {
    const { slug } = useParams<{ slug: string }>();
    const [berita, setBerita] = useState<BeritaDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!slug) return;
            try {
                const response = await beritaApi.getBySlug(slug);
                setBerita(response.data.data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="spinner" />
            </div>
        );
    }

    if (!berita) {
        return (
            <div className="py-20 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Berita tidak ditemukan</h1>
                <Link to="/berita" className="btn btn-primary">
                    Kembali ke Berita
                </Link>
            </div>
        );
    }

    return (
        <article className="py-12 animate-fade-in">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Back Link */}
                <Link to="/berita" className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Kembali ke Berita
                </Link>

                {/* Header */}
                <header className="mb-8">
                    <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                        {berita.nama_kategori}
                    </span>
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-4 mb-4">
                        {berita.judul_berita}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-gray-600">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(berita.tanggal_post).toLocaleDateString('id-ID', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </span>
                        <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {berita.hits} views
                        </span>
                        {berita.nama_penulis && (
                            <span>Oleh: {berita.nama_penulis}</span>
                        )}
                    </div>
                </header>

                {/* Featured Image */}
                {berita.gambar && (
                    <div className="rounded-xl overflow-hidden mb-8">
                        <img
                            src={`/api/upload/${berita.gambar}`}
                            alt={berita.judul_berita}
                            className="w-full h-auto"
                        />
                    </div>
                )}

                {/* Content */}
                <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: berita.isi }}
                />

                {/* Share */}
                <div className="mt-10 pt-8 border-t border-gray-200">
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600">Bagikan:</span>
                        <button
                            onClick={() => navigator.share?.({ title: berita.judul_berita, url: window.location.href })}
                            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            <Share2 className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}
