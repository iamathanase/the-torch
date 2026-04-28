import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { DataProvider } from '@/context/DataContext';
import { OnlineStatusProvider } from '@/context/OnlineStatusContext';
import { Toaster } from '@/components/ui/toaster';
import DashboardLayout from '@/layouts/DashboardLayout';
import Overview from '@/pages/dashboard/Overview';
import Orders from '@/pages/dashboard/Orders';
import Listings from '@/pages/dashboard/Listings';
import Messages from '@/pages/dashboard/Messages';
import Settings from '@/pages/dashboard/Settings';
import Users from '@/pages/dashboard/Users';
import Marketplace from '@/pages/dashboard/Marketplace';
import Learning from '@/pages/dashboard/Learning';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <OnlineStatusProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<Overview />} />
                <Route path="orders" element={<Orders />} />
                <Route path="listings" element={<Listings />} />
                <Route path="messages" element={<Messages />} />
                <Route path="settings" element={<Settings />} />
                <Route path="users" element={<Users />} />
                <Route path="marketplace" element={<Marketplace />} />
                <Route path="learn" element={<Learning />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </OnlineStatusProvider>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
