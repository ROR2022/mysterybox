import { auth } from "@/auth";
import { getUserByEmail, addUserPoints } from "@/libs/utils/user";
import { NextResponse } from "next/server";
import { IUser } from "@/libs/models/user";
import { BoxStatus } from "@/libs/types/user";
import mongoose from "mongoose";
import { DigitalBox } from "@/libs/models/box";

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

    const { boxId } = await request.json();

    if (!boxId) {
      return new NextResponse('Box ID is required', { status: 400 });
    }

    // Buscar y actualizar la caja digital
    const box = await DigitalBox.findOne({
      _id: boxId,
      userId: user._id,
      status: BoxStatus.PENDING
    });

    if (!box) {
      return new NextResponse('Box not found or already opened', { status: 404 });
    }

    // Actualizar el estado de la caja
    box.status = BoxStatus.OPENED;
    box.openedAt = new Date();
    await box.save();

    // Calcular y otorgar puntos por abrir la caja
    const openingPoints = 50; // Puntos base por abrir la caja
    await addUserPoints(user._id.toString(), openingPoints);

    // Convertir las fechas a strings para la respuesta
    const safeBox = {
      ...box.toObject(),
      month: box.month.toISOString(),
      deliveredAt: box.deliveredAt.toISOString(),
      openedAt: box.openedAt?.toISOString(),
      completedAt: box.completedAt?.toISOString(),
      createdAt: box.createdAt?.toISOString(),
      updatedAt: box.updatedAt?.toISOString(),
    };

    return NextResponse.json({ 
      box: safeBox,
      pointsEarned: openingPoints
    });
  } catch (error) {
    console.error('Error opening box:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 