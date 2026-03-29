// App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";

import { ScrollToTop } from "./app/router/ScrollToTop";
import { Layout } from "./features/layout/Layout";
import { ProtectedRoute } from "./app/router/ProtectedRoute";
import { AdminRoute } from "./app/router/AdminRoute";

import { SignIn } from "./features/auth/pages/SignIn";
import { SignUp } from "./features/auth/pages/SignUp";
import { NotFound } from "./pages/NotFound";
import { useCartPersistence } from "./features/cart/hooks/useCartPersistence";
import { AdminProductsPage } from "./features/admin/pages/AdminProductsPage";
import { DebugAuth } from "./shared/components/DebugAuth";
import { CompleteProfile } from "./features/profiles/pages/CompleteProfile";
import Shop from "./features/products/pages/Shop";
import { ProductDetailsPage } from "./features/products/pages/ProductDetailsPage";
import { FavoritesPage } from "./features/favorites/pages/FavoritesPage";
import { OrdersPage } from "./features/orders/pages/OrdersPage";
import CheckoutPage from "./features/checkout/pages/CheckoutPage";
import { AdminOrdersPage } from "./features/admin/pages/AdminOrdersPage";
import { ProfilePage } from "./features/profiles/pages/ProfilePage";
import { CategoryPage } from "./features/products/pages/CategoryPage";
import { AuthLayout } from "./features/layout/AuthLayout";
import { Toaster } from "react-hot-toast";
import About from "./pages/About";
import AuthCallback from "./features/auth/pages/Callback";
import Contact from "./pages/Contact";
import Faqs from "./pages/Faqs";

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
        <Routes>
          {/* Auth pages - No navbar/footer */}
          <Route element={<AuthLayout />}>
            <Route path="/complete-profile" element={<CompleteProfile />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
          </Route>

          {/* Main app pages - With navbar and footer */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/category" element={<CategoryPage />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route path="/products/:id" element={<ProductDetailsPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faqs" element={<Faqs />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Admin routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin/products" element={<AdminProductsPage />} />
              <Route path="/admin/orders" element={<AdminOrdersPage />} />
            </Route>
          </Route>

          {/* 404 Page - With navbar/footer */}
          <Route element={<Layout />}>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </DebugAuth>
    </BrowserRouter>
  );
}

export default App;
