import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="text-center animate-fade-in">
                <h1 className="text-9xl font-bold text-primary-600">404</h1>
                <h2 className="text-2xl font-semibold text-gray-800 mt-4">Halaman Tidak Ditemukan</h2>
                <p className="text-gray-600 mt-2 mb-8">
                    Maaf, halaman yang Anda cari tidak tersedia.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link
                        to="/"
                        className="btn btn-primary"
                    >
                        <Home className="w-4 h-4 mr-2" />
                        Beranda
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="btn btn-outline"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Kembali
                    </button>
                </div>
            </div>
        </div>
    );
}
