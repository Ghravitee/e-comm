// pages/admin/products.tsx
import { AdminProductForm } from "../components/AdminProductForm";
import { AdminProductList } from "../components/AdminProductList";
import { useAdminProfile } from "../../profiles/hooks/useAdminProfile";

export const AdminProductsPage = () => {
  const { loading } = useAdminProfile();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B88E2F]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Product Management</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <AdminProductForm />
          </div>
          <div>
            <AdminProductList />
          </div>
        </div>
      </div>
    </div>
  );
};
