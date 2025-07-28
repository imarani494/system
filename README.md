# Order Management System - Backend Server



A robust backend system for managing Customers, Products, and Orders with JWT authentication and role-based access control.

**Live API**: https://ignipc-assignment.onrender.com

## ✨ Features

- 🔐 JWT-based authentication (Login/Register)
- 👑 Admin role verification
- 🛠️ Full CRUD operations for:
  - Customers
  - Products 
  - Orders
- 🔄 Order status updates
- 📊 CSV export for orders
- 🛡️ Role-based route protection
- ⚡ Real-time updates via WebSocket

## 🚀 API Endpoints

### 🔐 Authentication
| Method | Endpoint               | Description                     |
|--------|------------------------|---------------------------------|
| POST   | `/api/auth/login`      | User login                     |
| POST   | `/api/auth/register`   | User registration (Temporary)  |

### 👥 Customers
| Method | Endpoint               | Description                     |
|--------|------------------------|---------------------------------|
| GET    | `/api/customers`       | Get all customers              |
| POST   | `/api/customers`       | Create new customer            |

### 🛍️ Products
| Method | Endpoint               | Description                     |
|--------|------------------------|---------------------------------|
| GET    | `/api/products`        | Get all products               |
| POST   | `/api/products`        | Create new product             |
| PUT    | `/api/products/:id`    | Update product                 |
| DELETE | `/api/products/:id`    | Delete product                 |

### 📦 Orders
| Method | Endpoint                   | Description                     |
|--------|----------------------------|---------------------------------|
| GET    | `/api/orders`              | Get all orders                 |
| GET    | `/api/orders/:id`          | Get order details              |
| POST   | `/api/orders`              | Create new order               |
| PATCH  | `/api/orders/:id/status`   | Update order status            |
| GET    | `/api/orders/export/csv`   | Export orders to CSV           |

> **Note**: All endpoints require `Authorization: Bearer <token>` header

## 🔐 Authentication Example

```http
GET /api/orders
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.


MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
