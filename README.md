# Vue 3 Admin Starter Kit

Starter kit Vue 3 dengan Dashboard dan User Management yang siap pakai. Template ini menggunakan Vue 3, TypeScript, Bootstrap 5, dan berbagai komponen UI modern.

## 🚀 Fitur Utama

- ✅ **Dashboard** - Dashboard modern dengan berbagai widget dan charts
- ✅ **User Management** - Halaman untuk mengelola user/customer
- ✅ **Authentication** - Sistem login, register, dan password reset
- ✅ **Layout Builder** - Konfigurasi layout aplikasi
- ✅ **Account Management** - Halaman profil dan pengaturan akun
- ✅ **Responsive Design** - Mendukung desktop, tablet, dan mobile
- ✅ **TypeScript** - Type safety dan better development experience
- ✅ **Modern UI** - Bootstrap 5 dengan komponen kustom

## 🛠️ Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool
- **Vue Router** - Official router untuk Vue.js
- **Pinia** - State management
- **Bootstrap 5** - CSS framework
- **ApexCharts** - Chart library
- **Element Plus** - Vue 3 component library
- **VeeValidate** - Form validation
- **Axios** - HTTP client

## 📁 Struktur Project

```
src/
├── assets/         # Static assets (icons, sass, typescript)
├── components/     # Reusable components
│   ├── cards/      # Card components
│   ├── customers/  # Customer/user related components
│   ├── widgets/    # Dashboard widgets
│   └── modals/     # Modal components
├── layouts/        # Layout components
├── router/         # Vue Router configuration
├── stores/         # Pinia stores
└── views/          # Page views
    ├── Dashboard.vue          # Main dashboard
    ├── LayoutBuilder.vue      # Layout configuration
    ├── apps/customers/        # User management pages
    └── crafted/
        ├── account/           # Account management
        ├── authentication/    # Auth pages
        └── modals/           # Modal views
```

## 🚀 Quick Start

### 1. Install Dependencies

```sh
npm install
```

### 2. Development Server

```sh
npm run dev
```

Buka [http://localhost:5173](http://localhost:5173) di browser.

### 3. Build untuk Production

```sh
npm run build
```

### 4. Preview Build

```sh
npm run preview
```

## 📖 Halaman yang Tersedia

### Dashboard
- **URL**: `/dashboard`
- **Deskripsi**: Dashboard utama dengan berbagai widget dan statistik

### User Management
- **URL**: `/users/list`
- **Deskripsi**: Daftar user/customer dengan fitur search, filter, dan aksi
- **URL**: `/users/details`
- **Deskripsi**: Detail user/customer

### Authentication
- **URL**: `/sign-in`
- **Deskripsi**: Halaman login
- **URL**: `/sign-up`
- **Deskripsi**: Halaman registrasi
- **URL**: `/password-reset`
- **Deskripsi**: Reset password

### Account Management
- **URL**: `/crafted/account/overview`
- **Deskripsi**: Overview akun user
- **URL**: `/crafted/account/settings`
- **Deskripsi**: Pengaturan akun

### Layout Builder
- **URL**: `/builder`
- **Deskripsi**: Konfigurasi layout aplikasi

## 🎨 Kustomisasi

### Theme Configuration
File konfigurasi theme terletak di `src/stores/config.ts`

### Routing
Tambah route baru di `src/router/index.ts`

### State Management
Store Pinia tersedia di `src/stores/`

## 🔧 Development Tools

### Type Checking
```sh
npm run type-check
```

### Linting
```sh
npm run lint
```

## 📦 Dependencies Utama

- **Vue 3**: Framework utama
- **Vue Router**: Routing
- **Pinia**: State management
- **Bootstrap 5**: UI framework
- **ApexCharts**: Charts
- **Element Plus**: Component library
- **VeeValidate**: Form validation
- **Axios**: HTTP client
- **SweetAlert2**: Alert/notification
- **Moment.js**: Date handling

## 🤝 Contributing

1. Fork project ini
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 License

Distributed under the MIT License.
