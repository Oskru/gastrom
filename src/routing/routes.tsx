import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './protected-route.tsx';
import Home from '../pages/home.tsx';
import SignIn from '../pages/sign-in.tsx';
import Inventory from '../pages/inventory.tsx';
import EmployeesPage from '../pages/employee.tsx';

// Public routes accessible to all users
const routesForPublic = [
  {
    path: '/service',
    element: <div>Service Page</div>,
  },
  {
    path: '/about-us',
    element: <div>About Us</div>,
  },
];

// Routes accessible only to NON-authenticated users (ALWAYS included)
const routesForNotAuthenticatedOnly = [
  {
    path: '/login',
    element: <SignIn />,
  },
];

// Routes accessible only to authenticated users
const routesForAuthenticatedOnly = [
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/inventory',
        element: <Inventory />,
      },
      {
        path: '/employees',
        element: <EmployeesPage />,
      },
    ],
  },
];

// Combine routes
const router = createBrowserRouter([
  ...routesForPublic,
  ...routesForNotAuthenticatedOnly,
  ...routesForAuthenticatedOnly,
]);

export default function Routes() {
  return <RouterProvider router={router} />;
}
