# Gastrom - Restaurant Management System

A modern, full-featured restaurant management application built with React,
TypeScript, and Material-UI. Gastrom provides comprehensive tools for managing
inventory, employees, sales transactions, fixed costs, and business analytics.

![React](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![Material-UI](https://img.shields.io/badge/MUI-6.4-blue)
![License](https://img.shields.io/badge/license-private-red)

## 🚀 Features

- **Dashboard Analytics** - Customizable dashboard with drag-and-drop tiles for
  key business metrics
- **Inventory Management** - Track and manage restaurant inventory in real-time
- **Employee Management** - Manage staff information and schedules
- **Sales Tracking** - Monitor transactions and generate sales reports
- **Fixed Costs Management** - Track recurring expenses and overhead costs
- **User Management** - Multi-user support with role-based access
- **Authentication** - Secure Basic Authentication with protected routes
- **Responsive Design** - Mobile-first approach with Material-UI components
- **Dark Mode** - Light/dark theme toggle for better user experience
- **Real-time Updates** - Powered by TanStack Query for efficient data
  synchronization

## 🛠️ Tech Stack

### Core

- **React 18** - Modern React with hooks and concurrent features
- **TypeScript 5.6** - Type-safe development
- **Vite 6** - Lightning-fast build tool and dev server

### UI & Styling

- **Material-UI v6** - Comprehensive component library
- **Emotion** - CSS-in-JS styling solution
- **Recharts** - Beautiful and composable charts
- **@dnd-kit** - Drag-and-drop functionality for dashboard customization

### Data & State Management

- **TanStack Query v5** - Powerful data synchronization and caching
- **React Router v7** - Client-side routing with protected routes
- **Axios** - HTTP client with interceptors for authentication
- **Zod** - Schema validation and type inference

### Developer Experience

- **ESLint** - Code linting with TypeScript support
- **Prettier** - Code formatting
- **Playwright** - End-to-end testing framework

## 📋 Prerequisites

- **Node.js** - Version 16.x or higher
- **npm** - Version 7.x or higher (comes with Node.js)
- **Backend API** - Access to the Gastrom management API

## 🚀 Getting Started

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Oskru/gastrom.git
   cd gastrom
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser** Navigate to
   [http://localhost:5173](http://localhost:5173)

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
gastrom/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable React components
│   │   ├── material/     # Material-UI custom components
│   │   └── dashboard/    # Dashboard-specific components
│   ├── context/          # React Context providers
│   │   ├── auth-context.tsx
│   │   └── timeframe-context.tsx
│   ├── hooks/            # Custom React hooks
│   │   ├── use-auth.ts
│   │   ├── use-inventory.ts
│   │   ├── use-employees.ts
│   │   └── ...
│   ├── pages/            # Route components
│   │   ├── home.tsx
│   │   ├── inventory.tsx
│   │   ├── employee.tsx
│   │   └── ...
│   ├── routing/          # Router configuration
│   │   ├── routes.tsx
│   │   └── protected-route.tsx
│   ├── schemas/          # Zod validation schemas
│   ├── styles/           # Theme and styling
│   │   ├── AppTheme.tsx
│   │   └── customizations/
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   │   └── api-instance.ts
│   ├── consts/           # Constants and configuration
│   └── main.tsx          # Application entry point
├── tests/                # E2E tests (Playwright)
│   ├── fixtures.ts       # Playwright fixtures
│   ├── auth.setup.ts     # Global auth setup
│   ├── pages/            # Page Object classes (*.po.ts)
│   ├── *.spec.ts         # Test specifications
│   └── .auth/            # Stored auth state (gitignored)
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
└── playwright.config.ts  # Playwright test configuration
```

## 🔐 Authentication

Gastrom uses **Basic Authentication** with credentials stored securely in
localStorage. The authentication flow:

1. Users log in via `/login` route
2. Credentials are encoded and stored in localStorage
3. All API requests include the Authorization header automatically
4. Protected routes check authentication status before rendering

### Authentication Context

The `AuthContext` (`src/context/auth-context.tsx`) manages authentication state
globally:

- Stores user information and token
- Provides login/logout functionality
- Persists authentication across page refreshes

## 🔌 API Integration

The application connects to a backend API at:

```
https://management-api-irsm.onrender.com/api/v1
```

All API calls use the centralized `apiInstance` from `src/utils/api-instance.ts`
which:

- Automatically injects Basic Auth headers
- Handles request/response interceptors
- Provides consistent error handling

## 🧪 Testing

### End-to-End Tests

Gastrom uses **Playwright** for comprehensive E2E testing with a Page Object
Model architecture.

#### Running Tests

```bash
# Run all tests (headless)
npm run test:e2e

# Run tests with interactive UI
npm run test:e2e-ui
```

#### Test Environment Setup

1. Create a `.env` file (or `.env.test`) with your test token:

   ```env
   TEST_TOKEN=your_jwt_token_here
   ```

2. The dev server starts automatically via Playwright's `webServer` config.

#### Test Architecture

```
tests/
├── fixtures.ts           # Playwright fixtures for page object injection
├── auth.setup.ts         # Global authentication setup
├── pages/                # Page Object classes
│   ├── base.po.ts        # Base page with common navigation
│   ├── home.po.ts        # Home/Dashboard page
│   ├── inventory.po.ts   # Inventory page
│   ├── employee.po.ts    # Employee management page
│   ├── my-account.po.ts  # User account page
│   ├── sign-in.po.ts     # Sign-in page
│   └── ...               # Other page objects
├── auth.spec.ts          # Authentication tests
├── dashboard.spec.ts     # Dashboard functionality tests
├── navigation.spec.ts    # Navigation tests
├── inventory.spec.ts     # Inventory page tests
├── employees.spec.ts     # Employee management tests
├── responsive.spec.ts    # Responsive design tests
├── side-menu.spec.ts     # Side menu navigation tests
├── error-handling.spec.ts # Auth redirects and error handling
└── ...                   # Other test specs
```

#### Test Projects (playwright.config.ts)

- **setup** - Runs authentication setup before tests
- **unauthenticated** - Tests that run without auth (sign-in, redirects)
- **chromium** - Main test suite with authenticated user

### Page Object Pattern

Tests use the Page Object Model with Playwright fixtures for clean, maintainable
code:

```typescript
// Using fixtures - page objects are auto-instantiated
import { test, expect } from './fixtures';

test('should display inventory', async ({ inventoryPage }) => {
  await inventoryPage.goto();
  await inventoryPage.expectToBeOnInventoryPage();
  await expect(inventoryPage.ingredientsTab).toBeVisible();
});
```

## 🎨 Theming

Gastrom features a fully customizable theme system with:

- Light and dark mode support
- Custom Material-UI component overrides
- CSS variables for consistent styling
- Responsive breakpoints for mobile/tablet/desktop

Theme configuration: `src/styles/AppTheme.tsx`

## 📊 Data Management

### TanStack Query

All data fetching uses TanStack Query with:

- Automatic caching and background refetching
- Optimistic updates for better UX
- Query invalidation on mutations
- Structured query key factories

Example from `use-inventory.ts`:

```typescript
export const inventoryKeys = {
  all: ['inventory'] as const,
  lists: () => [...inventoryKeys.all, 'list'] as const,
};
```

## 🚦 Available Scripts

| Command               | Description                                      |
| --------------------- | ------------------------------------------------ |
| `npm run dev`         | Start development server on localhost:5173       |
| `npm run build`       | Build for production (includes TypeScript check) |
| `npm run lint`        | Run ESLint to check code quality                 |
| `npm run preview`     | Preview production build locally                 |
| `npm run test:e2e`    | Run Playwright E2E tests (headless)              |
| `npm run test:e2e-ui` | Run Playwright tests with interactive UI         |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Code Conventions

- **Import Extensions**: Always include `.tsx`/`.ts` extensions in relative
  imports
- **Component Props**: Use interface definitions rather than inline types
- **Error Handling**: Use try-catch in async operations with user-friendly error
  messages
- **Hooks**: Prefix custom hooks with `use-`
- **Responsive Design**: Mobile-first approach using MUI breakpoints

## 📄 License

This project is private and proprietary.

## 👥 Authors

- **Oskru** - [GitHub Profile](https://github.com/Oskru)

## 🔗 Links

- [Backend API](https://management-api-irsm.onrender.com)
- [Material-UI Documentation](https://mui.com/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Vite Documentation](https://vitejs.dev/)

---

**Built with ❤️ for restaurant management**
