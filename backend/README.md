# Construction Inventory Management System - Backend

A comprehensive backend API for managing construction materials, inventory, procurement, and project resources.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Implementation Status](#implementation-status)

## ✨ Features

### Core Functionality
- **User Management**: Role-based access control (RBAC) with 6 user roles
- **Material Management**: Comprehensive material catalog with approval workflows
- **Supplier Management**: Supplier profiles with performance tracking
- **Procurement**: Purchase Order creation, approval, and tracking
- **Goods Receipt**: GRN processing with tolerance checks and batch tracking
- **Inventory Control**: FIFO stock management, transfers, and adjustments
- **Project Management**: BOQ management and budget tracking
- **Material Issues**: Request and approval workflows for material distribution
- **Returns & Reconciliation**: Material return processing and cycle counts
- **Reporting & Analytics**: KPIs, dashboards, and audit trails
- **Real-time Notifications**: WebSocket-based alerts and notifications
- **Document Generation**: PDF generation for purchase orders
- **Data Import/Export**: Excel-based bulk operations
- **API Versioning**: Support for multiple API versions
- **Performance Monitoring**: Prometheus metrics and performance budgets

## 🛠 Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Caching/Locks**: Redis with Redlock
- **Authentication**: JWT with bcrypt
- **Validation**: Zod
- **Real-time**: Socket.IO
- **Monitoring**: Prometheus + Pino logger
- **Document Generation**: PDFKit
- **Email**: Nodemailer
- **Cron Jobs**: node-cron with distributed locking

## 📁 Project Structure

```
backend/
├── prisma/
│   └── schema.prisma              # Database schema
├── src/
│   ├── config/                    # Configuration files
│   │   ├── api.config.ts
│   │   ├── auth.config.ts
│   │   ├── logger.config.ts
│   │   ├── mail.config.ts
│   │   ├── metrics.config.ts
│   │   ├── performance.config.ts
│   │   ├── redis.config.ts
│   │   └── versioning.config.ts
│   ├── controllers/               # Request handlers (to be implemented)
│   ├── middlewares/               # Express middlewares
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── performance.middleware.ts
│   │   ├── rbac.middleware.ts
│   │   ├── security.middleware.ts
│   │   └── version.middleware.ts
│   ├── routes/                    # API routes (to be implemented)
│   ├── services/                  # Business logic (to be implemented)
│   ├── utils/                     # Utility functions
│   │   ├── AppError.ts
│   │   ├── catchAsync.ts
│   │   ├── codeGenerator.ts
│   │   ├── express.d.ts
│   │   ├── pdfGenerator.ts
│   │   ├── prisma.ts
│   │   ├── router.factory.ts
│   │   └── token.ts
│   ├── validations/               # Zod validation schemas (to be implemented)
│   ├── jobs/                      # Cron jobs (to be implemented)
│   ├── app.ts                     # Express app setup (to be implemented)
│   └── server.ts                  # Server entry point (to be implemented)
├── .env.example                   # Environment variables template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.x
- PostgreSQL >= 14.x
- Redis >= 6.x
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration values.

4. **Set up the database**
   ```bash
   # Generate Prisma Client
   npm run prisma:generate
   
   # Run migrations
   npm run prisma:migrate
   
   # (Optional) Seed the database
   npm run prisma:seed
   ```

## 🔐 Environment Variables

See [`.env.example`](./.env.example) for all required environment variables:

```env
# Server
NODE_ENV=development
PORT=4000

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/construction_inventory"

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=12h

# Redis
REDIS_URL=redis://localhost:6379

# CORS
CORS_ORIGIN=http://localhost:3000

# SMTP
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=test_user
SMTP_PASS=test_pass

# Logging
LOG_LEVEL=info
```

## 🗄 Database Setup

The application uses Prisma ORM with PostgreSQL. The schema includes:

- **Users & Authentication**: User management with role-based access
- **Materials**: Material catalog with versioning and approval workflows
- **Suppliers**: Supplier profiles and performance tracking
- **Locations**: Warehouses, sites, and yards for stock management
- **Stock**: Batch-tracked inventory with FIFO support
- **Purchase Orders**: PO creation, approval, and tracking
- **GRN**: Goods receipt with tolerance checks
- **Projects & BOQ**: Project management with bill of quantities
- **Material Issues**: Material request and distribution workflows
- **Returns & Reconciliation**: Return processing and cycle counts
- **Audit Logs**: Comprehensive audit trail
- **Notifications**: User notification system
- **Integrations**: Webhook and ERP integration configs

### Running Migrations

```bash
# Create a new migration
npm run prisma:migrate

# View database in Prisma Studio
npm run prisma:studio
```

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

### Testing
```bash
npm test
```

## 📚 API Documentation

### Base URL
```
http://localhost:4000/api/v1
```

### Authentication
All protected endpoints require a Bearer token:
```
Authorization: Bearer <jwt-token>
```

### Key Endpoints (To be implemented)

- **Authentication**
  - `POST /api/v1/auth/register` - Register new user
  - `POST /api/v1/auth/login` - Login
  - `GET /api/v1/auth/me` - Get current user profile

- **Materials**
  - `GET /api/v1/materials` - List all materials
  - `POST /api/v1/materials` - Create material
  - `PATCH /api/v1/materials/:id/approve` - Approve material

- **Procurement**
  - `GET /api/v1/procurement/orders` - List purchase orders
  - `POST /api/v1/procurement/orders` - Create PO
  - `PATCH /api/v1/procurement/orders/:id/approve` - Approve PO
  - `POST /api/v1/procurement/grn` - Record goods receipt

- **Inventory**
  - `GET /api/v1/inventory/stock-levels` - Get stock levels
  - `POST /api/v1/inventory/transfer` - Transfer stock
  - `POST /api/v1/inventory/adjust` - Adjust stock

- **Projects**
  - `GET /api/v1/projects` - List projects
  - `POST /api/v1/projects` - Create project
  - `POST /api/v1/projects/boq` - Add BOQ items

- **Issues**
  - `GET /api/v1/issues` - List material issues
  - `POST /api/v1/issues` - Request materials
  - `PATCH /api/v1/issues/:id/execute` - Approve and execute issue

- **Reports**
  - `GET /api/v1/reports/dashboard` - Dashboard statistics
  - `GET /api/v1/analytics/kpis` - Get KPIs

## 📊 Implementation Status

### ✅ Completed Components

1. **Project Setup**
   - ✅ Package.json with all dependencies
   - ✅ TypeScript configuration
   - ✅ Git ignore file
   - ✅ Environment variables template
   - ✅ Project directory structure

2. **Database Layer**
   - ✅ Complete Prisma schema with all models
   - ✅ User management models
   - ✅ Material and supplier models
   - ✅ Stock and location models
   - ✅ Procurement models (PO, GRN)
   - ✅ Project and BOQ models
   - ✅ Material issue and return models
   - ✅ Audit log and notification models
   - ✅ Integration config models

3. **Configuration Files**
   - ✅ API configuration
   - ✅ Auth configuration (JWT settings)
   - ✅ Logger configuration (Pino)
   - ✅ Mail configuration (Nodemailer)
   - ✅ Metrics configuration (Prometheus)
   - ✅ Performance budgets
   - ✅ Redis configuration with Redlock
   - ✅ API versioning configuration

4. **Middleware**
   - ✅ Error handling middleware
   - ✅ Authentication middleware (JWT)
   - ✅ RBAC middleware
   - ✅ Performance monitoring middleware
   - ✅ Security headers middleware
   - ✅ API versioning middleware

5. **Utilities**
   - ✅ AppError class for error handling
   - ✅ catchAsync wrapper
   - ✅ Prisma client with query instrumentation
   - ✅ Material code generator
   - ✅ Express type definitions
   - ✅ PDF generator (for POs)
   - ✅ Router factory
   - ✅ Token utilities

### 🚧 To Be Implemented

The following components are referenced in the original code but need to be implemented:

1. **Controllers** (All need implementation)
   - Admin controller
   - Analytics controller
   - Auth controller
   - Control controller
   - Document controller
   - GRN controller
   - Integration controller
   - Issue controller
   - Material controller
   - Procurement controller
   - Project controller
   - Report controller
   - Stock controller
   - Supplier controller
   - User controller

2. **Services** (Business logic layer)
   - Activity service
   - Admin service
   - Analytics service
   - Audit service
   - Auth service
   - GRN service
   - Integration service
   - Issue service
   - Material service
   - Mobile service
   - Notification service
   - Procurement service
   - Project service
   - Reconciliation service
   - Report service
   - Return service
   - Session service
   - Socket service
   - Stock service
   - Stock mutation service
   - Supplier service

3. **Routes** (API endpoints)
   - Admin routes
   - Analytics routes
   - Auth routes
   - Control routes
   - Data routes (import/export)
   - Document routes
   - Integration/Sync routes
   - Inventory routes
   - Issue routes
   - Material routes
   - Procurement routes
   - Project routes
   - Report routes
   - Search routes
   - Supplier routes
   - User routes

4. **Validations** (Zod schemas)
   - Activity schemas
   - Integration schemas
   - Inventory schemas
   - Material schemas
   - Mobile schemas
   - Procurement schemas
   - Project schemas
   - Supplier schemas

5. **Jobs** (Cron tasks)
   - Alert monitor (stock levels, expiry dates)
   - Performance monitor
   - Distributed cron wrapper

6. **Main Application Files**
   - app.ts (Express app setup with all routes)
   - server.ts (HTTP server and Socket.IO initialization)

## 🔄 Next Steps

To complete the implementation:

1. **Implement Controllers**: Create all controller files with request handling logic
2. **Implement Services**: Add business logic for each domain
3. **Create Routes**: Define all API endpoints
4. **Add Validations**: Create Zod schemas for request validation
5. **Setup Jobs**: Implement cron jobs for background tasks
6. **Create Main Files**: Implement app.ts and server.ts
7. **Add Tests**: Write unit and integration tests
8. **Create Seed Data**: Add database seeding script
9. **Documentation**: Generate API documentation (Swagger/OpenAPI)

## 📝 Code Example: Adding a New Route

```typescript
// src/routes/example.routes.ts
import { createVersionedRouter } from '../utils/router.factory';
import { protect } from '../middlewares/auth.middleware';
import { restrictTo } from '../middlewares/rbac.middleware';
import * as exampleController from '../controllers/example.controller';

const router = createVersionedRouter('v1');
router.use(protect);

router.get('/', exampleController.getAll);
router.post('/', restrictTo('ADMIN'), exampleController.create);

export default router;
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Team Roles

- **ADMIN**: Full system access
- **PROJECT_MANAGER**: Project and procurement management
- **SITE_ENGINEER**: Material requests and site operations
- **INVENTORY_MANAGER**: Inventory control and approvals
- **STORE_KEEPER**: Stock management and GRN processing
- **PROCUREMENT_OFFICER**: Supplier and PO management

## 🆘 Support

For issues and questions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Contact the development team

---

**Note**: This is a comprehensive backend system. Complete implementation of all controllers, services, and routes is required before deployment. See the Implementation Status section for details.
