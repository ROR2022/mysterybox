import { auth } from "@/auth";
import { getUserByEmail } from "@/libs/utils/user";
import { redirect } from "next/navigation";
import { ProfileContainer } from "@/components/profile/ProfileContainer";

export default async function ProfilePage() {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  const user = await getUserByEmail(session.user.email);

  if (!user) {
    redirect('/auth/signin');
  }

  // Prepare safe data for client component
  const safeUser = {
    name: user.name,
    interests: user.interests,
    profile: {
      bio: user.profile?.bio || undefined,
      location: user.profile?.location || undefined,
      website: user.profile?.website || undefined
    },
    notifications: {
      email: user.notifications?.email ?? true,
      push: user.notifications?.push ?? true
    }
  };

  return <ProfileContainer user={safeUser} />;
} 