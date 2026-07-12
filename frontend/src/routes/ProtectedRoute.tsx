import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import axios from "axios";

function ProtectedRoute() {
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");
  const [adminRole, setAdminRole] = useState<string>("");
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_API_URL + "/api/admin/me", {
          withCredentials: true,
        });
        setAdminRole(res.data.admin?.role || "");
        setStatus("authenticated");
      } catch {
        setStatus("unauthenticated");
      }
    };
    checkAuth();
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/" replace />;
  }

  // Redirect super admin to /super-admin if they try to access /home
  if (adminRole === "super_admin" && location.pathname === "/home") {
    return <Navigate to="/super-admin" replace />;
  }

  // Redirect college admin to /home if they try to access /super-admin
  if (adminRole === "college_admin" && location.pathname === "/super-admin") {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
