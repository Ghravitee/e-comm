import { useProfile } from "../hooks/useProfile";
import { ProfileForm } from "../components/ProfileForm";
import { LoadingScreen } from "../../../shared/components/LoadingScreen";

export const CompleteProfile = () => {
  const { profile, loading } = useProfile();

  if (loading) {
    return <LoadingScreen />;
  }

  // At this point, loading is false, so profile is either Profile or null
  // (undefined is no longer possible since the query has finished)
  return <ProfileForm profile={profile ?? null} />;
};
