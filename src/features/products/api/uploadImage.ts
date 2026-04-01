// features/products/api/uploadImage.ts
import { supabase } from "../../../services/supabase/client";
import { devLog, devError } from "../../../shared/utils/logger";

export const uploadProductImage = async (file: File): Promise<string> => {
  console.log("uploadProductImage API called with:", file.name);

  try {
    // Create a unique file name
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `product-images/${fileName}`;
    devLog("Attempting to upload to:", filePath);
    devLog("File details:", {
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
      devError("Supabase storage error:", uploadError);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    devLog("Upload successful:", uploadData);

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

// With the randomized filename above, duplicates are already impossible —
// so this is fine. But it's worth understanding: upsert: true would
//  overwrite an existing file at the same path. Since every filename
// is unique, the setting doesn't matter here either way.
