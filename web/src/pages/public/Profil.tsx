import { useState, useEffect } from 'react';
import { staffApi, konfiguasiApi } from '../../lib/api';
import {
    Building, School, BookOpen, Monitor, Palette, Music, Trophy, Dumbbell,
    FlaskConical, Microscope, Calculator, PenTool, Theater, Target, Car, Bus,
    Heart, Bed, UtensilsCrossed, Coffee, Bath, TreePine, Flower2, Church,
    Landmark, Tv, Wifi, Speaker, Lightbulb, Snowflake, Thermometer, Droplets,
    Plug, ShoppingCart, GraduationCap, Star, Home, Users, Library, Briefcase,
    Printer, Camera, Video, Gamepad2, Bike, Medal, LucideIcon
} from 'lucide-react';

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
    'school': School, 'building': Building, 'book-open': BookOpen, 'monitor': Monitor,
    'palette': Palette, 'music': Music, 'trophy': Trophy, 'dumbbell': Dumbbell,
    'flask': FlaskConical, 'microscope': Microscope, 'calculator': Calculator,
    'pen-tool': PenTool, 'theater': Theater, 'target': Target, 'car': Car, 'bus': Bus,
    'heart': Heart, 'bed': Bed, 'utensils': UtensilsCrossed, 'coffee': Coffee,
    'bath': Bath, 'tree': TreePine, 'flower': Flower2, 'church': Church,
    'landmark': Landmark, 'tv': Tv, 'wifi': Wifi, 'speaker': Speaker,
    'lightbulb': Lightbulb, 'snowflake': Snowflake, 'thermometer': Thermometer,
    'droplets': Droplets, 'plug': Plug, 'cart': ShoppingCart, 'graduation': GraduationCap,
    'star': Star, 'home': Home, 'users': Users, 'library': Library, 'briefcase': Briefcase,
    'printer': Printer, 'camera': Camera, 'video': Video, 'gamepad': Gamepad2,
    'bike': Bike, 'medal': Medal,
};

const getIcon = (name: string) => iconMap[name] || Building;

export default function Profil() {
    const [staff, setStaff] = useState([]);
    const [fasilitas, setFasilitas] = useState([]);
    const [prestasi, setPrestasi] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [staffRes, fasilitasRes, prestasiRes] = await Promise.all([
                    staffApi.getAll({ limit: 8 }),
                    konfiguasiApi.getFasilitas(),
                    konfiguasiApi.getPrestasi(),
                ]);
                setStaff(staffRes.data.data || []);
                setFasilitas(fasilitasRes.data.data || []);
                setPrestasi(prestasiRes.data.data || []);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="flex justify-center py-20"><div className="spinner" /></div>;
    }

    return (
        <div className="py-12 animate-fade-in">
            {/* About Section */}
            <section className="container mx-auto px-4 mb-16">
                <div className="text-center mb-10">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Profil Sekolah</h1>
                    <p className="text-gray-600 mt-2">Mengenal lebih dekat tentang kami</p>
                </div>
                <div className="prose prose-lg max-w-4xl mx-auto text-center">
                    <p>
                        Kami adalah lembaga pendidikan yang berkomitmen untuk mencetak generasi unggul,
                        berakhlak mulia, dan siap menghadapi tantangan masa depan dengan kurikulum terpadu
                        dan fasilitas modern.
                    </p>
                </div>
            </section>

            {/* Fasilitas Section */}
            <section className="bg-gray-50 py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Fasilitas</h2>
                    {fasilitas.length === 0 ? (
                        <p className="text-center text-gray-500">Belum ada data fasilitas</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {fasilitas.map((item: any) => {
                                const IconComponent = getIcon(item.gambar);
                                return (
                                    <div key={item.id_fasilitas} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                        <div className="flex items-start gap-4">
                                            <div className="w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                                                <IconComponent className="w-7 h-7 text-primary-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 mb-1">{item.judul_fasilitas}</h3>
                                                {item.isi && (
                                                    <p className="text-sm text-gray-600">{item.isi}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Staff Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Staff & Pengajar</h2>
                    {staff.length === 0 ? (
                        <p className="text-center text-gray-500">Belum ada data staff</p>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {staff.map((item: any) => (
                                <div key={item.id_staff} className="text-center">
                                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-gray-200 mb-3">
                                        {item.gambar ? (
                                            <img src={`/api/upload/${item.gambar}`} alt={item.nama_staff} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-3xl text-gray-400">
                                                {item.nama_staff?.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="font-semibold text-gray-900">{item.nama_staff}</h3>
                                    <p className="text-sm text-gray-600">{item.jabatan}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Prestasi Section */}
            <section className="bg-primary-50 py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Prestasi</h2>
                    {prestasi.length === 0 ? (
                        <p className="text-center text-gray-500">Belum ada data prestasi</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {prestasi.map((item: any) => (
                                <div key={item.id_prestasi} className="bg-white rounded-xl p-5 shadow-sm flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                                        <Trophy className="w-6 h-6 text-yellow-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{item.judul_prestasi}</h3>
                                        <p className="text-sm text-primary-600">{item.tingkat_prestasi} - {item.tahun_prestasi}</p>
                                        {item.isi && (
                                            <p className="text-sm text-gray-600 mt-1">{item.isi}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
