import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, User, ArrowRight, Info } from "lucide-react";
import { useCompleteProfile } from "../hooks/useCompleteProfile";
import type { Profile } from "../types";

type Props = {
  profile: Profile | null;
};

export const ProfileForm = ({ profile }: Props) => {
  const navigate = useNavigate();
  const completeProfileMutation = useCompleteProfile();

  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    profile?.avatar_url || null,
  );

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAvatar(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updates: { full_Name?: string; avatar?: File } = {};

    if (fullName.trim() !== (profile?.full_name || "")) {
      updates.full_Name = fullName.trim();
    }

    if (avatar) {
      updates.avatar = avatar;
    }

    if (Object.keys(updates).length > 0) {
      await completeProfileMutation.mutateAsync({
        full_name: updates.full_Name || fullName,
        ...(updates.avatar && { avatar: updates.avatar }),
      });
    }

    navigate("/");
  };

  const isPending = completeProfileMutation.isPending;

  const hasChanges =
    fullName.trim() !== (profile?.full_name || "") || avatar !== null;

  const isProfileComplete =
    Boolean(profile?.full_name) && Boolean(profile?.avatar_url);
  const shouldDisable =
    isPending || !fullName.trim() || (!hasChanges && isProfileComplete);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {profile?.full_name
              ? "Update Your Profile"
              : "Complete Your Profile"}
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            {profile?.full_name
              ? "You can update your information below"
              : "Tell us a bit about yourself to get started"}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                </div>

                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-[#9f7828] transition-colors shadow-md"
                >
                  <Upload size={16} />
                </label>

                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              <p className="mt-2 text-xs text-gray-500">
                Click to {profile?.avatar_url ? "change" : "upload"} your
                profile picture
              </p>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={shouldDisable}
              className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-[#9f7828] transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <span>
                {isPending
                  ? "Saving..."
                  : hasChanges
                    ? "Update Profile"
                    : "Profile Complete"}
                const isProfileComplete
              </span>

              {!isPending && hasChanges && <ArrowRight size={18} />}
            </button>
          </form>
        </div>

        {profile?.full_name && (
          <div className="mt-4 flex items-start space-x-2 text-xs text-gray-500 bg-gray-100 p-3 rounded-lg">
            <Info size={14} className="shrink-0 mt-0.5" />
            <p>
              Your name helps other artisans recognize you. You can change it
              anytime.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
