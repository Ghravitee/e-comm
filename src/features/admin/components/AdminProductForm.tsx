/* eslint-disable @typescript-eslint/no-explicit-any */
// features/products/components/AdminProductForm.tsx
import React, { useState } from "react";
import { useCreateProduct } from "../../products/hooks/useCreateProduct";
import { useUploadImage } from "../../products/hooks/useUploadImage";
import { Upload, X, Loader2 } from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";
import toast from "react-hot-toast";

// Category options for the store
const CATEGORIES = [
  {
    value: "living-room",
    label: "Living Room",
    description: "Sofas, coffee tables, entertainment centers",
  },
  {
    value: "dining",
    label: "Dining Room",
    description: "Dining tables, chairs, dinnerware",
  },
  {
    value: "bedroom",
    label: "Bedroom",
    description: "Beds, mattresses, pillows, bedding",
  },
  {
    value: "accessories",
    label: "Accessories",
    description: "Lamps, vases, mirrors, decor",
  },
];

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

    // Show loading toast
    const loadingToast = toast.loading("Creating product...", {
      position: "top-right",
    });

    try {
      // 1. Upload image if selected
      let imageUrl = "";
      if (imageFile) {
        console.log("Uploading image...", imageFile.name);
        try {
          const uploadedUrl = await uploadImage.mutateAsync(imageFile);
          console.log("Image uploaded successfully:", uploadedUrl);
          imageUrl = uploadedUrl;

          // Update loading toast
          toast.loading("Image uploaded, creating product...", {
            id: loadingToast,
            position: "top-right",
          });
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          toast.error(
            "Image upload failed. Product will be created without image.",
            {
              id: loadingToast,
              duration: 4000,
              position: "top-right",
            },
          );
          imageUrl = "";
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

      await createProduct.mutateAsync({
        name,
        price: parseFloat(price),
        description,
        category,
        image: imageUrl,
      });
      console.log("Product created successfully");

      // 3. Reset form
      setName("");
      setPrice("");
      setDescription("");
      setCategory("");
      setImageFile(null);
      setImagePreview(null);

      // Show success toast
      toast.success("Product created successfully!", {
        id: loadingToast,
        duration: 4000,
        position: "top-right",
      });
    } catch (error: any) {
      console.error("Failed to create product:", error);

      // Show error toast
      let errorMessage = "Failed to create product. Please try again.";
      if (error.message?.includes("permission")) {
        errorMessage = "You don't have permission to create products.";
      } else if (error.message?.includes("network")) {
        errorMessage = "Network error. Please check your connection.";
      }

      toast.error(errorMessage, {
        id: loadingToast,
        duration: 5000,
        position: "top-right",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get category display name
  const getCategoryLabel = (value: string) => {
    return CATEGORIES.find((c) => c.value === value)?.label || value;
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
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-primary hover:file:bg-primary/20 cursor-pointer"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Select a category</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label} - {cat.description}
            </option>
          ))}
        </select>
        {category && (
          <p className="mt-1 text-xs text-gray-500">
            Selected: {getCategoryLabel(category)}
          </p>
        )}
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Describe your product in detail..."
        />
      </div>

      {/* Submit Button with Spinner */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/80 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Creating Product...
          </>
        ) : (
          "Create Product"
        )}
      </button>
    </form>
  );
};
