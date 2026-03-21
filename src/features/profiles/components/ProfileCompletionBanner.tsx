// features/profile/components/ProfileCompletionBanner.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthProvider";
import { useProfile } from "../hooks/useProfile"; // Import useProfile
import { X } from "lucide-react";

export const ProfileCompletionBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { user } = useAuth();
  const { profile, loading } = useProfile(); // Get profile data
  const navigate = useNavigate();

  // Don't show if:
  // - User is not logged in
  // - Still loading profile data
  // - Profile is complete (has both full_name and avatar_url)
  // - Banner was dismissed
  if (!user || loading || !isVisible) {
    return null;
  }

  // Check if profile is complete using profile data
  const isProfileComplete = profile?.full_name && profile?.avatar_url;

  if (isProfileComplete) {
    return null;
  }

  return (
    <div className="bg-primary/70 text-white">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-3">
            <p className="text-sm font-medium">
              👋 Welcome! Please complete your profile to get personalized
              recommendations and a better shopping experience.
            </p>
          </div>
          <div className="flex items-center space-x-4 shrink-0">
            <button
              onClick={() => navigate("/complete-profile")}
              className="bg-white text-primary px-4 py-1.5 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors shadow-sm"
            >
              Complete Profile
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="text-white hover:text-gray-100 transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
