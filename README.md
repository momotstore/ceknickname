# API-XSTBOT

API untuk cek ID game dari berbagai platform game populer seperti Free Fire, Mobile Legends, PUBG Mobile, dan lainnya. API ini menyediakan layanan pengecekan ID game yang dapat digunakan untuk berbagai keperluan seperti verifikasi akun atau integrasi dengan bot WhatsApp.

## Fitur

- Mendukung berbagai game populer
- Endpoint RESTful yang mudah digunakan
- Rate limiting untuk mencegah abuse
- Keamanan tingkat lanjut dengan Helmet.js
- Penanganan error yang robust

## Instalasi

```bash
npm install
```

## Menjalankan Aplikasi

```bash
# Production
npm start

# Development
npm run start:dev
```

## Struktur Proyek

```
├── controllers/          # Logic untuk menangani request
├── routes/              # Definisi routing
├── services/            # Service untuk integrasi dengan provider game
├── utils/               # Fungsi-fungsi utilitas
│   └── data/            # Data konfigurasi game
├── public/              # File statis dan dokumentasi
├── update-list-game/    # Skrip untuk memperbarui daftar game
├── config.js            # Konfigurasi aplikasi
└── index.js             # Entry point aplikasi
```

## Endpoint

### Cek ID Game
```
GET /api/game/:game?id=[id]&zone=[zone]
```

### Dapatkan Daftar Zona
```
GET /api/game/get-zone/:game
```

### Daftar Semua Game
```
GET /endpoint
```

## Kontribusi

Silakan buat pull request untuk kontribusi pengembangan API ini.