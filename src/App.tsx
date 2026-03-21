// App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { ProductPage } from "./pages/ProductPage";
import { ScrollToTop } from "./app/router/ScrollToTop";
import { Layout } from "./shared/components/Layout";
import { ProtectedRoute } from "./app/router/ProtectedRoute";
import { AdminRoute } from "./app/router/AdminRoute";
import { Checkout } from "./pages/Checkout";
import { SignUp } from "./pages/SignUp";
import { SignIn } from "./pages/SignIn";
import { NotFound } from "./pages/NotFound";
import { useCartPersistence } from "./features/cart/hooks/useCartPersistence";
import { AdminProductsPage } from "./pages/admin/AdminProductsPage";
import { DebugAuth } from "./shared/components/DebugAuth";
import { CompleteProfile } from "./pages/CompleteProfile";
import Shop from "./pages/Shop";

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
              <Route path="/products/:id" element={<ProductPage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <AdminProductsPage />
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
