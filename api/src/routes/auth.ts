import { Hono } from 'hono';
import { sign, hashPassword, verifyPassword, generateCode } from '../lib/jwt';
import { authMiddleware } from '../lib/auth';
import { Env } from '../index';

const auth = new Hono<{ Bindings: Env }>();

// Admin Login
auth.post('/login', async (c) => {
    try {
        const { username, password } = await c.req.json();

        if (!username || !password) {
            return c.json({
                success: false,
                message: 'Username dan password harus diisi',
            }, 400);
        }

        // Check user in database
        const user = await c.env.DB.prepare(
            'SELECT id_user, nama, email, username, password, level, foto, status_user FROM users WHERE username = ? AND status_user = ?'
        ).bind(username, 'Aktif').first();

        if (!user) {
            return c.json({
                success: false,
                message: 'Username atau password salah',
            }, 401);
        }

        // Verify password
        const isValid = await verifyPassword(password, user.password as string);
        if (!isValid) {
            return c.json({
                success: false,
                message: 'Username atau password salah',
            }, 401);
        }

        // Generate JWT token
        const token = await sign({
            id: user.id_user as number,
            username: user.username as string,
            email: user.email as string,
            level: user.level as string,
            type: 'admin',
        }, c.env.JWT_SECRET);

        return c.json({
            success: true,
            message: 'Login berhasil',
            data: {
                token,
                user: {
                    id: user.id_user,
                    nama: user.nama,
                    email: user.email,
                    username: user.username,
                    level: user.level,
                    foto: user.foto,
                },
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        return c.json({
            success: false,
            message: 'Terjadi kesalahan pada server',
        }, 500);
    }
});

// Siswa/Pendaftar Login
auth.post('/signin', async (c) => {
    try {
        const { username, password } = await c.req.json();

        if (!username || !password) {
            return c.json({
                success: false,
                message: 'Email dan password harus diisi',
            }, 400);
        }

        // Check akun in database
        const akun = await c.env.DB.prepare(
            'SELECT id_akun, nama, email, username, password, jenis_akun, status_akun, foto FROM akun WHERE username = ?'
        ).bind(username).first();

        if (!akun) {
            return c.json({
                success: false,
                message: 'Email atau password salah',
            }, 401);
        }

        // Verify password
        const isValid = await verifyPassword(password, akun.password as string);
        if (!isValid) {
            return c.json({
                success: false,
                message: 'Email atau password salah',
            }, 401);
        }

        // Generate JWT token
        const token = await sign({
            id: akun.id_akun as number,
            username: akun.username as string,
            email: akun.email as string,
            level: akun.jenis_akun as string,
            type: 'siswa',
        }, c.env.JWT_SECRET);

        return c.json({
            success: true,
            message: 'Login berhasil',
            data: {
                token,
                user: {
                    id: akun.id_akun,
                    nama: akun.nama,
                    email: akun.email,
                    jenis_akun: akun.jenis_akun,
                    status_akun: akun.status_akun,
                    foto: akun.foto,
                },
            },
        });
    } catch (error) {
        console.error('Signin error:', error);
        return c.json({
            success: false,
            message: 'Terjadi kesalahan pada server',
        }, 500);
    }
});

// Register (Pendaftar)
auth.post('/register', async (c) => {
    try {
        const { nama, email, password, telepon } = await c.req.json();

        if (!nama || !email || !password) {
            return c.json({
                success: false,
                message: 'Nama, email, dan password harus diisi',
            }, 400);
        }

        // Check if email exists
        const existing = await c.env.DB.prepare(
            'SELECT id_akun FROM akun WHERE email = ? OR username = ?'
        ).bind(email, email).first();

        if (existing) {
            return c.json({
                success: false,
                message: 'Email sudah terdaftar',
            }, 400);
        }

        // Hash password
        const hashedPassword = await hashPassword(password);
        const kodeAkun = generateCode(64);

        // Insert new akun
        const result = await c.env.DB.prepare(`
      INSERT INTO akun (nama, email, username, password, password_hint, telepon, jenis_akun, status_akun, kode_akun, link_reset, tanggal_post)
      VALUES (?, ?, ?, ?, ?, ?, 'Pendaftar', 'Menunggu', ?, ?, datetime('now'))
    `).bind(nama, email, email, hashedPassword, password, telepon || '', kodeAkun, kodeAkun).run();

        if (!result.success) {
            throw new Error('Failed to create account');
        }

        return c.json({
            success: true,
            message: 'Registrasi berhasil. Silakan login.',
        });
    } catch (error) {
        console.error('Register error:', error);
        return c.json({
            success: false,
            message: 'Terjadi kesalahan pada server',
        }, 500);
    }
});

// Get current user (requires auth)
auth.get('/me', authMiddleware, async (c) => {
    const user = c.get('user');

    if (user.type === 'admin') {
        const userData = await c.env.DB.prepare(
            'SELECT id_user, nama, email, username, level, foto FROM users WHERE id_user = ?'
        ).bind(user.id).first();

        return c.json({
            success: true,
            data: userData,
        });
    } else {
        const akunData = await c.env.DB.prepare(
            'SELECT id_akun, nama, email, username, jenis_akun, status_akun, foto FROM akun WHERE id_akun = ?'
        ).bind(user.id).first();

        return c.json({
            success: true,
            data: akunData,
        });
    }
});

// Change password
auth.put('/password', authMiddleware, async (c) => {
    try {
        const user = c.get('user');
        const { oldPassword, newPassword } = await c.req.json();

        if (!oldPassword || !newPassword) {
            return c.json({
                success: false,
                message: 'Password lama dan baru harus diisi',
            }, 400);
        }

        const table = user.type === 'admin' ? 'users' : 'akun';
        const idField = user.type === 'admin' ? 'id_user' : 'id_akun';

        // Get current password
        const current = await c.env.DB.prepare(
            `SELECT password FROM ${table} WHERE ${idField} = ?`
        ).bind(user.id).first();

        if (!current) {
            return c.json({
                success: false,
                message: 'User tidak ditemukan',
            }, 404);
        }

        // Verify old password
        const isValid = await verifyPassword(oldPassword, current.password as string);
        if (!isValid) {
            return c.json({
                success: false,
                message: 'Password lama salah',
            }, 400);
        }

        // Update password
        const hashedPassword = await hashPassword(newPassword);
        await c.env.DB.prepare(
            `UPDATE ${table} SET password = ?, tanggal_update = datetime('now') WHERE ${idField} = ?`
        ).bind(hashedPassword, user.id).run();

        return c.json({
            success: true,
            message: 'Password berhasil diubah',
        });
    } catch (error) {
        console.error('Change password error:', error);
        return c.json({
            success: false,
            message: 'Terjadi kesalahan pada server',
        }, 500);
    }
});

// Update profile
auth.put('/profile', authMiddleware, async (c) => {
    try {
        const user = c.get('user') as { id: number; type: string };
        const { nama, email, foto } = await c.req.json();

        if (user.type === 'admin') {
            // Update admin user
            await c.env.DB.prepare(`
                UPDATE users SET 
                    nama = COALESCE(?, nama),
                    email = COALESCE(?, email),
                    foto = COALESCE(?, foto),
                    tanggal_update = datetime('now')
                WHERE id_user = ?
            `).bind(nama || null, email || null, foto || null, user.id).run();

            // Get updated user data
            const updatedUser = await c.env.DB.prepare(
                'SELECT id_user, nama, email, username, level, foto FROM users WHERE id_user = ?'
            ).bind(user.id).first();

            return c.json({
                success: true,
                message: 'Profil berhasil diperbarui',
                data: updatedUser,
            });
        } else {
            // Update siswa/pendaftar account
            await c.env.DB.prepare(`
                UPDATE akun SET 
                    nama = COALESCE(?, nama),
                    email = COALESCE(?, email),
                    foto = COALESCE(?, foto),
                    tanggal_update = datetime('now')
                WHERE id_akun = ?
            `).bind(nama || null, email || null, foto || null, user.id).run();

            const updatedAkun = await c.env.DB.prepare(
                'SELECT id_akun, nama, email, username, jenis_akun, status_akun, foto FROM akun WHERE id_akun = ?'
            ).bind(user.id).first();

            return c.json({
                success: true,
                message: 'Profil berhasil diperbarui',
                data: updatedAkun,
            });
        }
    } catch (error) {
        console.error('Update profile error:', error);
        return c.json({
            success: false,
            message: 'Terjadi kesalahan pada server',
        }, 500);
    }
});

export default auth;
