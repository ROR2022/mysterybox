import dbConnect from "@/libs/mongoose"
import { User } from "@/libs/models/user"
import { IUser } from "@/libs/models/user"
import { NextResponse } from "next/server"
import { checkAdminAccess } from "@/app/admin/config"
import { SubscriptionPlan } from "@/libs/types/user"
import mongoose from "mongoose"

interface UserDocument {
  _id: mongoose.Types.ObjectId;
  email: string;
  name?: string;
  subscription: IUser['subscription'];
  createdAt: Date;
  updatedAt: Date;
}

export async function GET(request: Request) {
  try {
    const session = await checkAdminAccess();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    await dbConnect()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const plan = searchParams.get('plan') as SubscriptionPlan | null
    const search = searchParams.get('search')

    const query: any = {
      // Solo usuarios con información de suscripción
      'subscription.stripeSubscriptionId': { $exists: true }
    }

    if (status === 'active') {
      query['subscription.active'] = true
    } else if (status === 'cancelled') {
      query['subscription.active'] = false
    }

    if (plan) {
      query['subscription.plan'] = plan
    }

    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ]
    }

    const skip = (page - 1) * limit

    const [users, total] = await Promise.all([
      User.find(query)
        .select('email name subscription createdAt updatedAt')
        .sort({ 'subscription.currentPeriodEnd': -1 })
        .skip(skip)
        .limit(limit)
        .lean() as unknown as UserDocument[],
      User.countDocuments(query)
    ])

    const transformedSubscriptions = users.map(user => ({
      _id: user._id.toString(),
      userEmail: user.email,
      userName: user.name || 'Sin nombre',
      plan: user.subscription.plan,
      active: user.subscription.active,
      cancelAtPeriodEnd: user.subscription.cancelAtPeriodEnd || false,
      currentPeriodStart: user.subscription.currentPeriodStart,
      currentPeriodEnd: user.subscription.currentPeriodEnd,
      stripeSubscriptionId: user.subscription.stripeSubscriptionId,
      stripeCustomerId: user.subscription.stripeCustomerId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }))

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      subscriptions: transformedSubscriptions,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit
      }
    })

  } catch (error) {
    console.error('Error fetching subscriptions:', error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 