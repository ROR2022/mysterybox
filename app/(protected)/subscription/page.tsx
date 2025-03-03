import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getSubscriptionPlans } from "@/libs/stripe";
import { SubscriptionPlans } from "@/components/subscription/SubscriptionPlans";

export default async function SubscriptionPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  const prices = await getSubscriptionPlans();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Planes de Suscripción</h1>
      </div>

      <div className="max-w-4xl mx-auto">
        <SubscriptionPlans prices={prices} userEmail={session.user.email} />
      </div>
    </div>
  );
} 