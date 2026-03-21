// import { Navigate, Outlet } from "react-router-dom";
// import { useProfile } from "../hooks/useProfile";

// export const ProfileGuard = () => {
//   const { data: profile, isLoading } = useProfile();

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#B88E2F]" />
//       </div>
//     );
//   }

//   if (profile && !profile.full_name) {
//     return <Navigate to="/complete-profile" replace />;
//   }

//   return <Outlet />;
// };
