// App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";

import { ScrollToTop } from "./app/router/ScrollToTop";
import { Layout } from "./shared/components/Layout";
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

function App() {
  useCartPersistence();

  return (
    <BrowserRouter>
      <ScrollToTop />
      <DebugAuth>
        <Layout>
          <Routes>
            <Route path="/complete-profile" element={<CompleteProfile />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/products/:id" element={<ProductDetailsPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />{" "}
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              {/* Protected */}
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <AdminProductsPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <AdminOrdersPage />
                  </AdminRoute>
                }
              />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </DebugAuth>
    </BrowserRouter>
  );
}

export default App;
