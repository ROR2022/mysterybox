import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia', // Usar la versión más reciente de la API
  typescript: true,
});

// Función para obtener los precios de los planes
export async function getSubscriptionPlans() {
  const prices = await stripe.prices.list({
    active: true,
    type: 'recurring',
    expand: ['data.product'],
  });

  return prices.data.sort((a, b) => {
    if (!a.unit_amount || !b.unit_amount) return 0;
    return a.unit_amount - b.unit_amount;
  });
}

// Función para crear o recuperar un cliente de Stripe
async function getOrCreateCustomer(email: string, userId: string) {
  const existingCustomers = await stripe.customers.list({ email });
  
  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0];
  }

  return stripe.customers.create({
    email,
    metadata: {
      userId,
    },
  });
}

// Función para crear una sesión de checkout
export async function createCheckoutSession({
  priceId,
  userId,
  email,
}: {
  priceId: string;
  userId: string;
  email: string;
}) {
  // Obtener o crear el cliente
  const customer = await getOrCreateCustomer(email, userId);

  return stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer: customer.id,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    allow_promotion_codes: true,
    subscription_data: {
      trial_period_days: 7,
      metadata: {
        userId,
      },
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription`,
    metadata: {
      userId,
    },
  });
}

// Función para cancelar una suscripción
export async function cancelSubscription(subscriptionId: string) {
  return stripe.subscriptions.cancel(subscriptionId);
}

// Función para obtener una suscripción
export async function getSubscription(subscriptionId: string) {
  return stripe.subscriptions.retrieve(subscriptionId);
}

// Función para obtener el portal de facturación
export async function createBillingPortalSession(customerId: string) {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  });
} 