//import { auth } from "@/auth"
import dbConnect from "@/libs/mongoose"
import { DigitalBox } from "@/libs/models/box"
import { NextResponse } from "next/server"
import { BoxStatus } from "@/libs/types/user"
import { checkAdminAccess } from "@/app/admin/config"
import mongoose from "mongoose"

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
    const status = searchParams.get('status') as BoxStatus | null
    const userId = searchParams.get('userId')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    const query: any = {}

    if (status) {
      query.status = status
    }

    if (userId) {
      query.userId = userId
    }

    if (dateFrom || dateTo) {
      query.deliveredAt = {}
      if (dateFrom) {
        query.deliveredAt.$gte = new Date(dateFrom)
      }
      if (dateTo) {
        query.deliveredAt.$lte = new Date(dateTo)
      }
    }

    const skip = (page - 1) * limit

    const [boxes, total] = await Promise.all([
      DigitalBox.find(query)
        .populate('userId', 'email')
        .sort({ deliveredAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      DigitalBox.countDocuments(query)
    ])

    const transformedBoxes = boxes.map(box => ({
      ...box,
      userEmail: box.userId?.email || 'Email no disponible',
      userId: box.userId?._id || box.userId
    }))

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      boxes: transformedBoxes,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit
      }
    })

  } catch (error) {
    console.error('Error fetching boxes:', error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await checkAdminAccess();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await dbConnect();

    const data = await request.json();
    
    // Validar los datos requeridos
    if (!data.userId || !data.content || !Array.isArray(data.content) || data.content.length === 0) {
      return new NextResponse(
        "Datos inválidos. Se requiere userId y al menos un contenido",
        { status: 400 }
      );
    }

    // Validar que el userId sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(data.userId)) {
      return new NextResponse(
        "ID de usuario inválido",
        { status: 400 }
      );
    }

    // Crear la nueva caja
    const newBox = await DigitalBox.create({
      userId: data.userId,
      month: new Date(data.month),
      content: data.content,
      status: BoxStatus.PENDING,
      deliveredAt: new Date(data.deliveredAt)
    });

    return NextResponse.json(newBox);
  } catch (error) {
    console.error('Error creating box:', error);
    return new NextResponse(
      "Error al crear la caja",
      { status: 500 }
    );
  }
} 