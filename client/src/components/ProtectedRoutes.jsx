import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../context/authStore";
import { Loader2 } from "lucide-react";

export default function ProtectedRoutes() {
    const { isAuthenticated, checkAuthLoading } = useAuthStore();
    const location = useLocation();

    if (checkAuthLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#252422]">
                <Loader2 className="h-8 w-8 animate-spin text-[#eb5e28]" />
            </div>
        );
    }

    return isAuthenticated ? (
        <Outlet />
    ) : (
        <Navigate to="/login" state={{ from: location }} replace />
    );
}
