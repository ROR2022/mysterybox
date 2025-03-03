import { auth } from "@/auth";
import { getUserByEmail } from "@/libs/utils/user";
import { IUser } from "@/libs/models/user";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/libs/mongoose";

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const session = await auth();
    
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await getUserByEmail(session.user.email) as (IUser & { _id: mongoose.Types.ObjectId }) | null;
    
    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    const { profile, name } = await request.json();

    if (typeof profile !== 'object' || profile === null) {
      return new NextResponse('Invalid profile format', { status: 400 });
    }

    // Actualizar el perfil y el nombre
    const updateData: { profile: typeof profile; name?: string } = { profile };
    if (name !== undefined) {
      updateData.name = name;
    }

    const updatedUser = await user.updateOne(updateData);
    
    if (!updatedUser.modifiedCount) {
      return new NextResponse('Failed to update profile', { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating profile:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 