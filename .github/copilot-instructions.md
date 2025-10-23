# Gastrom Restaurant Management System - AI Assistant Guide

## Architecture Overview

This is a React + TypeScript restaurant management application using Vite,
Material-UI, TanStack Query, and Basic Authentication. The app follows a
feature-based structure with clear separation between authentication, data
management, and UI layers.

**Key Stack:** React 18 + TypeScript + Vite + MUI v6 + TanStack Query + React
Router v7 + Axios + Zod

## Critical Development Patterns

### Authentication & API Integration

- Basic Auth credentials (username/password) stored in localStorage via
  `AuthContext` (`src/context/auth-context.tsx`)
- All API calls use `apiInstance` from `src/utils/api-instance.ts` with base URL
  in `src/consts/api.ts`
- Basic Auth header automatically injected by axios interceptor in
  `api-instance.ts`
- Protected routes wrapped with `ProtectedRoute` component - check
  `src/routing/routes.tsx`
- Custom auth hooks in `src/hooks/use-auth.ts` handle login/logout with
  navigation

### Data Management with TanStack Query

- **Critical Pattern:** All data fetching uses TanStack Query with structured
  query keys
- Example from `src/hooks/use-inventory.ts`: Use query key factories for cache
  management
- Mutations include optimistic updates and error handling with
  `useQueryClient.invalidateQueries()`
- Follow the established pattern:
  `export const [entityName]Keys = { all: [...], lists: () => [...] }`

### Component Architecture

- **Main Layout:** All pages use `MainContainer` component
  (`src/components/main-container.tsx`)
- **Side Navigation:** Collapsible drawer with responsive behavior in
  `SideMenu.tsx`
- **Material-UI Theming:** Custom theme in `src/styles/AppTheme.tsx` with CSS
  variables and light/dark mode
- **Schema Validation:** Use Zod schemas from `src/schemas/` for type safety and
  validation

### File Organization Conventions

- **Hooks:** Custom hooks prefixed with `use-` in `src/hooks/`
- **Pages:** Route components in `src/pages/` (e.g., `home.tsx`,
  `inventory.tsx`)
- **Components:** Reusable UI in `src/components/` with Material-UI components
  in `material/` subfolder
- **Types/Schemas:** Separate Zod schemas in `src/schemas/` and TypeScript types
  in `src/types/`

## Development Workflows

### Running the Application

```bash
npm run dev          # Development server on localhost:5173
npm run build        # Production build (TypeScript check + Vite build)
npm run lint         # ESLint with TypeScript support
npm run preview      # Preview production build
```

### Testing

- **E2E Tests:** Playwright tests in `tests/` directory
- **Auth Testing:** Tests use Basic Auth credentials injection - see
  `tests/e2e.test.spec.ts`
- **Run Tests:** `npm run test:e2e` (headless) or `npm run test:e2e-ui`
  (interactive)

### Key Integration Points

- **API Base:** `https://management-api-irsm.onrender.com` - backend expects
  Basic Auth in Authorization header
- **Routes:** Authentication-based routing with public, auth-only, and
  non-auth-only route groups
- **State Management:** TanStack Query for server state + React Context for auth
  state
- **Notifications:** Notistack provider configured in `main.tsx` for global
  notifications

## Project-Specific Conventions

- **Import Extensions:** Always include `.tsx`/`.ts` extensions in relative
  imports
- **Component Props:** Use interface definitions rather than inline types
- **API Responses:** Wrap responses with Zod schemas for runtime validation
- **Error Handling:** Use try-catch in async operations with user-friendly error
  messages via notistack
- **Responsive Design:** Mobile-first approach with MUI breakpoints and
  `useMediaQuery`

## Common Gotchas

- The `App.tsx` component is minimal - main routing happens in
  `src/routing/routes.tsx`
- MUI v6 uses CSS variables - check theme customizations in
  `src/styles/customizations/`
- Playwright tests require the dev server running on port 5173
- Font imports include `@ts-expect-error` comment for Inter font resolution
