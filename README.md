# GYM FOG - Combat Sports E-commerce

A full-stack e-commerce platform for combat sports materials built with FastAPI, Next.js, and MongoDB.

## Architecture

- **Frontend** (Port 3000): Next.js customer-facing store
- **Admin** (Port 3001): Next.js admin panel for order management
- **Backend** (Port 8000): FastAPI REST API
- **MongoDB** (Port 27017): Database
- **MinIO** (Port 9000/9001): Object storage for images

## Quick Start with Docker

### Prerequisites

- Docker and Docker Compose installed
- Ports 3000, 3001, 8000, 9000, 9001, 27017 available

### Run the entire stack

```bash
# Build and start all services
docker compose up --build

# Or run in detached mode
docker compose up -d --build
```

### Access the applications

- **Store (Frontend)**: http://localhost:3000
- **Admin Panel**: http://localhost:3001
- **API Documentation**: http://localhost:8000/docs
- **MinIO Console**: http://localhost:9001 (login: minioadmin / minioadmin123)

### Stop the services

```bash
docker compose down

# To also remove volumes (database data)
docker compose down -v
```

## Development Setup (Without Docker)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Admin Panel

```bash
cd admin
npm install
npm run dev -- -p 3001
```

## Environment Variables

### Backend (.env)

```env
MONGO_URI=mongodb://localhost:27017
MONGO_DB=gym_fog_db
MINIO_HOST=localhost
MINIO_PORT=9000
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin123
SECRET_KEY=your-secret-key
JWT_SECRET=your-jwt-secret
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Admin (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Features

### Customer Features
- Browse products by category
- Add products to cart (stored in localStorage)
- Guest checkout with delivery details
- Order tracking

### Admin Features
- View all orders
- Accept or decline pending orders
- Mark orders as ready/delivered
- Manage products and categories
- Analytics dashboard

## API Endpoints

### Public Endpoints
- `GET /products/` - List products
- `GET /categories/` - List categories
- `POST /orders/guest` - Create guest order

### Admin Endpoints (Authentication Required)
- `GET /orders/get_admin_orders` - Get all orders
- `PATCH /orders/admin/{id}/accept` - Accept order
- `PATCH /orders/admin/{id}/decline` - Decline order
- `PATCH /orders/admin/{id}/ready` - Mark ready
- `PATCH /orders/admin/{id}/delivered` - Mark delivered

## Order Flow

1. Customer adds items to cart
2. Customer fills checkout form (name, phone, address, wilaya)
3. Order created with status: `PENDING`
4. Admin accepts order -> status: `ACCEPTED`
5. Admin marks ready -> status: `READY` (or `OUT_FOR_DELIVERY` if delivery)
6. Admin marks delivered -> status: `DELIVERED`

Admin can also decline orders -> status: `DECLINED`
