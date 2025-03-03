'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { RewardType } from '@/libs/types/reward';

interface RewardFiltersProps {
  currentType?: RewardType;
  currentActive?: boolean;
}

export default function RewardFilters({
  currentType,
  currentActive,
}: RewardFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    
    // Reset to page 1 when filters change
    params.set('page', '1');
    
    router.push(`/admin/rewards?${params.toString()}`);
  };

  return (
    <div className="bg-base-200 p-4 rounded-lg mb-6">
      <div className="flex flex-wrap gap-4">
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Tipo</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={currentType || ''}
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <option value="">Todos</option>
            {Object.values(RewardType).map((type) => (
              <option key={type} value={type}>
                {type.replace('_', ' ').toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Estado</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={currentActive === undefined ? '' : currentActive.toString()}
            onChange={(e) => handleFilterChange('active', e.target.value)}
          >
            <option value="">Todos</option>
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
        </div>
      </div>
    </div>
  );
} 