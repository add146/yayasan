import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { API_URL } from '../../lib/api';

interface Halaman {
    id_halaman: number;
    judul: string;
    slug: string;
    konten: string;
}

export default function HalamanDetail() {
    const { slug } = useParams<{ slug: string }>();
    const [halaman, setHalaman] = useState<Halaman | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_URL}/api/halaman/${slug}`);
                const data = await res.json();
                if (data.success && data.data) {
                    setHalaman(data.data);
                } else {
                    setNotFound(true);
                }
            } catch (error) {
                console.error('Error:', error);
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };
        if (slug) fetchData();
    }, [slug]);

    if (loading) {
        return (
            <div className="py-24 flex justify-center">
                <div className="spinner" />
            </div>
        );
    }

    if (notFound || !halaman) {
        return (
            <div className="py-24 text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Halaman Tidak Ditemukan</h1>
                <p className="text-gray-600 mb-6">Maaf, halaman yang Anda cari tidak tersedia.</p>
                <Link to="/" className="btn btn-primary">Kembali ke Beranda</Link>
            </div>
        );
    }

    return (
        <div className="py-12 animate-fade-in">
            <div className="container mx-auto px-4">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <Link to="/" className="hover:text-primary-600">Beranda</Link>
                    <ChevronRight className="w-4 h-4" />
                    <span>{halaman.judul}</span>
                </nav>

                {/* Title */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">{halaman.judul}</h1>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    <div
                        className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-primary-600"
                        dangerouslySetInnerHTML={{ __html: halaman.konten }}
                    />
                </div>
            </div>
        </div>
    );
}
