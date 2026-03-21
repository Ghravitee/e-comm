// components/DebugAuth.tsx
import { useAuth } from "../../features/auth/context/AuthProvider";
import { LoadingScreen } from "./LoadingScreen";

export const DebugAuth = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      {children}
      {/* Keep your debug panel but hidden by default */}
      <div className="fixed bottom-4 right-4 bg-white border border-gray-200 shadow-lg rounded-lg p-4 max-w-md z-50 text-sm hidden">
        <h3 className="font-bold mb-2">🔐 Auth Debug Info</h3>
        <div className="space-y-1">
          <p>Status: {user ? "✅ Authenticated" : "❌ Not authenticated"}</p>
          {user && (
            <>
              <p>
                User ID: <span className="font-mono text-xs">{user.id}</span>
              </p>
              <p>Email: {user.email}</p>
              <p>Role: {user.role || "N/A"}</p>
              <p>
                Last sign in:{" "}
                {new Date(
                  user.last_sign_in_at || user.created_at,
                ).toLocaleString()}
              </p>
            </>
          )}
        </div>
        <button
          onClick={() => (window.location.href = "http://localhost:5173/")}
          className="mt-2 text-xs text-blue-600 hover:underline"
        >
          Return to home
        </button>
      </div>
    </>
  );
};
