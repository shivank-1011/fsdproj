import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../context/authStore";

export default function GuestRoute() {
    const { isAuthenticated } = useAuthStore();

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
