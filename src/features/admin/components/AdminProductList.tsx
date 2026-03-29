// features/products/components/AdminProductList.tsx
import React, { useState } from "react";
import { useProducts } from "../../products/hooks/useProducts";
import { useDeleteProduct } from "../../products/hooks/useDeleteProduct";
import { useUpdateProduct } from "../../products/hooks/useUpdateProduct";
import { useUploadImage } from "../../products/hooks/useUploadImage";
import { Edit, Trash2 } from "lucide-react";
import type { Product } from "../../products/types";

export const AdminProductList = () => {
  const { data: products, isLoading, error } = useProducts();
  const deleteProduct = useDeleteProduct();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-red-500 text-center">Error loading products</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">
        Manage Products ({products?.length || 0})
      </h2>

      <div className="space-y-4 max-h-150 overflow-y-auto pr-2">
        {products?.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg p-4 hover:shadow-md transition"
          >
            {editingProduct?.id === product.id ? (
              <EditProductForm
                product={product}
                onCancel={() => setEditingProduct(null)}
                onSaved={() => setEditingProduct(null)}
              />
            ) : (
              <div className="flex gap-4">
                {/* Product Image */}
                <div className="w-20 h-20 shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <p className="font-semibold mt-1 mb-3 text-sm text-gray-700">
                      &#8358;{product.price.toLocaleString()}
                    </p>
                    <span className="text-sm text-gray-500">
                      Category: {product.category}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-start gap-2">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Edit product"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          `Are you sure you want to delete "${product.name}"?`,
                        )
                      ) {
                        deleteProduct.mutate(product.id);
                      }
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete product"
                    disabled={deleteProduct.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {products?.length === 0 && (
          <p className="text-gray-500 text-center py-8">
            No products found. Add your first product!
          </p>
        )}
      </div>
    </div>
  );
};

// Edit Product Form Component
const EditProductForm = ({
  product,
  onCancel,
  onSaved,
}: {
  product: Product;
  onCancel: () => void;
  onSaved: () => void;
}) => {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price.toString());
  const [description, setDescription] = useState(product.description || "");
  const [category, setCategory] = useState(product.category || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateProduct = useUpdateProduct();
  const uploadImage = useUploadImage();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = product.image; // Keep existing image by default

      // Upload new image if selected
      if (imageFile) {
        imageUrl = await uploadImage.mutateAsync(imageFile);
      }

      // Update product
      await updateProduct.mutateAsync({
        id: product.id,
        name,
        price: parseFloat(price),
        description,
        category,
        image: imageUrl,
      });

      onSaved();
    } catch (error) {
      console.error("Failed to update product:", error);
      alert("Failed to update product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Image
        </label>
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 shrink-0 bg-gray-100 rounded-lg overflow-hidden">
            {imagePreview || product.image ? (
              <img
                src={imagePreview || product.image || ""}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
          </div>
          <div className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
            {imageFile && (
              <p className="text-xs text-gray-500 mt-1">
                New image will be uploaded
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Product Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Price and Category Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price (&#8358;)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select category</option>
            <option value="living-room">Living Room</option>
            <option value="dining">Dining</option>
            <option value="bedroom">Bedroom</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
};
