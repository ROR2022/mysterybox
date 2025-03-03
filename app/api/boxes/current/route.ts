import { auth } from "@/auth";
import { getUserByEmail } from "@/libs/utils/user";
import { NextResponse } from "next/server";
import { IUser } from "@/libs/models/user";
import mongoose from "mongoose";
import { DigitalBox } from "@/libs/models/box";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await getUserByEmail(session.user.email) as (IUser & { _id: mongoose.Types.ObjectId }) | null;
    
    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Obtener el mes actual
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Buscar la caja digital del mes actual
    const currentBox = await DigitalBox.findOne({
      userId: user._id,
      month: {
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    });

    if (!currentBox) {
      return NextResponse.json({ box: null });
    }

    // Convertir las fechas a strings para evitar problemas de serialización
    const safeBox = {
      ...currentBox.toObject(),
      month: currentBox.month.toISOString(),
      deliveredAt: currentBox.deliveredAt.toISOString(),
      openedAt: currentBox.openedAt?.toISOString(),
      completedAt: currentBox.completedAt?.toISOString(),
      createdAt: currentBox.createdAt?.toISOString(),
      updatedAt: currentBox.updatedAt?.toISOString(),
    };

    return NextResponse.json({ box: safeBox });
  } catch (error) {
    console.error('Error getting current box:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 