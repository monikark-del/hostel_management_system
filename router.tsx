import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import HomePage from '@/components/pages/HomePage';
import StudentsPage from '@/components/pages/StudentsPage';
import RoomsPage from '@/components/pages/RoomsPage';
import AllocationsPage from '@/components/pages/AllocationsPage';
import AdminPage from '@/components/pages/AdminPage';

// Layout component that includes ScrollToTop
function Layout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "students",
        element: <StudentsPage />,
      },
      {
        path: "rooms",
        element: <RoomsPage />,
      },
      {
        path: "allocations",
        element: <AllocationsPage />,
      },
      {
        path: "admin",
        element: <AdminPage />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
], {
  basename: import.meta.env.BASE_NAME,
});

export default function AppRouter() {
  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}
