import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { ProductPage } from "./pages/ProductPage";
import { ScrollToTop } from "./app/router/ScrollToTop";
import { Layout } from "./shared/components/Layout";
import { ProtectedRoute } from "./shared/components/ProtectedRoute";
import { Checkout } from "./pages/Checkout";
import { SignUp } from "./pages/SignUp";
import { SignIn } from "./pages/SignIn";
import { NotFound } from "./pages/NotFound"; // Import your NotFound component
import { useCartPersistence } from "./features/cart/hooks/useCartPersistence";

function App() {
  useCartPersistence();
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />

          <Route path="/products/:id" element={<ProductPage />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          {/* Catch-all route for 404 pages */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
