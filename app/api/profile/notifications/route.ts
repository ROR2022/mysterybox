import { auth } from "@/auth";
import { getUserByEmail, updateUserNotifications } from "@/libs/utils/user";
import { IUser } from "@/libs/models/user";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function PUT(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await getUserByEmail(session.user.email) as (IUser & { _id: mongoose.Types.ObjectId }) | null;
    
    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    const { notifications } = await request.json();

    if (
      typeof notifications !== 'object' || 
      notifications === null ||
      typeof notifications.email !== 'boolean' ||
      typeof notifications.push !== 'boolean'
    ) {
      return new NextResponse('Invalid notifications format', { status: 400 });
    }

    const updatedUser = await updateUserNotifications(user._id.toString(), notifications);
    
    if (!updatedUser) {
      return new NextResponse('Failed to update notifications', { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating notifications:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 