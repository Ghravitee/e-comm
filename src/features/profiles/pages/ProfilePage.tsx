// features/profiles/pages/ProfilePage.tsx
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { useProfileStore } from "../store/useProfileStore";
import { Container } from "../../../shared/components/Container";
// import { Breadcrumb } from "../../../shared/components/Breadcrumb";
import {
  User,
  Mail,
  Calendar,
  Camera,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  LogOut,
  Shield,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { signOut } from "../../auth/api/auth";
import { useNavigate } from "react-router-dom";

export const ProfilePage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const {
    profile,
    isLoading,
    isUpdating,
    loadProfile,
    updateProfile,
    removeAvatar,
  } = useProfileStore();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load profile when user is available
  useEffect(() => {
    if (user && !profile) {
      loadProfile(user.id);
    }
  }, [user, profile, loadProfile]);

  // Cleanup avatar preview on unmount
  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrorMessage("Please select an image file");
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrorMessage("Image must be less than 2MB");
        return;
      }

      setAvatarFile(file);
      const preview = URL.createObjectURL(file);
      setAvatarPreview(preview);
      setErrorMessage(null);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!user) return;

    try {
      await removeAvatar(user.id);
      setAvatarFile(null);
      setAvatarPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setSuccessMessage("Avatar removed successfully");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Failed to remove avatar:", error);
      setErrorMessage("Failed to remove avatar");
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  // features/profiles/pages/ProfilePage.tsx (update the handleSubmit function)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setErrorMessage(null);

    try {
      await updateProfile({
        full_name: fullName,
        avatar_file: avatarFile || undefined,
      });

      setIsEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setSuccessMessage("Profile updated successfully");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Failed to update profile:", error);
      setErrorMessage("Failed to update profile");
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFullName(profile?.full_name || "");
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setErrorMessage(null);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (authLoading || isLoading) {
    return (
      <Container>
        <div className="py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container>
        <div className="py-16 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Profile Not Found
          </h2>
          <p className="text-gray-600">
            Unable to load your profile information.
          </p>
        </div>
      </Container>
    );
  }

  const avatarUrl = avatarPreview || profile.avatar_url;
  const memberSince = profile.created_at
    ? format(new Date(profile.created_at), "MMMM yyyy")
    : "Recently";

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container>
        {/* <Breadcrumb /> */}

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-500 mt-1">
              Manage your account information and preferences
            </p>
          </div>

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              {errorMessage}
            </div>
          )}

          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <form onSubmit={handleSubmit}>
              {/* Avatar Section */}
              <div className="p-8 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={profile.full_name || "Profile"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-12 h-12 text-gray-400" />
                      )}
                    </div>

                    {isEditing && (
                      <>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute bottom-0 right-0 p-1.5 bg-primary text-white rounded-full hover:bg-primary/80 transition-colors"
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </>
                    )}
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {profile.full_name || "Set your name"}
                    </h2>
                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{profile.email}</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        Member since {memberSince}
                      </span>
                    </div>
                    {profile.is_admin && (
                      <div className="flex items-center justify-center sm:justify-start gap-1 mt-2">
                        <Shield className="w-4 h-4 text-primary" />
                        <span className="text-xs text-primary font-medium">
                          Administrator
                        </span>
                      </div>
                    )}
                  </div>

                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>

                {isEditing && avatarFile && (
                  <div className="mt-4 flex justify-center sm:justify-start">
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      Remove new avatar
                    </button>
                  </div>
                )}
              </div>

              {/* Profile Details */}
              <div className="p-8 space-y-6">
                {/* Full Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                      {profile?.full_name || "Not set"}
                    </div>
                  )}
                </div>

                {/* Email Field (read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                    {profile.email}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Email cannot be changed. Contact support if you need to
                    update your email.
                  </p>
                </div>

                {/* Account Stats */}
                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Account Statistics
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Account ID</p>
                      <p className="text-sm font-mono text-gray-900 truncate">
                        {profile.id}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Account Type</p>
                      <p className="text-sm font-medium text-gray-900">
                        {profile.is_admin ? "Administrator" : "Customer"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isUpdating ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Save className="w-5 h-5" />
                      )}
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </form>

            {/* Logout Section */}
            <div className="p-8 border-t border-gray-100 bg-gray-50">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
