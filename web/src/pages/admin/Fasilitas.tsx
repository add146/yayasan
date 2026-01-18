import { useState, useEffect } from 'react';
import {
    Plus, Edit2, Trash2, X, Building, School, BookOpen, Monitor, Palette,
    Music, Trophy, Dumbbell, FlaskConical, Microscope, Calculator, PenTool,
    Theater, Target, Car, Bus, Heart, Bed, UtensilsCrossed, Coffee,
    Bath, TreePine, Flower2, Church, Landmark, Tv, Wifi, Speaker,
    Lightbulb, Snowflake, Thermometer, Droplets, Plug, ShoppingCart,
    GraduationCap, Star, Home, Users, Library, Briefcase, Printer,
    Camera, Video, Gamepad2, Bike, Medal,
    LucideIcon
} from 'lucide-react';
import { konfiguasiApi } from '../../lib/api';
import toast from 'react-hot-toast';

// Available icons with names
const facilityIcons: { name: string; icon: LucideIcon; label: string }[] = [
    { name: 'school', icon: School, label: 'Yayasan' },
    { name: 'building', icon: Building, label: 'Gedung' },
    { name: 'book-open', icon: BookOpen, label: 'Perpustakaan' },
    { name: 'monitor', icon: Monitor, label: 'Lab Komputer' },
    { name: 'palette', icon: Palette, label: 'Seni' },
    { name: 'music', icon: Music, label: 'Musik' },
    { name: 'trophy', icon: Trophy, label: 'Piala' },
    { name: 'dumbbell', icon: Dumbbell, label: 'Gym' },
    { name: 'flask', icon: FlaskConical, label: 'Laboratorium' },
    { name: 'microscope', icon: Microscope, label: 'Sains' },
    { name: 'calculator', icon: Calculator, label: 'Matematika' },
    { name: 'pen-tool', icon: PenTool, label: 'Menggambar' },
    { name: 'theater', icon: Theater, label: 'Teater' },
    { name: 'target', icon: Target, label: 'Target' },
    { name: 'car', icon: Car, label: 'Parkir' },
    { name: 'bus', icon: Bus, label: 'Bus' },
    { name: 'heart', icon: Heart, label: 'UKS' },
    { name: 'bed', icon: Bed, label: 'Asrama' },
    { name: 'utensils', icon: UtensilsCrossed, label: 'Kantin' },
    { name: 'coffee', icon: Coffee, label: 'Kafe' },
    { name: 'bath', icon: Bath, label: 'Kamar Mandi' },
    { name: 'tree', icon: TreePine, label: 'Taman' },
    { name: 'flower', icon: Flower2, label: 'Taman Bunga' },
    { name: 'church', icon: Church, label: 'Mushola' },
    { name: 'landmark', icon: Landmark, label: 'Aula' },
    { name: 'tv', icon: Tv, label: 'Audio Visual' },
    { name: 'wifi', icon: Wifi, label: 'Wifi' },
    { name: 'speaker', icon: Speaker, label: 'Audio' },
    { name: 'lightbulb', icon: Lightbulb, label: 'Lampu' },
    { name: 'snowflake', icon: Snowflake, label: 'AC' },
    { name: 'thermometer', icon: Thermometer, label: 'Suhu' },
    { name: 'droplets', icon: Droplets, label: 'Air' },
    { name: 'plug', icon: Plug, label: 'Listrik' },
    { name: 'cart', icon: ShoppingCart, label: 'Koperasi' },
    { name: 'graduation', icon: GraduationCap, label: 'Wisuda' },
    { name: 'star', icon: Star, label: 'Prestasi' },
    { name: 'home', icon: Home, label: 'Rumah' },
    { name: 'users', icon: Users, label: 'Ruang Rapat' },
    { name: 'library', icon: Library, label: 'Library' },
    { name: 'briefcase', icon: Briefcase, label: 'Kantor' },
    { name: 'printer', icon: Printer, label: 'Printer' },
    { name: 'camera', icon: Camera, label: 'Foto' },
    { name: 'video', icon: Video, label: 'Video' },
    { name: 'gamepad', icon: Gamepad2, label: 'Game' },
    { name: 'bike', icon: Bike, label: 'Sepeda' },
    { name: 'medal', icon: Medal, label: 'Olahraga' },
];

interface Fasilitas {
    id_fasilitas: number;
    judul_fasilitas: string;
    isi: string;
    gambar: string;
    status_fasilitas: string;
}

const getIconComponent = (iconName: string) => {
    const found = facilityIcons.find(i => i.name === iconName);
    return found ? found.icon : Building;
};

