import { useState, useEffect } from 'react';
import { galeriApi, kategoriApi, getImageUrl } from '../../lib/api';
import { X } from 'lucide-react';

interface GaleriItem {
    id_galeri: number;
    judul_galeri: string;
    gambar: string;
    isi: string;
    id_kategori_galeri: number;
}

interface Kategori {
    id_kategori_galeri: number;
    nama_kategori_galeri: string;
}

export default function Galeri() {
    const [galeri, setGaleri] = useState<GaleriItem[]>([]);
    const [kategori, setKategori] = useState<Kategori[]>([]);
    const [selectedKategori, setSelectedKategori] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<GaleriItem | null>(null);

    useEffect(() => {
        const fetchKategori = async () => {
            try {
                const response = await kategoriApi.getGaleri();
                setKategori(response.data.data || []);
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchKategori();
    }, []);

    useEffect(() => {
        const fetchGaleri = async () => {
            setLoading(true);
            try {
                const params: { limit: number; kategori?: string } = { limit: 50 };
                // Note: API might need slug, but for now we'll filter client-side
                const response = await galeriApi.getAll(params);
                setGaleri(response.data.data || []);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchGaleri();
    }, []);

    // Filter by category client-side
    const filteredGaleri = selectedKategori
        ? galeri.filter(item => item.id_kategori_galeri === selectedKategori)
        : galeri;

    return (
        <div className="py-12 animate-fade-in">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Galeri</h1>
                    <p className="text-gray-600 mt-2">Dokumentasi kegiatan yayasan</p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    <button
                        onClick={() => setSelectedKategori(null)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedKategori === null
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Semua
                    </button>
                    {kategori.map((k) => (
                        <button
                            key={k.id_kategori_galeri}
                            onClick={() => setSelectedKategori(k.id_kategori_galeri)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedKategori === k.id_kategori_galeri
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {k.nama_kategori_galeri}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center py-12"><div className="spinner" /></div>
                ) : filteredGaleri.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p>Tidak ada gambar dalam kategori ini</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredGaleri.map((item) => (
                            <div
                                key={item.id_galeri}
                                onClick={() => setSelectedImage(item)}
                                className="aspect-square rounded-xl overflow-hidden cursor-pointer group"
                            >
                                <img
                                    src={getImageUrl(item.gambar)}
                                    alt={item.judul_galeri}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                        onClick={() => setSelectedImage(null)}
                    >
                        <X className="w-8 h-8" />
                    </button>
                    <img
                        src={getImageUrl(selectedImage.gambar)}
                        alt={selectedImage.judul_galeri}
                        className="max-w-full max-h-[90vh] object-contain rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                    {selectedImage.judul_galeri && (
                        <div className="absolute bottom-8 left-0 right-0 text-center">
                            <p className="text-white text-lg font-medium">{selectedImage.judul_galeri}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
