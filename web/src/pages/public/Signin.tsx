import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../lib/store';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';

export default function Signin() {
    const navigate = useNavigate();
    const { signin, register, isLoading } = useAuthStore();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ nama: '', email: '', password: '', telepon: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isLogin) {
                await signin(form.email, form.password);
                toast.success('Login berhasil');
                navigate('/');
            } else {
                await register(form.nama, form.email, form.password, form.telepon);
                toast.success('Registrasi berhasil! Silakan login.');
                setIsLogin(true);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Terjadi kesalahan');
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center py-12">
            <div className="w-full max-w-md px-4">
                <div className="card p-8 animate-fade-in">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {isLogin ? 'Login Siswa' : 'Daftar Akun'}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {isLogin ? 'Masuk ke akun Anda' : 'Buat akun baru untuk mendaftar'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <>
                                <div>
                                    <label className="form-label">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        value={form.nama}
                                        onChange={(e) => setForm({ ...form, nama: e.target.value })}
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="form-label">No. Telepon</label>
                                    <input
                                        type="tel"
                                        value={form.telepon}
                                        onChange={(e) => setForm({ ...form, telepon: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                            </>
                        )}

                        <div>
                            <label className="form-label">Email</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className="form-input pl-10"
                                    required
                                />
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        <div>
                            <label className="form-label">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    className="form-input pl-10 pr-10"
                                    required
                                />
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary w-full mt-6" disabled={isLoading}>
                            {isLoading ? 'Loading...' : (
                                <><LogIn className="w-4 h-4 mr-2" /> {isLogin ? 'Masuk' : 'Daftar'}</>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        {isLogin ? (
                            <p className="text-gray-600">
                                Belum punya akun?{' '}
                                <button onClick={() => setIsLogin(false)} className="text-primary-600 hover:underline font-medium">
                                    Daftar di sini
                                </button>
                            </p>
                        ) : (
                            <p className="text-gray-600">
                                Sudah punya akun?{' '}
                                <button onClick={() => setIsLogin(true)} className="text-primary-600 hover:underline font-medium">
                                    Login di sini
                                </button>
                            </p>
                        )}
                        <Link to="/login" className="block mt-2 text-gray-500 hover:text-gray-700">
                            Login sebagai Admin →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
