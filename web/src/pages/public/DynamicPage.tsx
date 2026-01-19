import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { pageApi } from '../../lib/api';
import { Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function DynamicPage() {
    const { slug } = useParams();
    const [page, setPage] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (slug) {
            fetchPage();
        }
    }, [slug]);

    const fetchPage = async () => {
        setLoading(true);
        setError(false);
        try {
            const res = await pageApi.getBySlug(slug!);
            if (res.data.success) {
                setPage(res.data.data);
            } else {
                setError(true);
            }
        } catch (err) {
            console.error(err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="spinner" />
            </div>
        );
    }

    if (error || !page) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-gray-600 mb-8">Halaman tidak ditemukan</p>
                <a href="/" className="btn btn-primary">Kembali ke Beranda</a>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 md:p-12">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-display">
                            {page.nama_menu || page.nama_sub_menu}
                        </h1>

                        <div className="flex items-center gap-6 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {page.tanggal && format(new Date(page.tanggal), 'dd MMMM yyyy', { locale: id })}
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Administrator
                            </div>
                        </div>

                        <div
                            className="prose prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-primary-600 hover:prose-a:text-primary-700"
                            dangerouslySetInnerHTML={{ __html: page.konten || '' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
