# Yayasan - Cloudflare Stack

Website Profil dan Manajemen Yayasan yang di-deploy ke Cloudflare Stack.

## Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React + Vite + TailwindCSS |
| **Backend API** | Hono + Cloudflare Workers |
| **Database** | Cloudflare D1 (SQLite) |
| **File Storage** | Cloudflare R2 |
| **Hosting** | Cloudflare Pages + Workers |

## Project Structure

```
cloudflare/
├── api/                    # Cloudflare Workers API
│   ├── src/
│   │   ├── index.ts       # Main entry point
│   │   ├── routes/        # API route handlers
│   │   ├── lib/           # Utilities (JWT, R2, auth)
│   │   └── middleware/    # Auth middleware
│   ├── wrangler.toml      # Workers config
│   └── package.json
├── web/                    # React Frontend
│   ├── src/
│   │   ├── App.tsx        # Main app with routing
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   └── lib/           # API client, stores
│   ├── vite.config.ts
│   └── package.json
├── database/
│   ├── schema.sql         # D1 database schema
│   └── seed.sql           # Initial data
└── scripts/               # Helper scripts
```

## Getting Started

### Prerequisites

- Node.js 18+
- Cloudflare account with Workers, D1, R2, and Pages access
- Wrangler CLI: `npm install -g wrangler`

### 1. Setup API (Cloudflare Workers)

```bash
cd cloudflare/api
npm install

# Login to Cloudflare
wrangler login

# Create D1 database
wrangler d1 create yayasan-db
# Update the database_id in wrangler.toml with the returned ID

# Create R2 bucket
wrangler r2 bucket create yayasan-files

# Apply database schema
wrangler d1 execute yayasan-db --file=../database/schema.sql

# Apply seed data
wrangler d1 execute yayasan-db --file=../database/seed.sql

# Run locally
npm run dev
```

### 2. Setup Frontend

```bash
cd cloudflare/web
npm install
npm run dev
```

### 3. Deploy

```bash
# Deploy API to Workers
cd cloudflare/api
npm run deploy

# Deploy Frontend to Pages
cd cloudflare/web
npm run build
# Then deploy via Cloudflare Dashboard or wrangler pages deploy dist
```

## Default Admin Credentials

- **Username:** `admin`
- **Password:** `admin123`

⚠️ **Important:** Change these credentials after first login!

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `POST /api/auth/login` | Admin login |
| `POST /api/auth/signin` | Student login |
| `POST /api/auth/register` | Student registration |
| `GET /api/berita` | Get all news |
| `GET /api/galeri` | Get gallery |
| `GET /api/staff` | Get staff list |
| `GET /api/konfigurasi` | Get website config |
| `POST /api/pendaftaran/daftar` | Submit PPDB registration |
| `POST /api/upload` | Upload file to R2 |

## Environment Variables

### API (wrangler.toml)

```toml
[vars]
JWT_SECRET = "your-secret-key-change-in-production"
```

### Frontend (.env)

```
VITE_API_URL=https://your-api.workers.dev
```

## License

MIT
