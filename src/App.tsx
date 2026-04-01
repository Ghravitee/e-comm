import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import { ScrollToTop } from "./app/router/ScrollToTop";
import { Layout } from "./features/layout/Layout";
import { ProtectedRoute } from "./app/router/ProtectedRoute";
import { AdminRoute } from "./app/router/AdminRoute";
import { AuthLayout } from "./features/layout/AuthLayout";
import { useCartPersistence } from "./features/cart/hooks/useCartPersistence";
import { Toaster } from "react-hot-toast";
import { DebugAuth } from "./shared/components/DebugAuth";
import { LoadingScreen } from "./shared/components/LoadingScreen";

// Lazy loaded pages
const Home = lazy(() =>
  import("./pages/Home").then((m) => ({ default: m.Home })),
);
const Shop = lazy(() => import("./features/products/pages/Shop"));
const CategoryPage = lazy(() =>
  import("./features/products/pages/CategoryPage").then((m) => ({
    default: m.CategoryPage,
  })),
);
const ProductDetailsPage = lazy(() =>
  import("./features/products/pages/ProductDetailsPage").then((m) => ({
    default: m.ProductDetailsPage,
  })),
);

const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Faqs = lazy(() => import("./pages/Faqs"));

const SignIn = lazy(() =>
  import("./features/auth/pages/SignIn").then((m) => ({ default: m.SignIn })),
);
const SignUp = lazy(() =>
  import("./features/auth/pages/SignUp").then((m) => ({ default: m.SignUp })),
);
const CompleteProfile = lazy(() =>
  import("./features/profiles/pages/CompleteProfile").then((m) => ({
    default: m.CompleteProfile,
  })),
);
const AuthCallback = lazy(() => import("./features/auth/pages/Callback"));

const FavoritesPage = lazy(() =>
  import("./features/favorites/pages/FavoritesPage").then((m) => ({
    default: m.FavoritesPage,
  })),
);
const OrdersPage = lazy(() =>
  import("./features/orders/pages/OrdersPage").then((m) => ({
    default: m.OrdersPage,
  })),
);
const ProfilePage = lazy(() =>
  import("./features/profiles/pages/ProfilePage").then((m) => ({
    default: m.ProfilePage,
  })),
);
const CheckoutPage = lazy(
  () => import("./features/checkout/pages/CheckoutPage"),
);

const AdminProductsPage = lazy(() =>
  import("./features/admin/pages/AdminProductsPage").then((m) => ({
    default: m.AdminProductsPage,
  })),
);
const AdminOrdersPage = lazy(() =>
  import("./features/admin/pages/AdminOrdersPage").then((m) => ({
    default: m.AdminOrdersPage,
  })),
);

const NotFound = lazy(() =>
  import("./pages/NotFound").then((m) => ({ default: m.NotFound })),
);

function App() {
  useCartPersistence();

  return (
    <BrowserRouter>
      <ScrollToTop />

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#023009",
            color: "#fff",
            borderRadius: "0",
            padding: "10px",
            fontSize: "14px",
            border: "1px solid #fff",
            borderLeft: "4px solid #fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#196d19",
              secondary: "#fff",
            },
            style: {
              background: "#089208",
              color: "#fff",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
            style: {
              background: "#ef4444",
              color: "#fff",
            },
          },
          loading: {
            style: {
              background: "#3b82f6",
              color: "#fff",
            },
          },
        }}
      />

      <DebugAuth>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            {/* Auth pages */}
            <Route element={<AuthLayout />}>
              <Route path="/complete-profile" element={<CompleteProfile />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
            </Route>

            {/* Main pages */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/category" element={<CategoryPage />} />
              <Route path="/category/:categoryId" element={<CategoryPage />} />
              <Route path="/products/:id" element={<ProductDetailsPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faqs" element={<Faqs />} />

              {/* Protected */}
              <Route element={<ProtectedRoute />}>
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>

              {/* Admin */}
              <Route element={<AdminRoute />}>
                <Route path="/admin/products" element={<AdminProductsPage />} />
                <Route path="/admin/orders" element={<AdminOrdersPage />} />
              </Route>
            </Route>

            {/* 404 */}
            <Route element={<Layout />}>
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </DebugAuth>
    </BrowserRouter>
  );
}

export default App;

// Routing and Layouts
{
  /* <BrowserRouter>
  <Routes>
    <Route element={<AuthLayout />}>...</Route>
    <Route element={<Layout />}>...</Route>
  </Routes>
</BrowserRouter>
```

The app uses **React Router v6**. The key concept here is **Layout Routes** — instead of wrapping every page individually,
you nest pages inside a shared layout route. `AuthLayout` wraps auth pages (sign in, sign up), while `Layout` wraps
all the main shopping pages.

Interview
Interview
**Interview answer:** *"I used nested routes so that layouts like the navbar and footer are only defined once. 
Any route nested inside `<Layout />` automatically gets the header and footer without me repeating it."*

---

### 2. 🔐 Route Protection — Three Tiers of Access

Your app has **3 levels of access control:**
```
Public routes     → anyone can visit (Home, Shop, About)
ProtectedRoute    → must be logged in (Checkout, Orders, Profile)
AdminRoute        → must be logged in AND be an admin (Admin pages) */
}

{
  /* <Route element={<ProtectedRoute />}>
  <Route path="/checkout" element={<CheckoutPage />} />
</Route>

<Route element={<AdminRoute />}>
  <Route path="/admin/products" element={<AdminProductsPage />} />
</Route> */
}

// Both ProtectedRoute and AdminRoute act as middleware components — they check auth state
// and either render the child page or redirect the user. This is a very clean, scalable pattern.

// Interview answer: "I separated concerns by having three access tiers.
// ProtectedRoute checks if the user is authenticated, AdminRoute additionally
// checks if they have admin privileges, and both redirect users away
// if the check fails — without touching the page components themselves."

// Lazy Loading
// const Shop = lazy(() => import("./features/products/pages/Shop"));
// Every single page is lazy loaded. This means none of the page code is
// downloaded until the user actually navigates there.
// The Suspense component handles the loading state while the chunk downloads:

{
  /* <Suspense fallback={<div className="h-screen ...">Loading...</div>}></Suspense>; */
}

// Why this matters: Without lazy loading, your entire app — every page,
// every component — ships to the user on first load. With it, users only download
// what they need, making the initial load much faster.
// Without Suspense, the app would crash during lazy loading because the component isn't immediately available.
// Suspense provides a fallback UI while the chunk is being fetched.

// Interview
// Interview
// Interview answer: "I lazy loaded every page using React.lazy and dynamic imports.
// Vite automatically splits these into separate JavaScript chunks at build time.
// The user's browser only downloads a page's code when they first visit it."

// Toast Notifications — react-hot-toast

// Because Toaster lives at the root level, any component anywhere in your app can trigger a
// toast notification without passing props or callbacks down.

// Interview
// Interview
// Interview answer: "I placed the Toaster at the root so any feature — cart, checkout, auth —
// can fire a notification without prop drilling. I customized each toast type to match the app's design system."

// useCartPersistence() — A Silent Hook

// This hook is called at the top of App but renders nothing. Its job is purely a side effect —
// it syncs the cart state (stored in Zustand) with localStorage, so your cart survives a page refresh.
// It runs once when the app mounts
