import { auth } from "@/auth";
import { getUserByEmail } from "@/libs/utils/user";
import { getAllRewards } from "@/libs/utils/reward";
import { NextResponse } from "next/server";
import { IUser } from "@/libs/models/user";
import mongoose from "mongoose";

export async function GET(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await getUserByEmail(session.user.email) as (IUser & { _id: mongoose.Types.ObjectId }) | null;
    
    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Obtener parámetros de la URL
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const activeOnly = searchParams.get('activeOnly') !== 'false';

    const result = await getAllRewards(page, limit, activeOnly);

    // Filtrar recompensas que el usuario puede permitirse
    const affordableRewards = result.rewards.filter(reward => 
      user.points >= reward.pointsCost
    );

    return NextResponse.json({
      rewards: affordableRewards,
      total: result.total,
      pages: result.pages,
      userPoints: user.points
    });
  } catch (error) {
    console.error('Error getting rewards:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 