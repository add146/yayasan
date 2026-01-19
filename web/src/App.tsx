import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './lib/store';

// Layouts
import PublicLayout from './components/layouts/PublicLayout';
import AdminLayout from './components/layouts/AdminLayout';

// Public Pages
import Home from './pages/public/Home';
import Berita from './pages/public/Berita';
import BeritaDetail from './pages/public/BeritaDetail';
import Galeri from './pages/public/Galeri';
import Profil from './pages/public/Profil';
import HalamanDetail from './pages/public/HalamanDetail';
import DynamicPage from './pages/public/DynamicPage';
import Kontak from './pages/public/Kontak';
import Pendaftaran from './pages/public/Pendaftaran';
import Login from './pages/public/Login';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import AdminBerita from './pages/admin/Berita';
import AdminGaleri from './pages/admin/Galeri';
import AdminSiswa from './pages/admin/Siswa';
import AdminStaff from './pages/admin/Staff';
import AdminPendaftar from './pages/admin/Pendaftar';
import AdminKonfigurasi from './pages/admin/Konfigurasi';
import AdminFasilitas from './pages/admin/Fasilitas';
import AdminPrestasi from './pages/admin/Prestasi';
import AdminSlider from './pages/admin/Slider';
import AdminGelombang from './pages/admin/Gelombang';
import AdminJenjangPendidikan from './pages/admin/JenjangPendidikan';
import AdminProfile from './pages/admin/Profile';
import AdminMenu from './pages/admin/Menu';
import AdminPesan from './pages/admin/Pesan';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './components/NotFound';

function App() {
    const { checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/berita" element={<Berita />} />
                <Route path="/berita/:slug" element={<BeritaDetail />} />
                <Route path="/galeri" element={<Galeri />} />
                <Route path="/profil" element={<Profil />} />
                <Route path="/halaman/:slug" element={<HalamanDetail />} />
                <Route path="/p/:slug" element={<DynamicPage />} />
                <Route path="/kontak" element={<Kontak />} />
                <Route path="/pendaftaran" element={<Pendaftaran />} />
                <Route path="/login" element={<Login />} />
            </Route>

            {/* Admin Routes */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute requiredType="admin">
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Dashboard />} />
                <Route path="berita" element={<AdminBerita />} />
                <Route path="galeri" element={<AdminGaleri />} />
                <Route path="siswa" element={<AdminSiswa />} />
                <Route path="staff" element={<AdminStaff />} />
                <Route path="pendaftar" element={<AdminPendaftar />} />
                <Route path="konfigurasi" element={<AdminKonfigurasi />} />
                <Route path="fasilitas" element={<AdminFasilitas />} />
                <Route path="prestasi" element={<AdminPrestasi />} />
                <Route path="slider" element={<AdminSlider />} />
                <Route path="gelombang" element={<AdminGelombang />} />
                <Route path="program" element={<AdminJenjangPendidikan />} />
                <Route path="profile" element={<AdminProfile />} />
                <Route path="menu" element={<AdminMenu />} />
                <Route path="pesan" element={<AdminPesan />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default App;
