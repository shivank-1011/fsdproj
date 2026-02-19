import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../context/authStore";
import { Loader2 } from "lucide-react";

export default function AdminRoutes() {
    const { user, isAuthenticated, checkAuthLoading } = useAuthStore();

    if (checkAuthLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#252422]">
                <Loader2 className="h-8 w-8 animate-spin text-[#eb5e28]" />
            </div>
        );
    }

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    return user?.role === "ADMIN" ? <Outlet /> : <Navigate to="/" replace />;
}
