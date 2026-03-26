// shared/components/ProtectedRoute.tsx

import { Outlet } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";

export const ProtectedRoute = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B88E2F]" />
      </div>
    );
  }

  // if (!user) {
  //   return (
  //     <Navigate
  //       to="/signin"
  //       state={{ from: window.location.pathname }}
  //       replace
  //     />
  //   );
  // }

  return <Outlet />;
};
