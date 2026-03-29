// shared/components/AuthLayout.tsx
import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
  return (
    <div className="h-screen">
      <Outlet />
    </div>
  );
};
