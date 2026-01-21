# Construction Inventory Management System - Frontend

A modern React-based frontend for managing construction inventory, suppliers, and procurement processes.

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router DOM v6
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Headless UI, Lucide Icons
- **Charts**: Recharts
- **Tables**: TanStack Table

## Features

- **Dashboard**: Real-time analytics with inventory trends, alerts, and KPIs
- **Material Management**: CRUD operations, categorization, stock tracking
- **Supplier Management**: Supplier profiles, performance metrics, blacklisting
- **Procurement**: Purchase orders, goods received notes (GRN)
- **Projects**: Project management with Bill of Quantities (BOQ)
- **Inventory**: Stock levels, transfers, issues, and returns
- **Reports**: Customizable reports with export capabilities
- **Admin**: User management, roles, and audit logs

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your API URL:
   ```
   VITE_API_URL=http://localhost:3001/api/v1
   ```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

### Linting

Run ESLint:
```bash
npm run lint
```

## Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable components
│   │   ├── ui/            # UI components (Button, Input, etc.)
│   │   └── layout/        # Layout components (Sidebar, Header)
│   ├── pages/             # Page components
│   │   ├── auth/          # Authentication pages
│   │   ├── dashboard/     # Dashboard page
│   │   ├── materials/     # Material management
│   │   └── ...
│   ├── services/          # API service layer
│   ├── stores/            # Zustand stores
│   ├── types/             # TypeScript type definitions
│   ├── lib/               # Utility functions
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## User Roles

The application supports role-based access control (RBAC):

- **ADMIN**: Full system access
- **PROJECT_MANAGER**: Project and BOQ management
- **SITE_ENGINEER**: Site operations and material issues
- **INVENTORY_MANAGER**: Stock and inventory management
- **STORE_KEEPER**: Daily stock operations
- **PROCUREMENT_OFFICER**: Purchase orders and GRN
- **EXECUTIVE**: Dashboard and reports (read-only)
- **SITE_WORKER**: Limited access for material requests

## API Integration

The frontend connects to the backend API at the URL specified in `VITE_API_URL`. All API calls include:

- JWT authentication via Bearer token
- Automatic token refresh on 401 errors
- Request/response interceptors for error handling

## Contributing

1. Create a feature branch
2. Make your changes
3. Run linting and tests
4. Submit a pull request

## License

MIT
