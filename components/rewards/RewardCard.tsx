'use client';

import { IReward } from '@/libs/types/reward';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface RewardCardProps {
  reward: IReward;
  userPoints: number;
  onRedeem: (rewardId: string) => Promise<void>;
}

export function RewardCard({ reward, userPoints, onRedeem }: RewardCardProps) {
  const [isRedeeming, setIsRedeeming] = useState(false);
  const canAfford = userPoints >= reward.pointsCost;

  const handleRedeem = async () => {
    if (!canAfford || isRedeeming) return;

    try {
      setIsRedeeming(true);
      await onRedeem(reward._id);
      toast.success('¡Recompensa canjeada con éxito!');
    } catch (error) {
      console.error('Error redeeming reward:', error);
      toast.error(error instanceof Error ? error.message : 'Error al canjear la recompensa');
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <div className="card bg-base-200 shadow-xl">
      {reward.imageUrl && (
        <figure className="relative w-full h-48 mb-4">
          <Image
            src={reward.imageUrl}
            alt={reward.title}
            fill
            className="object-cover rounded-lg"
          />
        </figure>
      )}
      <div className="card-body">
        <h2 className="card-title">{reward.title}</h2>
        <p className="text-base-content/70">{reward.description}</p>
        
        <div className="flex items-center gap-2 mt-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-warning"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <span className="text-lg font-semibold">{reward.pointsCost} puntos</span>
        </div>

        {reward.expiresAt && (
          <div className="text-sm text-base-content/60 mt-2">
            Expira: {new Date(reward.expiresAt).toLocaleDateString()}
          </div>
        )}

        <div className="card-actions justify-end mt-4">
          <button
            className={`btn btn-primary ${isRedeeming ? 'loading' : ''}`}
            onClick={handleRedeem}
            disabled={!canAfford || isRedeeming}
          >
            {canAfford ? 'Canjear' : 'Puntos insuficientes'}
          </button>
        </div>
      </div>
    </div>
  );
} 