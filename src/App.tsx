import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import QuoteRequest from "./pages/QuoteRequest";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/auth/AuthPage";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import SubmissionsPage from "./pages/admin/SubmissionsPage";
import CalendarPage from "./pages/admin/CalendarPage";
import FormsPage from "./pages/admin/FormsPage";
import PricingConfigPage from "./pages/admin/PricingConfigPage";
import SettingsPage from "./pages/admin/SettingsPage";
import EmailSettingsPage from "./pages/admin/EmailSettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<QuoteRequest />} />
            <Route path="/quote-request" element={<QuoteRequest />} />
            
            {/* Auth */}
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/admin/login" element={<Navigate to="/auth" replace />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="submissions" element={<SubmissionsPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="forms" element={<FormsPage />} />
              <Route path="pricing" element={<PricingConfigPage />} />
              <Route path="emails" element={<EmailSettingsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
