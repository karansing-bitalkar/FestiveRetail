import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import PublicLayout from "@/layouts/PublicLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import ProtectedRoute from "@/components/features/ProtectedRoute";

import Index from "./pages/Index";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Categories from "./pages/Categories";
import Combos from "./pages/Combos";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import RefundPolicy from "./pages/RefundPolicy";
import FAQ from "./pages/FAQ";
import Careers from "./pages/Careers";
import NotFound from "./pages/NotFound";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import OrderTracking from "./pages/OrderTracking";
import CombosBuilder from "./pages/CombosBuilder";

// Customer Dashboard
import CustomerDashboard from "./dashboards/customer/CustomerDashboard";
import MyOrders from "./dashboards/customer/MyOrders";
import Wishlist from "./dashboards/customer/Wishlist";
import Cart from "./dashboards/customer/Cart";
import AddressManagement from "./dashboards/customer/AddressManagement";
import CustomerProfile from "./dashboards/customer/CustomerProfile";
import Notifications from "./dashboards/customer/Notifications";

// Vendor Dashboard
import VendorDashboard from "./dashboards/vendor/VendorDashboard";
import VendorProducts from "./dashboards/vendor/Products";
import VendorOrders from "./dashboards/vendor/VendorOrders";
import Inventory from "./dashboards/vendor/Inventory";
import Earnings from "./dashboards/vendor/Earnings";
import VendorProfile from "./dashboards/vendor/VendorProfile";

// Admin Dashboard
import AdminDashboard from "./dashboards/admin/AdminDashboard";
import UsersManagement from "./dashboards/admin/UsersManagement";
import VendorsManagement from "./dashboards/admin/VendorsManagement";
import ProductModeration from "./dashboards/admin/ProductModeration";
import AdminProducts from "./dashboards/admin/AdminProducts";
import OrdersMonitoring from "./dashboards/admin/OrdersMonitoring";
import RevenueAnalytics from "./dashboards/admin/RevenueAnalytics";
import Settings from "./dashboards/admin/Settings";
import ScrollToTop from "./components/features/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" richColors />
      <BrowserRouter>
      <ScrollToTop />
        <Routes>
      

          {/* Public routes with Navbar+Footer */}
          <Route element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/combos" element={<Combos />} />
            <Route path="/combos/builder" element={<CombosBuilder />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsConditions />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/track/:orderId" element={<OrderTracking />} />
          </Route>

          {/* Checkout (no footer) */}
          <Route path="/checkout" element={<Checkout />} />

          {/* Auth pages (no layout) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Customer Dashboard */}
          <Route path="/dashboard/customer" element={<ProtectedRoute role="customer"><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<CustomerDashboard />} />
            <Route path="orders" element={<MyOrders />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="cart" element={<Cart />} />
            <Route path="addresses" element={<AddressManagement />} />
            <Route path="profile" element={<CustomerProfile />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>

          {/* Vendor Dashboard */}
          <Route path="/dashboard/vendor" element={<ProtectedRoute role="vendor"><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<VendorDashboard />} />
            <Route path="products" element={<VendorProducts />} />
            <Route path="orders" element={<VendorOrders />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="earnings" element={<Earnings />} />
            <Route path="profile" element={<VendorProfile />} />
          </Route>

          {/* Admin Dashboard */}
          <Route path="/dashboard/admin" element={<ProtectedRoute role="admin"><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="vendors" element={<VendorsManagement />} />
            <Route path="moderation" element={<ProductModeration />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<OrdersMonitoring />} />
            <Route path="analytics" element={<RevenueAnalytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
