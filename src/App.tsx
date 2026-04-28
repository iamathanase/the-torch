import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { DataProvider } from '@/context/DataContext';
import { OnlineStatusProvider } from '@/context/OnlineStatusContext';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/layouts/DashboardLayout';
import Overview from '@/pages/dashboard/Overview';
import Orders from '@/pages/dashboard/Orders';
import Listings from '@/pages/dashboard/Listings';
import Messages from '@/pages/dashboard/Messages';
import Browse from '@/pages/dashboard/Browse';
import Settings from '@/pages/dashboard/Settings';
import Users from '@/pages/dashboard/Users';
import Marketplace from '@/pages/dashboard/Marketplace';
import Learning from '@/pages/dashboard/Learning';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import NotFound from '@/pages/NotFound';

// Redirect authenticated users away from login/register
function RedirectIfAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/auth/login"
        element={
          <RedirectIfAuth>
            <Login />
          </RedirectIfAuth>
        }
      />
      <Route
        path="/auth/register"
        element={
          <RedirectIfAuth>
            <Register />
          </RedirectIfAuth>
        }
      />

      {/* Dashboard Routes (Protected) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path="orders" element={<Orders />} />
        <Route path="listings" element={<Listings />} />
        <Route path="messages" element={<Messages />} />
        <Route path="browse" element={<Browse />} />
        <Route path="settings" element={<Settings />} />
        <Route path="users" element={<Users />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="learn" element={<Learning />} />
      </Route>

      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <OnlineStatusProvider>
            <AppRoutes />
            <Toaster />
          </OnlineStatusProvider>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
