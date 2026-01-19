import { useState, useEffect } from 'react';
import { Save, Upload } from 'lucide-react';
import { konfiguasiApi, uploadApi, getImageUrl } from '../../lib/api';
import toast from 'react-hot-toast';

interface Konfigurasi {
    id_konfigurasi?: number;
    nama_website: string;
    tagline: string;
    deskripsi: string;
    keywords: string;
    meta_title: string;
    meta_description: string;
    og_image: string;
    email: string;
    telepon: string;
    whatsapp: string;
    alamat: string;
    google_map: string;
    facebook: string;
    twitter: string;
    instagram: string;
    youtube: string;
    linkedin: string;
    logo: string;
    icon: string;
    favicon: string;
    about_us: string;
    // Stats
    stat1_value: string;
    stat1_label: string;
    stat2_value: string;
    stat2_label: string;
    stat3_value: string;
    stat3_label: string;
    stat4_value: string;
    stat4_label: string;
    // Homepage Content
    visi: string;
    misi: string;
    rencana: string;
    program1_title: string;
    program1_desc: string;
    program2_title: string;
    program2_desc: string;
    program3_title: string;
    program3_desc: string;
    program4_title: string;
    program4_desc: string;
    // Theme Colors
    warna_primary: string;
    warna_secondary: string;
    // Poster Pendaftaran
    poster1: string;
    poster2: string;
    // Homepage Toggles
    tampilkan_statistik: string;
    tampilkan_konten: string;
    tampilkan_program: string;
    tampilkan_berita: string;
    tampilkan_galeri: string;
    tampilkan_fasilitas: string;
    kategori_berita: string | null;
}

