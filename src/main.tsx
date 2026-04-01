import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./features/auth/context/AuthProvider";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>,
);

// The entry point of the application is main.tsx.
// It bootstraps the React application and mounts it to the DOM using ReactDOM.createRoot.

// The entire app is wrapped with AuthProvider for global authentication state using Supabase, and QueryClientProvider from React Query to manage server state and caching.

// This allows any component to access authentication and API data without prop drilling.
// Finally, the root App component handles routing, layouts, and page rendering
