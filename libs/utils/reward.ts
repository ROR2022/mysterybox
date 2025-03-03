import { Reward, UserReward } from '@/libs/models/reward';
import { IReward, IUserReward } from '@/libs/types/reward';
//import mongoose from 'mongoose';

export async function getAllRewards(
  page: number = 1,
  limit: number = 10,
  activeOnly: boolean = true
): Promise<{ rewards: IReward[]; total: number; pages: number }> {
  const query = activeOnly ? { active: true } : {};
  const skip = (page - 1) * limit;

  const [rewards, total] = await Promise.all([
    Reward.find(query)
      .sort({ pointsCost: 1 })
      .skip(skip)
      .limit(limit),
    Reward.countDocuments(query)
  ]);

  return {
    rewards,
    total,
    pages: Math.ceil(total / limit)
  };
}

export async function getRewardById(id: string): Promise<IReward | null> {
  return await Reward.findById(id);
}

export async function getUserRewards(
  userId: string,
  page: number = 1,
  limit: number = 10
): Promise<{ userRewards: IUserReward[]; total: number; pages: number }> {
  const skip = (page - 1) * limit;

  const [userRewards, total] = await Promise.all([
    UserReward.find({ userId })
      .sort({ redeemedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('rewardId'),
    UserReward.countDocuments({ userId })
  ]);

  return {
    userRewards,
    total,
    pages: Math.ceil(total / limit)
  };
}

export async function canUserRedeemReward(
  userId: string,
  rewardId: string
): Promise<{ canRedeem: boolean; reason?: string }> {
  const reward = await Reward.findById(rewardId);
  
  if (!reward) {
    return { canRedeem: false, reason: 'Recompensa no encontrada' };
  }

  if (!reward.active) {
    return { canRedeem: false, reason: 'Recompensa no disponible' };
  }

  if (reward.expiresAt && reward.expiresAt < new Date()) {
    return { canRedeem: false, reason: 'Recompensa expirada' };
  }

  // Verificar límite global de canjes
  if (reward.maxRedemptions) {
    const totalRedemptions = await UserReward.countDocuments({ rewardId });
    if (totalRedemptions >= reward.maxRedemptions) {
      return { canRedeem: false, reason: 'Límite de canjes alcanzado' };
    }
  }

  // Verificar límite de canjes por usuario
  if (reward.userMaxRedemptions) {
    const userRedemptions = await UserReward.countDocuments({ userId, rewardId });
    if (userRedemptions >= reward.userMaxRedemptions) {
      return { canRedeem: false, reason: 'Ya has canjeado esta recompensa el máximo número de veces permitido' };
    }
  }

  return { canRedeem: true };
}

export async function redeemReward(
  userId: string,
  rewardId: string
): Promise<IUserReward | null> {
  const { canRedeem, reason } = await canUserRedeemReward(userId, rewardId);
  
  if (!canRedeem) {
    throw new Error(reason);
  }

  const reward = await Reward.findById(rewardId);
  if (!reward) {
    throw new Error('Recompensa no encontrada');
  }

  // Calcular fecha de expiración si la recompensa tiene duración
  const expiresAt = reward.duration 
    ? new Date(Date.now() + reward.duration * 24 * 60 * 60 * 1000)
    : undefined;

  const userReward = await UserReward.create({
    userId,
    rewardId,
    expiresAt
  });

  return userReward;
}

export async function useReward(
  userId: string,
  userRewardId: string
): Promise<IUserReward | null> {
  const userReward = await UserReward.findOne({
    _id: userRewardId,
    userId,
    used: false
  });

  if (!userReward) {
    throw new Error('Recompensa no encontrada o ya utilizada');
  }

  if (userReward.expiresAt && userReward.expiresAt < new Date()) {
    throw new Error('Recompensa expirada');
  }

  userReward.used = true;
  userReward.usedAt = new Date();
  await userReward.save();

  return userReward;
}

export async function createReward(data: Partial<IReward>): Promise<IReward | null> {
  return await Reward.create({
    ...data,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

export async function updateReward(id: string, data: Partial<IReward>): Promise<IReward | null> {
  return await Reward.findByIdAndUpdate(
    id,
    {
      ...data,
      updatedAt: new Date()
    },
    { new: true }
  );
}

export async function deleteReward(id: string): Promise<boolean> {
  const result = await Reward.deleteOne({ _id: id });
  return result.deletedCount === 1;
}

export async function toggleRewardStatus(id: string): Promise<IReward | null> {
  const reward = await Reward.findById(id);
  if (!reward) return null;

  reward.active = !reward.active;
  reward.updatedAt = new Date();
  await reward.save();

  return reward;
} 