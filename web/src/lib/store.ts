import { create } from 'zustand';
import { authApi } from './api';

interface User {
    id: number;
    nama: string;
    email: string;
    username?: string;
    level?: string;
    jenis_akun?: string;
    status_akun?: string;
    foto?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    userType: 'admin' | 'siswa' | null;

    login: (username: string, password: string) => Promise<void>;
    signin: (username: string, password: string) => Promise<void>;
    register: (nama: string, email: string, password: string, telepon?: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => void;
    setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: false,
    userType: localStorage.getItem('userType') as 'admin' | 'siswa' | null,

    login: async (username: string, password: string) => {
        set({ isLoading: true });
        try {
            const response = await authApi.login({ username, password });
            const { token, user } = response.data.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('userType', 'admin');

            set({
                user,
                token,
                isAuthenticated: true,
                userType: 'admin',
                isLoading: false,
            });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    signin: async (username: string, password: string) => {
        set({ isLoading: true });
        try {
            const response = await authApi.signin({ username, password });
            const { token, user } = response.data.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('userType', 'siswa');

            set({
                user,
                token,
                isAuthenticated: true,
                userType: 'siswa',
                isLoading: false,
            });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    register: async (nama: string, email: string, password: string, telepon?: string) => {
        set({ isLoading: true });
        try {
            await authApi.register({ nama, email, password, telepon });
            set({ isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userType');
        set({
            user: null,
            token: null,
            isAuthenticated: false,
            userType: null,
        });
    },

    checkAuth: () => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        const userType = localStorage.getItem('userType') as 'admin' | 'siswa' | null;

        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                set({
                    user,
                    token,
                    isAuthenticated: true,
                    userType,
                });
            } catch {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    userType: null,
                });
            }
        }
    },

    setUser: (user: User) => {
        localStorage.setItem('user', JSON.stringify(user));
        set({ user });
    },
}));

// Konfigurasi store
interface Konfigurasi {
    nama_website?: string;
    tagline?: string;
    deskripsi?: string;
    email?: string;
    telepon?: string;
    whatsapp?: string;
    alamat?: string;
    google_map?: string;
    logo?: string;
    favicon?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
    warna_primary?: string;
    warna_secondary?: string;
    poster1?: string;
    poster2?: string;
}

interface KonfigurasiState {
    config: Konfigurasi | null;
    isLoading: boolean;
    fetchConfig: () => Promise<void>;
}

export const useKonfigurasiStore = create<KonfigurasiState>((set) => ({
    config: null,
    isLoading: false,

    fetchConfig: async () => {
        set({ isLoading: true });
        try {
            const response = await fetch('/api/konfigurasi');
            const data = await response.json();
            set({ config: data.data, isLoading: false });
        } catch {
            set({ isLoading: false });
        }
    },
}));
