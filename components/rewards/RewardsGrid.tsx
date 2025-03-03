'use client';

import { useState, useEffect } from 'react';
import { RewardCard } from './RewardCard';
import { IReward } from '@/libs/types/reward';
import Pagination from '@/components/common/Pagination';
import toast from 'react-hot-toast';

export function RewardsGrid() {
  const [rewards, setRewards] = useState<IReward[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRewards = async (page: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/rewards?page=${page}`);
      if (!response.ok) throw new Error('Error al cargar las recompensas');
      
      const data = await response.json();
      setRewards(data.rewards);
      setUserPoints(data.userPoints);
      setTotalPages(data.pages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching rewards:', error);
      toast.error('Error al cargar las recompensas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards(1);
  }, []);

  const handleRedeem = async (rewardId: string) => {
    try {
      const response = await fetch('/api/rewards/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rewardId })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      const data = await response.json();
      setUserPoints(data.remainingPoints);
      
      // Recargar las recompensas para actualizar el estado
      fetchRewards(currentPage);
    } catch (error) {
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Recompensas Disponibles</h2>
        <div className="flex items-center gap-2">
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
          <span className="text-xl font-bold">{userPoints} puntos</span>
        </div>
      </div>

      {rewards.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg text-base-content/70">
            No hay recompensas disponibles en este momento.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map((reward) => (
              <RewardCard
                key={reward._id}
                reward={reward}
                userPoints={userPoints}
                onRedeem={handleRedeem}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                baseUrl="/rewards"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
} 