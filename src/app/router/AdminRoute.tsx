// shared/components/AdminRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useAdminProfile } from "../../features/profiles/hooks/useAdminProfile";
import type { JSX } from "react";

export const AdminRoute: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminProfile();

  // Show loading while either auth or admin status is being determined
  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B88E2F]" />
      </div>
    );
  }

  // Redirect to signin if not authenticated
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // Redirect to home if authenticated but not admin
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // User is authenticated AND is admin
  return children;
};
