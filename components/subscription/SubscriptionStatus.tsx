'use client';

import { useState } from 'react';
import { IUserSubscription } from '@/libs/types/user';
import toast from 'react-hot-toast';

interface SubscriptionStatusProps {
  subscription: IUserSubscription;
}

export function SubscriptionStatus({ subscription }: SubscriptionStatusProps) {
  const [isLoading, setIsLoading] = useState(false);

  //console.log('subscriptionStatus subscription:...', subscription);
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No disponible';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error('Fecha inválida:', dateString);
        return 'Fecha inválida';
      }
      return date.toLocaleDateString('es', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return 'Fecha inválida';
    }
  };

  const handleManageSubscription = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/subscription/create-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Error al acceder al portal de facturación');
      }

      const data = await response.json();
      if (!data?.url) {
        throw new Error('No se recibió la URL del portal');
      }

      window.location.href = data.url;
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Error al acceder al portal de facturación');
    } finally {
      setIsLoading(false);
    }
  };

  if (!subscription.active) {
    return (
      <div className="space-y-4">
        <p className="text-base-content/70">No tienes una suscripción activa</p>
        <button
          onClick={() => window.location.href = '/subscription'}
          className="btn btn-primary btn-sm"
        >
          Ver Planes
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="font-medium">
          Plan {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}
        </p>
        {subscription.currentPeriodEnd && (
          <p className="text-sm text-base-content/70">
            Próxima facturación: {formatDate(subscription.currentPeriodEnd)}
          </p>
        )}
        {subscription.currentPeriodStart && (
          <p className="text-sm text-base-content/70">
            Período actual desde: {formatDate(subscription.currentPeriodStart)}
          </p>
        )}
        {subscription.cancelAtPeriodEnd && subscription.currentPeriodEnd && (
          <p className="text-sm text-error mt-2">
            Tu suscripción se cancelará el {formatDate(subscription.currentPeriodEnd)}
          </p>
        )}
      </div>
      <button
        onClick={handleManageSubscription}
        disabled={isLoading}
        className="btn btn-sm"
      >
        {isLoading ? (
          <>
            <span className="loading loading-spinner"></span>
            Cargando...
          </>
        ) : (
          'Gestionar Suscripción'
        )}
      </button>
    </div>
  );
} 