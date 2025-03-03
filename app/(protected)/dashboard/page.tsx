import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserByEmail } from "@/libs/utils/user";
import { IUserSubscription } from "@/libs/types/user";
import { stripe } from "@/libs/stripe";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

interface PageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const session = await auth();
  const params = await searchParams;

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  const user = await getUserByEmail(session.user.email);

  if (!user) {
    redirect("/auth/signin");
  }

  //console.log('dataUser: ', user);
  // Verificar el estado de la sesión de Stripe si existe session_id
  let checkoutSession: { status: string } | undefined;
  if (params.session_id) {
    try {
      const stripeSession = await stripe.checkout.sessions.retrieve(params.session_id);
      if (stripeSession.status) {
        checkoutSession = { status: stripeSession.status };
      }

      // Si la sesión fue exitosa pero aún no vemos la actualización en la BD,
      // podemos mostrar un mensaje de "procesando"
      if (stripeSession.status === "complete" && !user.subscription?.active) {
        return (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">¡Gracias por tu suscripción!</h2>
              <p>Estamos procesando tu pago. Esto puede tomar unos momentos.</p>
              <p>La página se actualizará automáticamente en 5 segundos...</p>
              <meta httpEquiv="refresh" content="5" />
            </div>
          </div>
        );
      }
    } catch (error) {
      console.error("Error al verificar la sesión de Stripe:", error);
    }
  }

  // Serializar los datos de la suscripción
  const safeSubscription: IUserSubscription = {
    plan: user.subscription?.plan || "free",
    active: user.subscription?.active || false,
    stripeCustomerId: user.subscription?.stripeCustomerId,
    stripeSubscriptionId: user.subscription?.stripeSubscriptionId,
    stripePriceId: user.subscription?.stripePriceId,
    cancelAtPeriodEnd: user.subscription?.cancelAtPeriodEnd || false,
    currentPeriodStart: user.subscription?.currentPeriodStart 
      ? new Date(user.subscription.currentPeriodStart).toISOString()
      : undefined,
    currentPeriodEnd: user.subscription?.currentPeriodEnd
      ? new Date(user.subscription.currentPeriodEnd).toISOString()
      : undefined,
  };

  // Preparar los datos para el componente cliente
  const userData = {
    points: user.points || 0,
    interests: user.interests || [],
  };

  return (
    <DashboardContent
      user={userData}
      subscription={safeSubscription}
      checkoutSession={checkoutSession}
    />
  );
}
