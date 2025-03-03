import { auth } from "@/auth";
import { createBillingPortalSession } from "@/libs/stripe";
import { getUserByEmail } from "@/libs/utils/user";
import { NextResponse } from "next/server";
import { IUser } from "@/libs/models/user";
import mongoose from "mongoose";

export async function POST() {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await getUserByEmail(session.user.email) as (IUser & { _id: mongoose.Types.ObjectId }) | null;
    
    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    if (!user.subscription) {
      return new NextResponse('No subscription data found', { status: 400 });
    }

    if (!user.subscription.stripeCustomerId) {
      return new NextResponse('No Stripe customer ID found', { status: 400 });
    }

    try {
      const portalSession = await createBillingPortalSession(
        user.subscription.stripeCustomerId
      );

      if (!portalSession?.url) {
        throw new Error('Failed to create portal session');
      }

      return NextResponse.json({ url: portalSession.url });
    } catch (stripeError) {
      console.error('Stripe error:', stripeError);
      return new NextResponse('Error creating billing portal session', { status: 400 });
    }
  } catch (error) {
    console.error('Error creating portal session:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 