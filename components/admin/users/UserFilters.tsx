'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { SubscriptionPlan } from '@/libs/types/user';

interface UserFiltersProps {
  currentSearch?: string;
  currentSubscription?: string;
}

export default function UserFilters({
  currentSearch,
  currentSubscription,
}: UserFiltersProps) {
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
    
    router.push(`/admin/users?${params.toString()}`);
  };

  return (
    <div className="bg-base-200 p-4 rounded-lg mb-6">
      <div className="flex flex-wrap gap-4">
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Buscar</span>
          </label>
          <input
            type="text"
            placeholder="Nombre o email..."
            className="input input-bordered w-full"
            value={currentSearch || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Suscripción</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={currentSubscription || ''}
            onChange={(e) => handleFilterChange('subscription', e.target.value)}
          >
            <option value="">Todas</option>
            {Object.values(SubscriptionPlan).map((plan) => (
              <option key={plan} value={plan}>
                {plan.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
} 