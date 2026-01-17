import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../lib/store';
import toast from 'react-hot-toast';
import { User, Lock, Eye, EyeOff, LogIn } from 'lucide-react';

export default function Login() {
    const navigate = useNavigate();
    const { login, isLoading } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ username: '', password: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(form.username, form.password);
            toast.success('Login berhasil');
            navigate('/admin');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Login gagal');
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center py-12">
            <div className="w-full max-w-md px-4">
                <div className="card p-8 animate-fade-in">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <User className="w-8 h-8 text-primary-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Login Admin</h1>
                        <p className="text-gray-600 mt-1">Masuk ke panel administrasi</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="form-label">Username</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={form.username}
                                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                                    className="form-input pl-10"
                                    required
                                />
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
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
                            {isLoading ? 'Loading...' : <><LogIn className="w-4 h-4 mr-2" /> Masuk</>}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link to="/signin" className="text-sm text-gray-500 hover:text-gray-700">
                            ← Kembali ke Login Siswa
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
