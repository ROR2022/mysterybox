import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAccess } from '@/app/admin/config';
import { User } from '@/libs/models/user';
import { FilterQuery } from 'mongoose';
import dbConnect from '@/libs/mongoose';

export async function GET(request: NextRequest) {
  try {
    await checkAdminAccess();
    await dbConnect(); // Asegurar conexión a la base de datos

    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const search = searchParams.get('search');
    const subscription = searchParams.get('subscription');

    // Construir la query
    const query: FilterQuery<typeof User> = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (subscription) {
      query['subscription.plan'] = subscription;
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-password'),
      User.countDocuments(query)
    ]);

    return NextResponse.json({
      users,
      total,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error getting users:', error);
    return NextResponse.json(
      { error: 'Error al obtener los usuarios' },
      { status: 500 }
    );
  }
} 