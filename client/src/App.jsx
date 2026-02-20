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

function App() {
  const { checkAuth, checkAuthLoading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (checkAuthLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#252422] text-[#eb5e28]">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes - Both point to AuthPage which handles the view state */}
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetails />} />
        </Route>
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
