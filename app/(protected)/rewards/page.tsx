import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { RewardsGrid } from "@/components/rewards/RewardsGrid";

export default async function RewardsPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <RewardsGrid />
    </div>
  );
} 