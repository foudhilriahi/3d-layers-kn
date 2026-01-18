# 3D LAYERS KN 🇹🇳

Modern e-commerce platform for 3D printed products, built with Next.js 14.

## Features

- 🛒 Shopping cart with localStorage persistence
- 🌐 Multi-language support (French, English, Arabic)
- 📱 Fully responsive design
- 🔒 Secure checkout with validation
- 📧 Email notifications for orders
- 👤 Admin dashboard for order management
- 🗄️ Turso (SQLite) serverless database

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Database:** Turso (libSQL)
- **Language:** TypeScript
- **Deployment:** Netlify

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/3d-layers-kn.git
cd 3d-layers-kn
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env.local` file:
```env
TURSO_DATABASE_URL=your-turso-url
TURSO_AUTH_TOKEN=your-turso-token
ADMIN_PASSWORD=your-secure-password
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### 4. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment

### Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables in Netlify dashboard

## License

MIT
