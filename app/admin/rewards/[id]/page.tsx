import { getRewardById } from '@/libs/utils/reward';
import RewardForm from '@/components/admin/rewards/RewardForm';
import { notFound } from 'next/navigation';

interface RewardEditPageProps {
  params: {
    id: string;
  };
}

export default async function RewardEditPage({ params }: RewardEditPageProps) {
  const { id } = await params;
  const reward = id !== 'new' ? await getRewardById(id) : null;

  if (id !== 'new' && !reward) {
    notFound();
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        {reward ? 'Editar Recompensa' : 'Crear Nueva Recompensa'}
      </h1>
      <RewardForm initialReward={reward} />
    </div>
  );
} 