export default function AdminKonfigurasi() {
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    // const [imageLoading, setImageLoading] = useState<string | null>(null);  // Unused for now
    const [categories, setCategories] = useState<Array<{ id_kategori: number; nama_kategori: string }>>([]);
    const [form, setForm] = useState<Konfigurasi>({
        nama_website: '',
        tagline: '',
        deskripsi: '',
        keywords: '',
        meta_title: '',
        meta_description: '',
        og_image: '',
        email: '',
        telepon: '',
        whatsapp: '',
        alamat: '',
        google_map: '',
        facebook: '',
        twitter: '',
        instagram: '',
        youtube: '',
        linkedin: '',
        logo: '',
        icon: '',
        favicon: '',
        about_us: '',
        // Stats defaults
        stat1_value: '1000+',
        stat1_label: 'Siswa Aktif',
        stat2_value: '50+',
        stat2_label: 'Guru & Staff',
        stat3_value: '20+',
        stat3_label: 'Tahun Pengalaman',
        stat4_value: '100%',
        stat4_label: 'Akreditasi A',
        // Homepage Content defaults
        visi: 'Menjadi lembaga pendidikan unggul yang menghasilkan generasi berakhlak mulia, cerdas, dan kompetitif di tingkat nasional maupun internasional.',
        misi: 'Menyelenggarakan pendidikan berkualitas dengan kurikulum terpadu, membentuk karakter islami, dan mengembangkan potensi siswa secara optimal.',
        rencana: 'Terus mengembangkan fasilitas, meningkatkan kualitas tenaga pendidik, dan memperluas kerjasama dengan institusi pendidikan terkemuka.',
        program1_title: 'Kurikulum Terpadu',
        program1_desc: 'Perpaduan kurikulum nasional dan keagamaan',
        program2_title: 'Ekstrakurikuler',
        program2_desc: 'Berbagai kegiatan pengembangan bakat',
        program3_title: 'Prestasi',
        program3_desc: 'Bimbingan olimpiade dan kompetisi',
        program4_title: 'Karakter Building',
        program4_desc: 'Pembentukan akhlak dan kepribadian',
        // Theme Colors
        warna_primary: '#2563eb',
        warna_secondary: '#16a34a',
        // Poster Pendaftaran
        poster1: '',
        poster2: '',
        // Homepage Toggles
        tampilkan_statistik: 'Ya',
        tampilkan_konten: 'Ya',
        tampilkan_program: 'Ya',
        tampilkan_berita: 'Ya',
        tampilkan_galeri: 'Ya',
        tampilkan_fasilitas: 'Ya',
        kategori_berita: null,
    });


    useEffect(() => {
        fetchData();
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/kategori');
            const data = await res.json();
            if (data.success) {
                setCategories(data.data || []);
            }
        } catch (error) {
            console.error('Failed to load categories:', error);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await konfiguasiApi.get();
            if (res.data.data) {
                setForm({ ...form, ...res.data.data });
            }
        } catch (error) {
            toast.error('Gagal memuat data');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await konfiguasiApi.update(form);
            toast.success('Konfigurasi berhasil disimpan');
        } catch (error) {
            toast.error('Gagal menyimpan konfigurasi');
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof Konfigurasi) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const res = await uploadApi.upload(file, 'config', 'image');
            setForm({ ...form, [field]: res.data.data.key });
            toast.success('File berhasil diupload');
        } catch (error) {
            toast.error('Gagal upload file');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="spinner" />
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Konfigurasi Website</h1>
                    <p className="text-gray-600">Pengaturan informasi website</p>
                </div>
                <button onClick={handleSubmit} className="btn btn-primary" disabled={saving}>
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informasi Umum */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Informasi Umum</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="form-label">Nama Website</label>
                            <input
                                type="text"
                                value={form.nama_website}
                                onChange={(e) => setForm({ ...form, nama_website: e.target.value })}
                                className="form-input"
                            />
                        </div>
                        <div>
                            <label className="form-label">Tagline</label>
                            <input
                                type="text"
                                value={form.tagline}
                                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                                className="form-input"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="form-label">Deskripsi</label>
                            <textarea
                                value={form.deskripsi}
                                onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                                className="form-input"
                                rows={3}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="form-label">Keywords (SEO)</label>
                            <input
                                type="text"
                                value={form.keywords}
                                onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                                className="form-input"
                                placeholder="keyword1, keyword2, keyword3"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="form-label">Meta Title (SEO) - Judul saat share di media sosial</label>
                            <input
                                type="text"
                                value={form.meta_title}
                                onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
                                className="form-input"
                                placeholder="Contoh: Yayasan Media Hikmah - Pendidikan Berkualitas"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="form-label">Meta Description (SEO) - Deskripsi saat share di media sosial</label>
                            <textarea
                                value={form.meta_description}
                                onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
                                className="form-input"
                                rows={2}
                                placeholder="Deskripsi singkat yang muncul di link preview (maks 160 karakter)"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="form-label">Image (SEO) - Thumbnail saat share di media sosial</label>
                            <div className="flex items-start gap-4">
                                {form.og_image && (
                                    <img
                                        src={getImageUrl(form.og_image)}
                                        alt="OG Image"
                                        className="w-40 h-24 object-cover rounded-lg border"
                                    />
                                )}
                                <div className="flex-1">
                                    <label className="btn btn-outline cursor-pointer inline-flex items-center">
                                        <Upload className="w-4 h-4 mr-2" />
                                        {form.og_image ? 'Ganti Image' : 'Upload Image'}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, 'og_image')}
                                            className="hidden"
                                        />
                                    </label>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Rekomendasi: 1200 x 630 pixels (Facebook, LinkedIn)
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistik Homepage */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-900">Statistik Homepage</h2>
                        <button
                            type="button"
                            onClick={() => setForm({ ...form, tampilkan_statistik: form.tampilkan_statistik === 'Ya' ? 'Tidak' : 'Ya' })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.tampilkan_statistik === 'Ya' ? 'bg-green-600' : 'bg-gray-300'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.tampilkan_statistik === 'Ya' ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">Angka-angka yang ditampilkan di halaman depan</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <input
                                type="text"
                                value={form.stat1_value}
                                onChange={(e) => setForm({ ...form, stat1_value: e.target.value })}
                                className="form-input text-center text-xl font-bold"
                                placeholder="1000+"
                            />
                            <input
                                type="text"
                                value={form.stat1_label}
                                onChange={(e) => setForm({ ...form, stat1_label: e.target.value })}
                                className="form-input text-center text-sm"
                                placeholder="Siswa Aktif"
                            />
                        </div>
                        <div className="space-y-2">
                            <input
                                type="text"
                                value={form.stat2_value}
                                onChange={(e) => setForm({ ...form, stat2_value: e.target.value })}
                                className="form-input text-center text-xl font-bold"
                                placeholder="50+"
                            />
                            <input
                                type="text"
                                value={form.stat2_label}
                                onChange={(e) => setForm({ ...form, stat2_label: e.target.value })}
                                className="form-input text-center text-sm"
                                placeholder="Guru & Staff"
                            />
                        </div>
                        <div className="space-y-2">
                            <input
                                type="text"
                                value={form.stat3_value}
                                onChange={(e) => setForm({ ...form, stat3_value: e.target.value })}
                                className="form-input text-center text-xl font-bold"
                                placeholder="20+"
                            />
                            <input
                                type="text"
                                value={form.stat3_label}
                                onChange={(e) => setForm({ ...form, stat3_label: e.target.value })}
                                className="form-input text-center text-sm"
                                placeholder="Tahun Pengalaman"
                            />
                        </div>
                        <div className="space-y-2">
                            <input
                                type="text"
                                value={form.stat4_value}
                                onChange={(e) => setForm({ ...form, stat4_value: e.target.value })}
                                className="form-input text-center text-xl font-bold"
                                placeholder="100%"
                            />
                            <input
                                type="text"
                                value={form.stat4_label}
                                onChange={(e) => setForm({ ...form, stat4_label: e.target.value })}
                                className="form-input text-center text-sm"
                                placeholder="Akreditasi A"
                            />
                        </div>
                    </div>
                </div>

                {/* Konten Homepage */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-900">Konten Homepage</h2>
                        <button
                            type="button"
                            onClick={() => setForm({ ...form, tampilkan_konten: form.tampilkan_konten === 'Ya' ? 'Tidak' : 'Ya' })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.tampilkan_konten === 'Ya' ? 'bg-green-600' : 'bg-gray-300'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.tampilkan_konten === 'Ya' ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">Teks yang ditampilkan di bagian Visi, Misi, Rencana</p>
                    <div className="space-y-4">
                        <div>
                            <label className="form-label">Visi</label>
                            <textarea
                                value={form.visi}
                                onChange={(e) => setForm({ ...form, visi: e.target.value })}
                                className="form-input"
                                rows={3}
                                placeholder="Masukkan visi yayasan..."
                            />
                        </div>
                        <div>
                            <label className="form-label">Misi</label>
                            <textarea
                                value={form.misi}
                                onChange={(e) => setForm({ ...form, misi: e.target.value })}
                                className="form-input"
                                rows={3}
                                placeholder="Masukkan misi yayasan..."
                            />
                        </div>
                        <div>
                            <label className="form-label">Rencana</label>
                            <textarea
                                value={form.rencana}
                                onChange={(e) => setForm({ ...form, rencana: e.target.value })}
                                className="form-input"
                                rows={3}
                                placeholder="Masukkan rencana yayasan..."
                            />
                        </div>
                    </div>
                </div>

                {/* Program Unggulan */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-900">Program Unggulan</h2>
                        <button
                            type="button"
                            onClick={() => setForm({ ...form, tampilkan_program: form.tampilkan_program === 'Ya' ? 'Tidak' : 'Ya' })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.tampilkan_program === 'Ya' ? 'bg-green-600' : 'bg-gray-300'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.tampilkan_program === 'Ya' ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">4 program yang ditampilkan di homepage</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                            <label className="form-label">Program 1</label>
                            <input
                                type="text"
                                value={form.program1_title}
                                onChange={(e) => setForm({ ...form, program1_title: e.target.value })}
                                className="form-input"
                                placeholder="Judul program"
                            />
                            <input
                                type="text"
                                value={form.program1_desc}
                                onChange={(e) => setForm({ ...form, program1_desc: e.target.value })}
                                className="form-input text-sm"
                                placeholder="Deskripsi singkat"
                            />
                        </div>
                        <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                            <label className="form-label">Program 2</label>
                            <input
                                type="text"
                                value={form.program2_title}
                                onChange={(e) => setForm({ ...form, program2_title: e.target.value })}
                                className="form-input"
                                placeholder="Judul program"
                            />
                            <input
                                type="text"
                                value={form.program2_desc}
                                onChange={(e) => setForm({ ...form, program2_desc: e.target.value })}
                                className="form-input text-sm"
                                placeholder="Deskripsi singkat"
                            />
                        </div>
                        <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                            <label className="form-label">Program 3</label>
                            <input
                                type="text"
                                value={form.program3_title}
                                onChange={(e) => setForm({ ...form, program3_title: e.target.value })}
                                className="form-input"
                                placeholder="Judul program"
                            />
                            <input
                                type="text"
                                value={form.program3_desc}
                                onChange={(e) => setForm({ ...form, program3_desc: e.target.value })}
                                className="form-input text-sm"
                                placeholder="Deskripsi singkat"
                            />
                        </div>
                        <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                            <label className="form-label">Program 4</label>
                            <input
                                type="text"
                                value={form.program4_title}
                                onChange={(e) => setForm({ ...form, program4_title: e.target.value })}
                                className="form-input"
                                placeholder="Judul program"
                            />
                            <input
                                type="text"
                                value={form.program4_desc}
                                onChange={(e) => setForm({ ...form, program4_desc: e.target.value })}
                                className="form-input text-sm"
                                placeholder="Deskripsi singkat"
                            />
                        </div>
                    </div>
                </div>

                {/* Pengaturan Tampilan Homepage */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Pengaturan Tampilan Homepage</h2>
                    <p className="text-sm text-gray-500 mb-6">Atur section mana yang ditampilkan di halaman depan</p>

                    <div className="space-y-4">
                        {/* Fasilitas Toggle */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <label className="font-medium text-gray-700">Fasilitas</label>
                                <p className="text-xs text-gray-500 mt-1">Tampilkan section fasilitas di homepage</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setForm({ ...form, tampilkan_fasilitas: form.tampilkan_fasilitas === 'Ya' ? 'Tidak' : 'Ya' })}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.tampilkan_fasilitas === 'Ya' ? 'bg-green-600' : 'bg-gray-300'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.tampilkan_fasilitas === 'Ya' ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>

                        {/* Galeri Toggle */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <label className="font-medium text-gray-700">Galeri</label>
                                <p className="text-xs text-gray-500 mt-1">Tampilkan section galeri di homepage</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setForm({ ...form, tampilkan_galeri: form.tampilkan_galeri === 'Ya' ? 'Tidak' : 'Ya' })}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.tampilkan_galeri === 'Ya' ? 'bg-green-600' : 'bg-gray-300'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.tampilkan_galeri === 'Ya' ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>

                        {/* Berita Toggle + Category Filter */}
                        <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="font-medium text-gray-700">Berita</label>
                                    <p className="text-xs text-gray-500 mt-1">Tampilkan section berita di homepage</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setForm({ ...form, tampilkan_berita: form.tampilkan_berita === 'Ya' ? 'Tidak' : 'Ya' })}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.tampilkan_berita === 'Ya' ? 'bg-green-600' : 'bg-gray-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.tampilkan_berita === 'Ya' ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            {/* Category Filter */}
                            <div className="pl-0">
                                <label className="text-sm font-medium text-gray-700">Kategori Berita yang Ditampilkan</label>
                                <p className="text-xs text-gray-500 mb-3">Kosongkan untuk menampilkan semua kategori</p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {categories.map((cat) => {
                                        const selectedIds = form.kategori_berita ? form.kategori_berita.split(',').map(Number) : [];
                                        const isChecked = selectedIds.includes(cat.id_kategori);

                                        return (
                                            <label key={cat.id_kategori} className="flex items-center space-x-2 p-2 bg-white rounded cursor-pointer hover:bg-gray-100">
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={(e) => {
                                                        let newIds = [...selectedIds];
                                                        if (e.target.checked) {
                                                            newIds.push(cat.id_kategori);
                                                        } else {
                                                            newIds = newIds.filter(id => id !== cat.id_kategori);
                                                        }
                                                        setForm({
                                                            ...form,
                                                            kategori_berita: newIds.length > 0 ? newIds.join(',') : null
                                                        });
                                                    }}
                                                    className="form-checkbox h-4 w-4 text-blue-600"
                                                />
                                                <span className="text-sm text-gray-700">{cat.nama_kategori}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Kontak */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Kontak</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="form-input"
                            />
                        </div>
                        <div>
                            <label className="form-label">Telepon</label>
                            <input
                                type="text"
                                value={form.telepon}
                                onChange={(e) => setForm({ ...form, telepon: e.target.value })}
                                className="form-input"
                            />
                        </div>
                        <div>
                            <label className="form-label">WhatsApp</label>
                            <input
                                type="text"
                                value={form.whatsapp}
                                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                                className="form-input"
                                placeholder="628xxxxxxxxxx"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="form-label">Alamat</label>
                            <textarea
                                value={form.alamat}
                                onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                                className="form-input"
                                rows={2}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="form-label">Google Map Embed URL</label>
                            <input
                                type="text"
                                value={form.google_map}
                                onChange={(e) => setForm({ ...form, google_map: e.target.value })}
                                className="form-input"
                                placeholder="https://www.google.com/maps/embed?..."
                            />
                        </div>
                    </div>
                </div>

                {/* Social Media */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Media Sosial</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="form-label">Facebook</label>
                            <input
                                type="url"
                                value={form.facebook}
                                onChange={(e) => setForm({ ...form, facebook: e.target.value })}
                                className="form-input"
                                placeholder="https://facebook.com/..."
                            />
                        </div>
                        <div>
                            <label className="form-label">Instagram</label>
                            <input
                                type="url"
                                value={form.instagram}
                                onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                                className="form-input"
                                placeholder="https://instagram.com/..."
                            />
                        </div>
                        <div>
                            <label className="form-label">Twitter / X</label>
                            <input
                                type="url"
                                value={form.twitter}
                                onChange={(e) => setForm({ ...form, twitter: e.target.value })}
                                className="form-input"
                                placeholder="https://twitter.com/..."
                            />
                        </div>
                        <div>
                            <label className="form-label">YouTube</label>
                            <input
                                type="url"
                                value={form.youtube}
                                onChange={(e) => setForm({ ...form, youtube: e.target.value })}
                                className="form-input"
                                placeholder="https://youtube.com/..."
                            />
                        </div>
                        <div>
                            <label className="form-label">LinkedIn</label>
                            <input
                                type="url"
                                value={form.linkedin}
                                onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                                className="form-input"
                                placeholder="https://linkedin.com/..."
                            />
                        </div>
                    </div>
                </div>

                {/* Logo & Branding */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Logo & Branding</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="form-label">Logo</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                {form.logo ? (
                                    <img
                                        src={getImageUrl(form.logo)}
                                        alt="Logo"
                                        className="h-16 mx-auto mb-2 object-contain"
                                    />
                                ) : (
                                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, 'logo')}
                                    className="form-input text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="form-label">Icon</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                {form.icon ? (
                                    <img
                                        src={getImageUrl(form.icon)}
                                        alt="Icon"
                                        className="h-16 mx-auto mb-2 object-contain"
                                    />
                                ) : (
                                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, 'icon')}
                                    className="form-input text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="form-label">Favicon</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                {form.favicon ? (
                                    <img
                                        src={getImageUrl(form.favicon)}
                                        alt="Favicon"
                                        className="h-16 mx-auto mb-2 object-contain"
                                    />
                                ) : (
                                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, 'favicon')}
                                    className="form-input text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tema Warna */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Tema Warna</h2>
                    <p className="text-sm text-gray-500 mb-4">Kustomisasi warna tema website</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="form-label">Warna Utama (Primary)</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={form.warna_primary}
                                    onChange={(e) => setForm({ ...form, warna_primary: e.target.value })}
                                    className="w-16 h-12 rounded-lg border border-gray-300 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={form.warna_primary}
                                    onChange={(e) => setForm({ ...form, warna_primary: e.target.value })}
                                    className="form-input flex-1"
                                    placeholder="#2563eb"
                                />
                                <div
                                    className="w-20 h-12 rounded-lg flex items-center justify-center text-white text-sm font-medium"
                                    style={{ backgroundColor: form.warna_primary }}
                                >
                                    Preview
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Digunakan untuk tombol, link, dan elemen aksen utama</p>
                        </div>
                        <div>
                            <label className="form-label">Warna Aksen (Secondary)</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={form.warna_secondary}
                                    onChange={(e) => setForm({ ...form, warna_secondary: e.target.value })}
                                    className="w-16 h-12 rounded-lg border border-gray-300 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={form.warna_secondary}
                                    onChange={(e) => setForm({ ...form, warna_secondary: e.target.value })}
                                    className="form-input flex-1"
                                    placeholder="#16a34a"
                                />
                                <div
                                    className="w-20 h-12 rounded-lg flex items-center justify-center text-white text-sm font-medium"
                                    style={{ backgroundColor: form.warna_secondary }}
                                >
                                    Preview
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Digunakan untuk badge sukses dan elemen sekunder</p>
                        </div>
                    </div>
                </div>

                {/* Poster Brosur Pendaftaran */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Poster Brosur Pendaftaran</h2>
                    <p className="text-sm text-gray-500 mb-4">Gambar poster/brosur yang ditampilkan di halaman pendaftaran</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="form-label">Poster 1</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                {form.poster1 ? (
                                    <img
                                        src={getImageUrl(form.poster1)}
                                        alt="Poster 1"
                                        className="max-h-48 mx-auto mb-2 object-contain rounded-lg"
                                    />
                                ) : (
                                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, 'poster1')}
                                    className="form-input text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="form-label">Poster 2</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                {form.poster2 ? (
                                    <img
                                        src={getImageUrl(form.poster2)}
                                        alt="Poster 2"
                                        className="max-h-48 mx-auto mb-2 object-contain rounded-lg"
                                    />
                                ) : (
                                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, 'poster2')}
                                    className="form-input text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* About */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Tentang Kami</h2>
                    <div>
                        <label className="form-label">Konten Halaman About</label>
                        <textarea
                            value={form.about_us}
                            onChange={(e) => setForm({ ...form, about_us: e.target.value })}
                            className="form-input"
                            rows={6}
                        />
                    </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end">
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </div>
            </form>
        </div>
    );
}

