// shared/components/AdminRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useAdminProfile } from "../../features/profiles/hooks/useAdminProfile";

export const AdminRoute = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminProfile();

  // Show loading while auth/admin status resolves
  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B88E2F]" />
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // Authenticated but not admin
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Admin authenticated
  return <Outlet />;
};
