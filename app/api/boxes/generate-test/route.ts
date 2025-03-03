import { auth } from "@/auth";
import { getUserByEmail } from "@/libs/utils/user";
import { NextResponse } from "next/server";
import { IUser } from "@/libs/models/user";
import { InterestCategory, BoxStatus, BoxContentType, IBoxContent } from "@/libs/types/user";
import mongoose from "mongoose";
import { DigitalBox } from "@/libs/models/box";

// Solo permitir en desarrollo
const isDevelopment = process.env.NODE_ENV === 'development';

function generateTestContent(interests: string[]): IBoxContent[] {
  const contentTemplates: Record<string, IBoxContent[]> = {
    tecnologia: [
      {
        title: "Curso de Next.js 14",
        description: "Aprende las últimas características de Next.js con ejemplos prácticos",
        category: InterestCategory.TECNOLOGIA,
        type: BoxContentType.CURSO,
        url: "https://example.com/nextjs-course",
        imageUrl: "https://example.com/nextjs.jpg",
        points: 100
      },
      {
        title: "Tutorial de TypeScript",
        description: "Guía completa de TypeScript para desarrollo moderno",
        category: InterestCategory.TECNOLOGIA,
        type: BoxContentType.VIDEO,
        url: "https://example.com/typescript-tutorial",
        points: 50
      }
    ],
    arte: [
      {
        title: "Técnicas de Pintura Digital",
        description: "Aprende las bases de la pintura digital",
        category: InterestCategory.ARTE,
        type: BoxContentType.CURSO,
        url: "https://example.com/digital-painting",
        points: 75
      },
      {
        title: "Recursos de Diseño",
        description: "Colección de herramientas y recursos para artistas",
        category: InterestCategory.ARTE,
        type: BoxContentType.RECURSO,
        url: "https://example.com/design-resources",
        points: 60
      }
    ],
    musica: [
      {
        title: "Producción Musical Básica",
        description: "Introducción a la producción musical digital",
        category: InterestCategory.MUSICA,
        type: BoxContentType.CURSO,
        url: "https://example.com/music-production",
        points: 80
      }
    ],
    gaming: [
      {
        title: "Desarrollo de Videojuegos",
        description: "Introducción al desarrollo de juegos con Unity",
        category: InterestCategory.GAMING,
        type: BoxContentType.CURSO,
        url: "https://example.com/game-dev",
        points: 90
      }
    ]
  };

  // Seleccionar contenido basado en los intereses del usuario
  const selectedContent: IBoxContent[] = [];
  interests.forEach(interest => {
    const content = contentTemplates[interest.toLowerCase()];
    if (content) {
      selectedContent.push(...content);
    }
  });

  // Si no hay intereses o contenido, devolver contenido por defecto
  if (selectedContent.length === 0) {
    return [contentTemplates.tecnologia[0]];
  }

  return selectedContent;
}

export async function POST() {
  if (!isDevelopment) {
    return new NextResponse('This endpoint is only available in development', { status: 403 });
  }

  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await getUserByEmail(session.user.email) as (IUser & { _id: mongoose.Types.ObjectId }) | null;
    
    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Verificar si ya existe una caja para el mes actual
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const existingBox = await DigitalBox.findOne({
      userId: user._id,
      month: {
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    });

    if (existingBox) {
      return new NextResponse('Box already exists for current month', { status: 400 });
    }

    // Generar contenido basado en los intereses del usuario
    const content = generateTestContent(user.interests);

    // Crear nueva caja digital
    const newBox = new DigitalBox({
      userId: user._id,
      month: now,
      content,
      status: BoxStatus.PENDING,
      deliveredAt: now
    });

    await newBox.save();

    // Convertir las fechas a strings para la respuesta
    const safeBox = {
      ...newBox.toObject(),
      month: newBox.month.toISOString(),
      deliveredAt: newBox.deliveredAt.toISOString(),
      createdAt: newBox.createdAt?.toISOString(),
      updatedAt: newBox.updatedAt?.toISOString(),
    };

    return NextResponse.json({ box: safeBox });
  } catch (error) {
    console.error('Error generating test box:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 