export default function AdminFasilitas() {
    const [fasilitas, setFasilitas] = useState<Fasilitas[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showIconPicker, setShowIconPicker] = useState(false);
    const [editingItem, setEditingItem] = useState<Fasilitas | null>(null);
    const [form, setForm] = useState({
        judul_fasilitas: '',
        isi_fasilitas: '',
        icon: 'school',
        status_fasilitas: 'Publish',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await konfiguasiApi.getFasilitas();
            setFasilitas(res.data.data || []);
        } catch (error) {
            toast.error('Gagal memuat data');
        } finally {
            setLoading(false);
        }
    };

    const openModal = (item?: Fasilitas) => {
        if (item) {
            setEditingItem(item);
            setForm({
                judul_fasilitas: item.judul_fasilitas,
                isi_fasilitas: item.isi || '',
                icon: item.gambar || 'school',
                status_fasilitas: item.status_fasilitas || 'Publish',
            });
        } else {
            setEditingItem(null);
            setForm({
                judul_fasilitas: '',
                isi_fasilitas: '',
                icon: 'school',
                status_fasilitas: 'Publish',
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingItem(null);
        setShowIconPicker(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const endpoint = editingItem
                ? `/api/konfigurasi/fasilitas/${editingItem.id_fasilitas}`
                : '/api/konfigurasi/fasilitas';
            const method = editingItem ? 'PUT' : 'POST';

            const token = localStorage.getItem('token');
            const res = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error('Failed');
            toast.success(editingItem ? 'Fasilitas berhasil diperbarui' : 'Fasilitas berhasil ditambahkan');
            closeModal();
            fetchData();
        } catch (error) {
            toast.error('Terjadi kesalahan');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Yakin ingin menghapus fasilitas ini?')) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/konfigurasi/fasilitas/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            toast.success('Fasilitas berhasil dihapus');
            fetchData();
        } catch (error) {
            toast.error('Gagal menghapus fasilitas');
        }
    };

    const IconDisplay = getIconComponent(form.icon);

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Kelola Fasilitas</h1>
                    <p className="text-gray-600">Manajemen fasilitas yayasan</p>
                </div>
                <button onClick={() => openModal()} className="btn btn-primary">
                    <Plus className="w-4 h-4 mr-2" /> Tambah Fasilitas
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                    <div className="col-span-3 flex justify-center py-12"><div className="spinner" /></div>
                ) : fasilitas.length === 0 ? (
                    <div className="col-span-3 text-center py-12 text-gray-500 bg-white rounded-xl">
                        <Building className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>Belum ada data fasilitas</p>
                    </div>
                ) : (
                    fasilitas.map((item) => {
                        const ItemIcon = getIconComponent(item.gambar);
                        return (
                            <div key={item.id_fasilitas} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center">
                                        <ItemIcon className="w-7 h-7 text-primary-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">{item.judul_fasilitas}</h3>
                                        {item.isi && (
                                            <p className="text-sm text-gray-500 line-clamp-2 mt-1">{item.isi}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                                    <button onClick={() => openModal(item)} className="flex-1 btn btn-outline text-sm py-1.5">
                                        <Edit2 className="w-3 h-3 mr-1" /> Edit
                                    </button>
                                    <button onClick={() => handleDelete(item.id_fasilitas)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
                            <h2 className="text-lg font-bold">{editingItem ? 'Edit Fasilitas' : 'Tambah Fasilitas'}</h2>
                            <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <label className="form-label">Nama Fasilitas *</label>
                                <input
                                    type="text"
                                    value={form.judul_fasilitas}
                                    onChange={(e) => setForm({ ...form, judul_fasilitas: e.target.value })}
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div>
                                <label className="form-label">Icon</label>
                                <button
                                    type="button"
                                    onClick={() => setShowIconPicker(!showIconPicker)}
                                    className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                                        <IconDisplay className="w-5 h-5 text-primary-600" />
                                    </div>
                                    <span className="text-gray-600">Klik untuk pilih icon</span>
                                </button>

                                {showIconPicker && (
                                    <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                                        <div className="grid grid-cols-8 gap-2">
                                            {facilityIcons.map((item) => (
                                                <button
                                                    key={item.name}
                                                    type="button"
                                                    onClick={() => {
                                                        setForm({ ...form, icon: item.name });
                                                        setShowIconPicker(false);
                                                    }}
                                                    title={item.label}
                                                    className={`p-2 rounded-lg hover:bg-primary-50 transition-colors ${form.icon === item.name ? 'bg-primary-100 ring-2 ring-primary-500' : 'bg-white'
                                                        }`}
                                                >
                                                    <item.icon className={`w-5 h-5 ${form.icon === item.name ? 'text-primary-600' : 'text-gray-600'}`} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="form-label">Deskripsi</label>
                                <textarea
                                    value={form.isi_fasilitas}
                                    onChange={(e) => setForm({ ...form, isi_fasilitas: e.target.value })}
                                    className="form-input"
                                    rows={3}
                                    placeholder="Deskripsi singkat tentang fasilitas..."
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button type="button" onClick={closeModal} className="btn btn-outline">Batal</button>
                                <button type="submit" className="btn btn-primary">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
