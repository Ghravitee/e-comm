// features/auth/utils/validation.ts
export const validateEmail = (email: string): string | null => {
  if (!email) return "Email is required";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Please enter a valid email address";

  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";

  // Optional: Add more password requirements
  // if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
  // if (!/[0-9]/.test(password)) return "Password must contain at least one number";

  return null;
};

export const validateFullName = (fullName: string): string | null => {
  if (!fullName) return "Full name is required";
  if (fullName.length < 2) return "Full name must be at least 2 characters";
  if (fullName.length > 50) return "Full name must be less than 50 characters";

  return null;
};

export const validateAvatar = (file: File | null): string | null => {
  if (!file) return null; // Avatar is optional

  // Check file size (max 2MB)
  const maxSize = 2 * 1024 * 1024; // 2MB
  if (file.size > maxSize) return "Avatar must be less than 2MB";

  // Check file type
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return "Avatar must be an image (JPEG, PNG, GIF, or WebP)";
  }

  return null;
};
