import dbConnect from "@/libs/mongoose"
import { User } from "@/libs/models/user"
import { NextResponse } from "next/server"
import { checkAdminAccess } from "@/app/admin/config"
import mongoose from "mongoose"
import { stripe } from "@/libs/stripe"

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await checkAdminAccess();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return new NextResponse("ID de usuario inválido", { status: 400 })
    }

    await dbConnect()

    const data = await request.json()
    const { action } = data

    // Obtener el usuario y verificar que tenga suscripción
    const user = await User.findById(params.id)
    if (!user || !user.subscription?.stripeSubscriptionId) {
      return new NextResponse("Usuario o suscripción no encontrada", { status: 404 })
    }

    let stripeSubscription

    switch (action) {
      case 'cancel':
        // Cancelar la suscripción al final del período
        stripeSubscription = await stripe.subscriptions.update(
          user.subscription.stripeSubscriptionId,
          { cancel_at_period_end: true }
        )
        break

      case 'reactivate':
        // Reactivar una suscripción cancelada
        stripeSubscription = await stripe.subscriptions.update(
          user.subscription.stripeSubscriptionId,
          { cancel_at_period_end: false }
        )
        break

      case 'cancel_immediately':
        // Cancelar la suscripción inmediatamente
        stripeSubscription = await stripe.subscriptions.cancel(
          user.subscription.stripeSubscriptionId
        )
        break

      default:
        return new NextResponse("Acción no válida", { status: 400 })
    }

    // Actualizar el usuario con la información más reciente
    const updateData = {
      'subscription.active': stripeSubscription.status === 'active',
      'subscription.cancelAtPeriodEnd': stripeSubscription.cancel_at_period_end,
      'subscription.currentPeriodEnd': new Date(stripeSubscription.current_period_end * 1000)
    }

    const updatedUser = await User.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true }
    ).select('email name subscription')

    if (!updatedUser) {
      return new NextResponse("Error al actualizar el usuario", { status: 500 })
    }

    return NextResponse.json({
      _id: updatedUser._id,
      userEmail: updatedUser.email,
      userName: updatedUser.name || 'Sin nombre',
      plan: updatedUser.subscription.plan,
      status: updatedUser.subscription.active ? 'ACTIVE' : 
              updatedUser.subscription.cancelAtPeriodEnd ? 'CANCELLED' : 'EXPIRED',
      startDate: updatedUser.subscription.currentPeriodStart,
      endDate: updatedUser.subscription.currentPeriodEnd,
      stripeSubscriptionId: updatedUser.subscription.stripeSubscriptionId,
      stripeCustomerId: updatedUser.subscription.stripeCustomerId
    })
  } catch (error) {
    console.error('Error updating subscription:', error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 