import { useState, useEffect, useRef } from 'react';
import { Camera, Save, Lock, Eye, EyeOff } from 'lucide-react';
import { authApi, uploadApi } from '../../lib/api';
import { useAuthStore } from '../../lib/store';
import toast from 'react-hot-toast';

export default function AdminProfile() {
    const { user, setUser } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [profile, setProfile] = useState({
        nama: '',
        email: '',
        username: '',
        foto: '',
    });

    const [passwordForm, setPasswordForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const res = await authApi.me();
            const data = res.data.data;
            setProfile({
                nama: data.nama || '',
                email: data.email || '',
                username: data.username || '',
                foto: data.foto || '',
            });
        } catch {
            toast.error('Gagal memuat data profil');
        } finally {
            setLoading(false);
        }
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile.nama || !profile.email) {
            toast.error('Nama dan email harus diisi');
            return;
        }
        setSaving(true);
        try {
            const res = await fetch('/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    nama: profile.nama,
                    email: profile.email,
                    foto: profile.foto,
                }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Profil berhasil diperbarui');
                // Update user in store
                if (user) {
                    setUser({ ...user, nama: profile.nama, email: profile.email, foto: profile.foto });
                }
            } else {
                toast.error(data.message || 'Gagal memperbarui profil');
            }
        } catch {
            toast.error('Gagal memperbarui profil');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!passwordForm.oldPassword || !passwordForm.newPassword) {
            toast.error('Password lama dan baru harus diisi');
            return;
        }
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error('Konfirmasi password tidak cocok');
            return;
        }
        if (passwordForm.newPassword.length < 6) {
            toast.error('Password minimal 6 karakter');
            return;
        }
        setSaving(true);
        try {
            await authApi.changePassword({
                oldPassword: passwordForm.oldPassword,
                newPassword: passwordForm.newPassword,
            });
            toast.success('Password berhasil diubah');
            setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
            setShowPasswordForm(false);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast.error(error.response?.data?.message || 'Gagal mengubah password');
        } finally {
            setSaving(false);
        }
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('File harus berupa gambar');
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error('Ukuran file maksimal 2MB');
            return;
        }

        setUploading(true);
        try {
            const res = await uploadApi.upload(file, 'profile', 'image');
            const photoUrl = res.data.url || res.data.data?.url;
            if (photoUrl) {
                setProfile({ ...profile, foto: photoUrl });
                toast.success('Foto berhasil diupload');
            }
        } catch {
            toast.error('Gagal mengupload foto');
        } finally {
            setUploading(false);
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
        <div className="animate-fade-in max-w-2xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Profil Saya</h1>
                <p className="text-gray-600">Kelola informasi profil dan keamanan akun</p>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                <div className="p-6">
                    {/* Photo Section */}
                    <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-100">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
                                {profile.foto ? (
                                    <img src={profile.foto} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-3xl font-bold text-primary-700">
                                        {profile.nama?.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors"
                            >
                                {uploading ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Camera className="w-4 h-4" />
                                )}
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoUpload}
                                className="hidden"
                            />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">{profile.nama}</h2>
                            <p className="text-gray-500">@{profile.username}</p>
                            <p className="text-sm text-gray-400 mt-1">Klik ikon kamera untuk mengubah foto</p>
                        </div>
                    </div>

                    {/* Profile Form */}
                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                        <div>
                            <label className="form-label">Nama Lengkap</label>
                            <input
                                type="text"
                                value={profile.nama}
                                onChange={(e) => setProfile({ ...profile, nama: e.target.value })}
                                className="form-input"
                                required
                            />
                        </div>
                        <div>
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                value={profile.email}
                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                className="form-input"
                                required
                            />
                        </div>
                        <div>
                            <label className="form-label">Username</label>
                            <input
                                type="text"
                                value={profile.username}
                                className="form-input bg-gray-50"
                                disabled
                            />
                            <p className="text-xs text-gray-400 mt-1">Username tidak dapat diubah</p>
                        </div>
                        <div className="pt-4">
                            <button type="submit" className="btn btn-primary" disabled={saving}>
                                <Save className="w-4 h-4 mr-2" />
                                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Password Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Keamanan</h3>
                            <p className="text-gray-500 text-sm">Ubah password akun Anda</p>
                        </div>
                        {!showPasswordForm && (
                            <button
                                onClick={() => setShowPasswordForm(true)}
                                className="btn btn-outline"
                            >
                                <Lock className="w-4 h-4 mr-2" /> Ubah Password
                            </button>
                        )}
                    </div>

                    {showPasswordForm && (
                        <form onSubmit={handlePasswordSubmit} className="space-y-4 pt-4 border-t border-gray-100">
                            <div>
                                <label className="form-label">Password Lama</label>
                                <div className="relative">
                                    <input
                                        type={showOldPassword ? 'text' : 'password'}
                                        value={passwordForm.oldPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                                        className="form-input pr-10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowOldPassword(!showOldPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="form-label">Password Baru</label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? 'text' : 'password'}
                                        value={passwordForm.newPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                        className="form-input pr-10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="form-label">Konfirmasi Password Baru</label>
                                <input
                                    type="password"
                                    value={passwordForm.confirmPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div className="flex gap-2 pt-4">
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? 'Menyimpan...' : 'Ubah Password'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowPasswordForm(false);
                                        setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
                                    }}
                                    className="btn btn-outline"
                                >
                                    Batal
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
