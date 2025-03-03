import { auth } from "@/auth";
import { getUserByEmail } from "@/libs/utils/user";
import { NextResponse } from "next/server";
import { IUser } from "@/libs/models/user";
import mongoose from "mongoose";
import { DigitalBox } from "@/libs/models/box";

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

    // Obtener parámetros de paginación de la URL
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Obtener el mes actual para excluirlo del historial
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Buscar las cajas digitales anteriores
    const boxes = await DigitalBox.find({
      userId: user._id,
      month: { $lt: startOfMonth }
    })
    .sort({ month: -1 }) // Ordenar por mes, más reciente primero
    .skip(skip)
    .limit(limit);

    // Obtener el total de cajas para la paginación
    const total = await DigitalBox.countDocuments({
      userId: user._id,
      month: { $lt: startOfMonth }
    });

    // Convertir las fechas a strings para la respuesta
    const safeBoxes = boxes.map(box => ({
      ...box.toObject(),
      month: box.month.toISOString(),
      deliveredAt: box.deliveredAt.toISOString(),
      openedAt: box.openedAt?.toISOString(),
      completedAt: box.completedAt?.toISOString(),
      createdAt: box.createdAt?.toISOString(),
      updatedAt: box.updatedAt?.toISOString(),
    }));

    return NextResponse.json({
      boxes: safeBoxes,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        perPage: limit
      }
    });
  } catch (error) {
    console.error('Error getting boxes history:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 