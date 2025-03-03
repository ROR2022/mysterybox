//import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/libs/stripe';
import { User } from '@/libs/models/user';
import { SubscriptionPlan } from '@/libs/types/user';
import Stripe from 'stripe';

const basicPriceId = process.env.NEXT_PUBLIC_BASIC_PRICE;
const premiumPriceId = process.env.NEXT_PUBLIC_PREMIUM_PRICE;

// Función para mapear los precios de Stripe a planes de suscripción
const PRICE_TO_PLAN = (priceId: string) => {
  if (priceId === basicPriceId) {
    return SubscriptionPlan.BASIC;
  } else if (priceId === premiumPriceId) {
    return SubscriptionPlan.PREMIUM;
  }
};

interface SubscriptionUpdateData {
  'subscription.stripeCustomerId': string;
  'subscription.stripeSubscriptionId': string;
  'subscription.stripePriceId': string;
  'subscription.active': boolean;
  'subscription.cancelAtPeriodEnd': boolean;
  'subscription.currentPeriodStart': Date;
  'subscription.currentPeriodEnd': Date;
  'subscription.plan'?: SubscriptionPlan;
}

async function updateUserSubscription(
  subscription: Stripe.Subscription,
  customerId: string,
  userId?: string
) {
  try {
    // Buscar usuario por userId o customerId
    const query = userId 
      ? { _id: userId }
      : { 'subscription.stripeCustomerId': customerId };

    const updateData: SubscriptionUpdateData = {
      'subscription.stripeCustomerId': customerId,
      'subscription.stripeSubscriptionId': subscription.id,
      'subscription.stripePriceId': subscription.items.data[0].price.id,
      'subscription.active': subscription.status === 'active',
      'subscription.cancelAtPeriodEnd': subscription.cancel_at_period_end,
      'subscription.currentPeriodStart': new Date(subscription.current_period_start * 1000),
      'subscription.currentPeriodEnd': new Date(subscription.current_period_end * 1000),
    };

    console.log('webhook updateData: ', updateData);

    // Si tenemos el price ID, actualizar el plan
    const priceId = subscription.items.data[0].price.id;
    //console.log('data price: ', subscription.items.data[0]);
    //console.log('priceId:', priceId);
    if (PRICE_TO_PLAN(priceId)) {
      updateData['subscription.plan'] = PRICE_TO_PLAN(priceId);
    }

    const user = await User.findOneAndUpdate(
      query,
      { $set: updateData },
      { new: true }
    );

    if (!user) {
      console.error('No se encontró el usuario para actualizar la suscripción:', {
        userId,
        customerId,
        subscriptionId: subscription.id
      });
      return false;
    }

    console.log('Suscripción actualizada para el usuario:', user);
    return true;
  } catch (error) {
    console.error('Error actualizando la suscripción del usuario:', error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.text();
    //const headersList = headers();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return new NextResponse('Missing stripe signature', { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error validando webhook:', errorMessage);
      return new NextResponse(`Webhook Error: ${errorMessage}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session | Stripe.Subscription;

    switch (event.type) {
      case 'checkout.session.completed': {
        const checkoutSession = session as Stripe.Checkout.Session;
        
        if (!checkoutSession.subscription || !checkoutSession.customer) {
          console.error('Sesión de checkout sin subscription o customer:', checkoutSession);
          return new NextResponse('Invalid checkout session', { status: 400 });
        }

        // Obtener los detalles de la suscripción
        const subscription = await stripe.subscriptions.retrieve(
          checkoutSession.subscription as string
        );

        //console.log('checkoutSession.client_reference_id: ', checkoutSession.client_reference_id);

        //console.log('webhook subscription: ', subscription);

        await updateUserSubscription(
          subscription,
          checkoutSession.customer as string,
          checkoutSession.client_reference_id as string
        );
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = session as Stripe.Subscription;
        await updateUserSubscription(
          subscription,
          subscription.customer as string
        );
        break;
      }
    }

    return new NextResponse(null, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error procesando webhook:', errorMessage);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}