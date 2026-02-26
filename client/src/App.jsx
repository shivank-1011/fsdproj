import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "./context/authStore";
import { Loader2 } from "lucide-react";

import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";

import SellerRoutes from "./components/SellerRoutes";
import SellerLayout from "./layouts/SellerLayout";
import Dashboard from "./pages/seller/Dashboard";
import StoreCreation from "./pages/seller/StoreCreation";
import ProductManagement from "./pages/seller/ProductManagement";

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const checkAuthLoading = useAuthStore((state) => state.checkAuthLoading);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (checkAuthLoading) {
    return (
      <div style={{ display: 'flex', height: '100vh', width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-background)' }}>
        <Loader2 className="animate-spin" style={{ color: 'var(--color-primary)' }} size={40} />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />
      <Route path="/forgot-password" element={<AuthPage />} />

      <Route element={<SellerRoutes />}>
        <Route path="/seller" element={<SellerLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="store-setup" element={<StoreCreation />} />
          <Route path="products" element={<ProductManagement />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetails />} />
          <Route path="cart" element={<Cart />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
