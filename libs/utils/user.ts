import { User, IUser, InterestCategory } from '../models/user';
import dbConnect from '../mongoose';

export async function getUserByEmail(email: string): Promise<IUser | null> {
  try {
    await dbConnect();
    return await User.findOne({ email });
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
}

export async function updateUserInterests(
  userId: string,
  interests: InterestCategory[]
): Promise<IUser | null> {
  try {
    await dbConnect();
    return await User.findByIdAndUpdate(
      userId,
      { $set: { interests } },
      { new: true }
    );
  } catch (error) {
    console.error('Error updating user interests:', error);
    return null;
  }
}

export async function updateUserProfile(
  userId: string,
  profile: Partial<IUser['profile']>
): Promise<IUser | null> {
  try {
    await dbConnect();
    return await User.findByIdAndUpdate(
      userId,
      { $set: { profile } },
      { new: true }
    );
  } catch (error) {
    console.error('Error updating user profile:', error);
    return null;
  }
}

export async function updateUserSubscription(
  userId: string,
  subscription: Partial<IUser['subscription']>
): Promise<IUser | null> {
  try {
    await dbConnect();
    return await User.findByIdAndUpdate(
      userId,
      { $set: { subscription } },
      { new: true }
    );
  } catch (error) {
    console.error('Error updating user subscription:', error);
    return null;
  }
}

export async function addUserPoints(
  userId: string,
  points: number
): Promise<IUser | null> {
  try {
    await dbConnect();
    return await User.findByIdAndUpdate(
      userId,
      { $inc: { points } },
      { new: true }
    );
  } catch (error) {
    console.error('Error adding user points:', error);
    return null;
  }
}

export async function updateUserNotifications(
  userId: string,
  notifications: IUser['notifications']
): Promise<IUser | null> {
  try {
    await dbConnect();
    return await User.findByIdAndUpdate(
      userId,
      { $set: { notifications } },
      { new: true }
    );
  } catch (error) {
    console.error('Error updating user notifications:', error);
    return null;
  }
} 