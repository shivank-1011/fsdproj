import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../context/authStore";

export default function SellerRoutes() {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "SELLER" && user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
