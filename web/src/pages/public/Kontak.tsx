import { useState } from 'react';
import { useKonfigurasiStore } from '../../lib/store';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Kontak() {
    const { config } = useKonfigurasiStore();
    const [form, setForm] = useState({ nama: '', email: '', pesan: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate sending
        await new Promise(r => setTimeout(r, 1000));
        toast.success('Pesan berhasil dikirim!');
        setForm({ nama: '', email: '', pesan: '' });
        setLoading(false);
    };

    return (
        <div className="py-12 animate-fade-in">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Hubungi Kami</h1>
                    <p className="text-gray-600 mt-2">Silakan hubungi kami untuk informasi lebih lanjut</p>
                </div>

                {/* Google Maps - Below title, above contact info */}
                {config?.google_map && (
                    <div className="mb-10">
                        <div className="rounded-xl overflow-hidden shadow-lg">
                            <iframe
                                src={config.google_map}
                                width="100%"
                                height="350"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Lokasi Sekolah"
                            />
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {/* Contact Info */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Informasi Kontak</h2>
                        <div className="space-y-4">
                            {config?.telepon && (
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-5 h-5 text-primary-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Telepon</p>
                                        <a href={`tel:${config.telepon}`} className="text-gray-600 hover:text-primary-600">{config.telepon}</a>
                                    </div>
                                </div>
                            )}
                            {config?.email && (
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-5 h-5 text-primary-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Email</p>
                                        <a href={`mailto:${config.email}`} className="text-gray-600 hover:text-primary-600">{config.email}</a>
                                    </div>
                                </div>
                            )}
                            {config?.alamat && (
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-5 h-5 text-primary-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Alamat</p>
                                        <p className="text-gray-600">{config.alamat}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Kirim Pesan</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="form-label">Nama</label>
                                <input
                                    type="text"
                                    value={form.nama}
                                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div>
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div>
                                <label className="form-label">Pesan</label>
                                <textarea
                                    value={form.pesan}
                                    onChange={(e) => setForm({ ...form, pesan: e.target.value })}
                                    className="form-input"
                                    rows={4}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                                {loading ? 'Mengirim...' : <>Kirim Pesan <Send className="w-4 h-4 ml-2" /></>}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
