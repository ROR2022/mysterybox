'use server';

import { auth } from "@/auth";
import { getUserByEmail, updateUserInterests, updateUserProfile, updateUserNotifications } from "@/libs/utils/user";
import { InterestCategory, type IUser } from "@/libs/models/user";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";

export async function updateInterests(interests: InterestCategory[]) {
  const session = await auth();
  
  if (!session?.user?.email) {
    throw new Error('No autorizado');
  }

  const user = await getUserByEmail(session.user.email) as IUser & { _id: mongoose.Types.ObjectId };
  
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  await updateUserInterests(user._id.toString(), interests);
  revalidatePath('/profile');
}

export async function updateProfile(profile: IUser['profile']) {
  const session = await auth();
  
  if (!session?.user?.email) {
    throw new Error('No autorizado');
  }

  const user = await getUserByEmail(session.user.email) as IUser & { _id: mongoose.Types.ObjectId };
  
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  await updateUserProfile(user._id.toString(), profile);
  revalidatePath('/profile');
}

export async function updateNotifications(notifications: IUser['notifications']) {
  const session = await auth();
  
  if (!session?.user?.email) {
    throw new Error('No autorizado');
  }

  const user = await getUserByEmail(session.user.email) as IUser & { _id: mongoose.Types.ObjectId };
  
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  await updateUserNotifications(user._id.toString(), notifications);
  revalidatePath('/profile');
} 