# 🌌 Aurora Maps (Monorepo)

**Aurora Maps** is a high-performance web application designed for creating and sharing geospatial data with a premium user experience. This repository contains both the Laravel backend API and the React frontend application.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![PHP](https://img.shields.io/badge/php-8.2-777BB4.svg)
![Laravel](https://img.shields.io/badge/laravel-12.x-FF2D20.svg)
![React](https://img.shields.io/badge/react-19.x-61DAFB.svg)

---

## 🏗 Architecture (The Senior Way)

The project follows a Domain-Driven Design (DDD) inspired structure to ensure scalability and maintainability.

### Backend (`/backend`)
Built with **Laravel 12**, following the logic:
- **Slim Controllers**: Only handle request/response.
- **Service Layer**: Contains all business logic (e.g., `MapService`).
- **API Resources**: Standardize JSON responses.
- **FormRequests**: Isolate validation rules.

### Frontend (`/frontend`)
Built with **React 19 + Vite**, reorganized by **Feature**:
- **Features (`src/features`)**: Code grouped by domain (e.g., `maps`, `auth`).
- **Custom Hooks**: specialized hooks (e.g., `useMaps`) to abstract API calls and state management.
- **Config**: Centralized configuration (e.g., Axios instance in `src/config`).

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (optional, if running frontend locally without Docker)

### 1. Start Environment
The entire stack is containerized. Run:

```bash
docker compose up -d
```

Use `--build` if it's the first run or if you changed dependencies.

### 2. Setup Backend
(Only needed on first run)

```bash
# Install dependencies
docker compose exec app composer install

# Generate Key (if not set)
docker compose exec app php artisan key:generate

# Run Migrations
docker compose exec app php artisan migrate

# Fix Permissions (if needed)
docker compose exec app chmod -R 777 storage bootstrap/cache
```

### 3. Access Application
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:8080/api](http://localhost:8080/api)

---

## 🧪 Development Workflow

### Frontend
The frontend code is located in `frontend/`.
- **Components**: `src/components` (Generic UI)
- **Features**: `src/features` (Domain specific)
- **Pages**: `src/pages` (Route views)

To run without Docker (faster HMR):
```bash
cd frontend
npm install
npm run dev
```

### Backend
The backend code is located in `backend/`.
- **Controllers**: `app/Http/Controllers`
- **Services**: `app/Services`
- **Models**: `app/Models`

---

## 🤝 Contributing

1. **Keep Controllers Slim**: Move logic to Services.
2. **Feature-First**: If adding a new domain (e.g., "Blog"), create `src/features/blog`.
3. **Validation**: Always use FormRequests.

---

## 📝 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
