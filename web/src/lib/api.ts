import axios from 'axios';

// Use Workers API URL in production, empty string for local dev (uses Vite proxy)
export const API_URL = window.location.hostname === 'localhost'
    ? ''
    : 'https://yayasan-api.khibrohstudio.workers.dev';

// Helper function to get correct image URL from R2
export const getImageUrl = (path: string | undefined | null): string => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    if (path.startsWith('/')) return `${API_URL}${path}`;
    return `${API_URL}/api/upload/${path}`;
};

const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;

// Auth API
export const authApi = {
    login: (data: { username: string; password: string }) =>
        api.post('/auth/login', data),
    signin: (data: { username: string; password: string }) =>
        api.post('/auth/signin', data),
    register: (data: { nama: string; email: string; password: string; telepon?: string }) =>
        api.post('/auth/register', data),
    me: () => api.get('/auth/me'),
    changePassword: (data: { oldPassword: string; newPassword: string }) =>
        api.put('/auth/password', data),
};

// Berita API
export const beritaApi = {
    getAll: (params?: { kategori?: string; jenis?: string; limit?: number; offset?: number; search?: string; admin?: boolean }) =>
        api.get('/berita', { params }),
    getBySlug: (slug: string) => api.get(`/berita/${slug}`),
    create: (data: unknown) => api.post('/berita', data),
    update: (id: number, data: unknown) => api.put(`/berita/${id}`, data),
    delete: (id: number) => api.delete(`/berita/${id}`),
};

// Galeri API
export const galeriApi = {
    getAll: (params?: { kategori?: string; jenis?: string; limit?: number; offset?: number }) =>
        api.get('/galeri', { params }),
    getById: (id: number) => api.get(`/galeri/${id}`),
    create: (data: unknown) => api.post('/galeri', data),
    update: (id: number, data: unknown) => api.put(`/galeri/${id}`, data),
    delete: (id: number) => api.delete(`/galeri/${id}`),
};

// Siswa API
export const siswaApi = {
    getAll: (params?: { status?: string; gelombang?: string; limit?: number; offset?: number; search?: string }) =>
        api.get('/siswa', { params }),
    getById: (id: number) => api.get(`/siswa/${id}`),
    updateStatus: (id: number, data: { status_siswa: string; catatan?: string }) =>
        api.put(`/siswa/${id}/status`, data),
    update: (id: number, data: unknown) => api.put(`/siswa/${id}`, data),
    delete: (id: number) => api.delete(`/siswa/${id}`),
};

// Staff API
export const staffApi = {
    getAll: (params?: { kategori?: string; limit?: number; offset?: number }) =>
        api.get('/staff', { params }),
    getBySlug: (slug: string) => api.get(`/staff/${slug}`),
    create: (data: unknown) => api.post('/staff', data),
    update: (id: number, data: unknown) => api.put(`/staff/${id}`, data),
    delete: (id: number) => api.delete(`/staff/${id}`),
};

// Pendaftaran API
export const pendaftaranApi = {
    getGelombang: (status?: string) => api.get('/pendaftaran/gelombang', { params: { status } }),
    getAllGelombang: () => api.get('/pendaftaran/gelombang/all'),
    getJenisDokumen: () => api.get('/pendaftaran/jenis-dokumen'),
    getJenjang: () => api.get('/pendaftaran/jenjang'),
    getAllJenjang: () => api.get('/pendaftaran/jenjang/all'),
    daftar: (data: unknown) => api.post('/pendaftaran/daftar', data),
    uploadDokumen: (data: unknown) => api.post('/pendaftaran/dokumen', data),
    getStatus: () => api.get('/pendaftaran/status'),
    updateDokumenStatus: (id: number, status: string) =>
        api.put(`/pendaftaran/dokumen/${id}/status`, { status_dokumen: status }),
    editPendaftaran: (id: number, data: { id_gelombang?: number; id_jenjang?: number }) =>
        api.put(`/pendaftaran/edit/${id}`, data),
};

// Kategori API
export const kategoriApi = {
    getBerita: () => api.get('/kategori/berita'),
    getGaleri: () => api.get('/kategori/galeri'),
    getStaff: () => api.get('/kategori/staff'),
    getAgama: () => api.get('/kategori/agama'),
    getJenjang: () => api.get('/kategori/jenjang'),
    getHubungan: () => api.get('/kategori/hubungan'),
    getPekerjaan: () => api.get('/kategori/pekerjaan'),
};

// Gelombang API
export const gelombangApi = {
    getAll: () => api.get('/gelombang'),
    getById: (id: number) => api.get(`/gelombang/${id}`),
    create: (data: unknown) => api.post('/gelombang', data),
    update: (id: number, data: unknown) => api.put(`/gelombang/${id}`, data),
    delete: (id: number) => api.delete(`/gelombang/${id}`),
};

// Jenjang Pendidikan API
export const jenjangPendidikanApi = {
    getAll: () => api.get('/jenjang-pendidikan'),
    getJenjangMaster: () => api.get('/jenjang-pendidikan/jenjang'),
    getById: (id: number) => api.get(`/jenjang-pendidikan/${id}`),
    create: (data: unknown) => api.post('/jenjang-pendidikan', data),
    update: (id: number, data: unknown) => api.put(`/jenjang-pendidikan/${id}`, data),
    delete: (id: number) => api.delete(`/jenjang-pendidikan/${id}`),
};

// Konfigurasi API
export const konfiguasiApi = {
    get: () => api.get('/konfigurasi'),
    update: (data: unknown) => api.put('/konfigurasi', data),
    getMenu: () => api.get('/konfigurasi/menu'),
    getLinks: () => api.get('/konfigurasi/links'),
    getVideo: (params?: { limit?: number; offset?: number }) =>
        api.get('/konfigurasi/video', { params }),
    getDownload: (params?: { kategori?: string; limit?: number; offset?: number }) =>
        api.get('/konfigurasi/download', { params }),
    getEkstrakurikuler: () => api.get('/konfigurasi/ekstrakurikuler'),
    getFasilitas: () => api.get('/konfigurasi/fasilitas'),
    getPrestasi: () => api.get('/konfigurasi/prestasi'),
    getClient: () => api.get('/konfigurasi/client'),
    getSlider: () => api.get('/konfigurasi/slider'),
};

// Upload API
export const uploadApi = {
    upload: (file: File, folder: string = 'uploads', type: string = 'image') => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);
        formData.append('type', type);
        return api.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    delete: (path: string) => api.delete(`/upload/${path}`),
};

// Menu API
export const menuApi = {
    getAll: () => api.get('/menu'),
    getAllAdmin: () => api.get('/menu/admin'),
    create: (data: unknown) => api.post('/menu', data),
    update: (id: number, data: unknown) => api.put(`/menu/${id}`, data),
    delete: (id: number) => api.delete(`/menu/${id}`),
};

// Submenu API
export const submenuApi = {
    create: (data: unknown) => api.post('/submenu', data),
    update: (id: number, data: unknown) => api.put(`/submenu/${id}`, data),
    delete: (id: number) => api.delete(`/submenu/${id}`),
};

// Page API
export const pageApi = {
    getBySlug: (slug: string) => api.get(`/page/${slug}`),
};

