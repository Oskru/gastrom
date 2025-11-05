import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './protected-route.tsx';
import Home from '../pages/home.tsx';
import SignIn from '../pages/sign-in.tsx';
import Inventory from '../pages/inventory.tsx';
import EmployeesPage from '../pages/employee.tsx';
import UsersPage from '../pages/users.tsx';
import About from '../pages/about.tsx';
import MyAccount from '../pages/my-account.tsx';
import Feedback from '../pages/feedback.tsx';
import FixedCostsPage from '../pages/fixed-costs.tsx';

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
      {
        path: '/users',
        element: <UsersPage />,
      },
      {
        path: '/fixed-costs',
        element: <FixedCostsPage />,
      },
      {
        path: '/about',
        element: <About />,
      },
      {
        path: '/account',
        element: <MyAccount />,
      },
      {
        path: '/feedback',
        element: <Feedback />,
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
