// features/products/components/AdminProductForm.tsx
import React, { useState } from "react";
import { useCreateProduct } from "../hooks/useCreateProduct";
import { useUploadImage } from "../hooks/useUploadImage";
import { Upload, X } from "lucide-react";
import { useAuth } from "../../auth/context/AuthProvider";

export const AdminProductForm = () => {
  const { user } = useAuth();
  console.log("Current user:", user);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createProduct = useCreateProduct();
  const uploadImage = useUploadImage();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Image selected:", file.name);
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");
    setIsSubmitting(true);

    try {
      // 1. Upload image if selected
      let imageUrl = null;
      if (imageFile) {
        console.log("Uploading image...", imageFile.name);
        try {
          const uploadedUrl = await uploadImage.mutateAsync(imageFile);
          console.log("Image uploaded successfully:", uploadedUrl);
          imageUrl = uploadedUrl;
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
        }
      }

      // 2. Create product with the image URL
      console.log("Creating product with data:", {
        name,
        price,
        description,
        category,
        imageUrl,
      });
      try {
        await createProduct.mutateAsync({
          name,
          price: parseFloat(price),
          description,
          category,
          image: imageUrl,
        });
        console.log("Product created successfully");
      } catch (createError) {
        console.error("Product creation failed:", createError);
      }

      // 3. Reset form
      setName("");
      setPrice("");
      setDescription("");
      setCategory("");
      setImageFile(null);
      setImagePreview(null);

      alert("Product created successfully!");
    } catch (error) {
      console.error("Failed to create product:", error);
      alert(`Failed to create product: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>

      {/* Image Upload */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Image
        </label>
        <div className="flex items-start gap-4">
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <Upload className="w-8 h-8 text-gray-400" />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-[#B88E2F] hover:file:bg-[#B88E2F]/20 cursor-pointer"
          />
        </div>
      </div>

      {/* Product Name */}
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Product Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B88E2F]"
        />
      </div>

      {/* Price */}
      <div className="mb-4">
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Price (&#8358;)
        </label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          min="0"
          step="0.01"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B88E2F]"
        />
      </div>

      {/* Category */}
      <div className="mb-4">
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B88E2F]"
        >
          <option value="">Select a category</option>
          <option value="furniture">Furniture</option>
          <option value="electronics">Electronics</option>
          <option value="accessories">Accessories</option>
          <option value="clothing">Clothing</option>
        </select>
      </div>

      {/* Description */}
      <div className="mb-6">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B88E2F]"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#B88E2F] text-white py-2 px-4 rounded-md hover:bg-[#B88E2F]/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Creating Product..." : "Create Product"}
      </button>
    </form>
  );
};
