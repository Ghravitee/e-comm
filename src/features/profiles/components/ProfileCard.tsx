import type { Profile } from "../types";

export const ProfileCard = ({ profile }: { profile: Profile }) => {
  return (
    <div className="bg-white shadow rounded p-4 flex items-center gap-4">
      <img
        src={profile.avatar_url ?? "/default-avatar.png"}
        alt={profile.full_name ?? "User avatar"}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div>
        <h3 className="font-bold">{profile.full_name ?? "No name"}</h3>
        <p className="text-sm text-gray-500">{profile.email}</p>
        {profile.is_admin && (
          <span className="text-xs text-green-600">Admin</span>
        )}
      </div>
    </div>
  );
};
