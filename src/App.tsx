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
        <Suspense
          fallback={
            <div className="h-screen w-full flex items-center justify-center text-lg">
              Loading...
            </div>
          }
        >
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
