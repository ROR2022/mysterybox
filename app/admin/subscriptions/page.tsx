'use client';

import { useEffect, useState } from "react";
import { SubscriptionTable } from "@/components/admin/subscriptions/SubscriptionTable";
import { SubscriptionPlan } from "@/libs/types/user";
import toast from "react-hot-toast";

interface Subscription {
  _id: string;
  userEmail: string;
  userName: string;
  plan: SubscriptionPlan;
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED';
  startDate: string;
  endDate: string;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  createdAt: string;
  updatedAt: string;
}

interface Filters {
  status?: string;
  plan?: SubscriptionPlan;
  search?: string;
}

export default function SubscriptionsAdminPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({});

  const fetchSubscriptions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.set('status', filters.status);
      if (filters.plan) queryParams.set('plan', filters.plan);
      if (filters.search) queryParams.set('search', filters.search);

      const response = await fetch(`/api/admin/subscriptions?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Error al cargar las suscripciones');
      }

      const data = await response.json();
      setSubscriptions(data.subscriptions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las suscripciones');
      toast.error('Error al cargar las suscripciones');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [filters]);

  const handleAction = async (subscriptionId: string, action: 'cancel' | 'reactivate' | 'cancel_immediately') => {
    try {
      const response = await fetch(`/api/admin/subscriptions/${subscriptionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la suscripción');
      }

      toast.success('Suscripción actualizada correctamente');
      await fetchSubscriptions();
    } catch (err) {
      toast.error('Error al actualizar la suscripción');
      setError(err instanceof Error ? err.message : 'Error al actualizar la suscripción');
    }
  };

  const handleFilterChange = (name: keyof Filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value || undefined
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Administración de Suscripciones</h1>
      </div>
      
      <div className="bg-base-100 shadow-xl rounded-lg">
        <div className="p-4 border-b">
          <div className="flex gap-4 flex-wrap">
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Buscar</span>
              </label>
              <input
                type="text"
                placeholder="Buscar por email o nombre"
                className="input input-bordered w-full"
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Estado</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">Todos</option>
                <option value="active">Activas</option>
                <option value="cancelled">Canceladas</option>
              </select>
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Plan</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={filters.plan || ''}
                onChange={(e) => handleFilterChange('plan', e.target.value as SubscriptionPlan)}
              >
                <option value="">Todos</option>
                <option value="basic">Básico</option>
                <option value="premium">Premium</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}

          <SubscriptionTable
            subscriptions={subscriptions}
            isLoading={isLoading}
            onAction={handleAction}
          />
        </div>
      </div>
    </div>
  );
} 