import { auth } from "@/auth";
import { getUserByEmail, updateUserInterests } from "@/libs/utils/user";
import { InterestCategory, IUser } from "@/libs/models/user";
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

    const body = await request.json();
    console.log('Received request body:', body);

    const { interests } = body;
    console.log('Extracted interests:', {
      interests,
      type: typeof interests,
      isArray: Array.isArray(interests)
    });

    // Validar que interests sea un array
    if (!Array.isArray(interests)) {
      console.error('Interests validation failed: not an array', interests);
      return new NextResponse('Interests must be an array', { status: 400 });
    }

    // Obtener los valores válidos del enum
    const validInterests = Object.values(InterestCategory);
    console.log('Valid interests:', validInterests);

    // Validar cada interés
    const invalidInterests = interests.filter(i => !validInterests.includes(i));
    if (invalidInterests.length > 0) {
      console.error('Interests validation failed:', {
        invalidInterests,
        validInterests,
        receivedInterests: interests,
        enumValues: Object.entries(InterestCategory).map(([key, value]) => ({ key, value }))
      });
      return new NextResponse(
        `Invalid interests: ${invalidInterests.join(', ')}. Valid values are: ${validInterests.join(', ')}`, 
        { status: 400 }
      );
    }

    console.log('Updating interests for user:', {
      userId: user._id.toString(),
      interests
    });

    const updatedUser = await updateUserInterests(user._id.toString(), interests);
    
    if (!updatedUser) {
      console.error('Failed to update user interests in database');
      return new NextResponse('Failed to update interests', { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating interests:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 