import { auth } from "@/auth";
import { getUserByEmail } from "@/libs/utils/user";
import { redeemReward, getRewardById } from "@/libs/utils/reward";
import { NextResponse } from "next/server";
import { IUser } from "@/libs/models/user";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await getUserByEmail(session.user.email) as (IUser & { _id: mongoose.Types.ObjectId }) | null;
    
    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    const { rewardId } = await request.json();

    if (!rewardId) {
      return new NextResponse('Reward ID is required', { status: 400 });
    }

    // Verificar que la recompensa existe
    const reward = await getRewardById(rewardId);
    if (!reward) {
      return new NextResponse('Reward not found', { status: 404 });
    }

    // Verificar que el usuario tiene suficientes puntos
    if (user.points < reward.pointsCost) {
      return new NextResponse('Insufficient points', { status: 400 });
    }

    // Intentar canjear la recompensa
    const userReward = await redeemReward(user._id.toString(), rewardId);

    if (!userReward) {
      return new NextResponse('Failed to redeem reward', { status: 500 });
    }

    // Actualizar los puntos del usuario
    user.points -= reward.pointsCost;
    await user.save();

    return NextResponse.json({
      success: true,
      userReward,
      remainingPoints: user.points
    });
  } catch (error) {
    console.error('Error redeeming reward:', error);
    return new NextResponse(
      error instanceof Error ? error.message : 'Internal Server Error',
      { status: 500 }
    );
  }
} 