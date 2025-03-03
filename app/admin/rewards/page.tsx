import { getAllRewards } from '@/libs/utils/reward';
import { RewardType } from '@/libs/types/reward';
import RewardTable from '@/components/admin/rewards/RewardTable';
import RewardFilters from '@/components/admin/rewards/RewardFilters';

export default async function RewardsManagementPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const type = params.type as RewardType | undefined;
  const active = params.active ? params.active === 'true' : undefined;

  const { rewards, pages } = await getAllRewards(
    page,
    limit,
    active
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Recompensas</h1>
        <a
          href="/admin/rewards/new"
          className="btn btn-primary"
        >
          Crear Nueva Recompensa
        </a>
      </div>

      <RewardFilters
        currentType={type}
        currentActive={active}
      />

      <RewardTable
        rewards={rewards}
        currentPage={page}
        totalPages={pages}
      />
    </div>
  );
} 