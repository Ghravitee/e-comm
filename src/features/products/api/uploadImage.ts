// features/products/api/uploadImage.ts
import { supabase } from "../../../services/supabase/client";

export const uploadProductImage = async (file: File): Promise<string> => {
  console.log("uploadProductImage API called with:", file.name);

  try {
    // Create a unique file name
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `product-images/${fileName}`;

    console.log("Attempting to upload to:", filePath);
    console.log("File details:", {
      size: file.size,
      type: file.type,
      name: file.name,
    });

    // Upload the file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("products")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      console.error("Supabase storage error:", uploadError);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    console.log("Upload successful:", uploadData);

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("products").getPublicUrl(filePath);

    console.log("Generated public URL:", publicUrl);
    return publicUrl;
  } catch (error) {
    console.error("Error in uploadProductImage:", error);
    throw error;
  }
};
