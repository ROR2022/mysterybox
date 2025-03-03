'use client';

import { formatDate } from "@/utils/dates";
import { SubscriptionPlan } from "@/libs/types/user";
import { useState } from "react";

interface Subscription {
  _id: string;
  userEmail: string;
  userName: string;
  plan: SubscriptionPlan;
  active: boolean;
  cancelAtPeriodEnd: boolean;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  createdAt: string;
  updatedAt: string;
}

interface ModalConfig {
  isOpen: boolean;
  title: string;
  message: string;
  action: 'cancel' | 'reactivate' | 'cancel_immediately';
  subscriptionId: string;
  confirmButtonText: string;
  confirmButtonClass: string;
}

interface SubscriptionTableProps {
  subscriptions: Subscription[];
  isLoading: boolean;
  onAction: (subscriptionId: string, action: 'cancel' | 'reactivate' | 'cancel_immediately') => Promise<void>;
}

export function SubscriptionTable({ subscriptions, isLoading, onAction }: SubscriptionTableProps) {
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    isOpen: false,
    title: '',
    message: '',
    action: 'cancel' as const,
    subscriptionId: '',
    confirmButtonText: '',
    confirmButtonClass: ''
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const getSubscriptionStatus = (subscription: Subscription) => {
    if (!subscription.active) return 'EXPIRED';
    if (subscription.cancelAtPeriodEnd) return 'CANCELLED';
    return 'ACTIVE';
  };

  const getStatusBadge = (subscription: Subscription) => {
    const status = getSubscriptionStatus(subscription);
    switch (status) {
      case 'ACTIVE':
        return <span className="badge badge-success">Activa</span>;
      case 'CANCELLED':
        return <span className="badge badge-warning">Cancelada (fin de periodo)</span>;
      case 'EXPIRED':
        return <span className="badge badge-error">Expirada</span>;
      default:
        return null;
    }
  };

  const getModalConfig = (subscription: Subscription, action: 'cancel' | 'reactivate' | 'cancel_immediately'): ModalConfig => {
    switch (action) {
      case 'cancel':
        return {
          isOpen: false,
          title: 'Cancelar Suscripción',
          message: '¿Estás seguro de que deseas cancelar esta suscripción? Se mantendrá activa hasta el final del período actual.',
          action,
          subscriptionId: subscription._id,
          confirmButtonText: 'Cancelar Suscripción',
          confirmButtonClass: 'btn-warning'
        };
      case 'reactivate':
        return {
          isOpen: false,
          title: 'Reactivar Suscripción',
          message: '¿Deseas reactivar esta suscripción?',
          action,
          subscriptionId: subscription._id,
          confirmButtonText: 'Reactivar',
          confirmButtonClass: 'btn-success'
        };
      case 'cancel_immediately':
        return {
          isOpen: false,
          title: 'Cancelar Inmediatamente',
          message: '¿Estás seguro de que deseas cancelar esta suscripción inmediatamente? El usuario perderá el acceso de inmediato.',
          action,
          subscriptionId: subscription._id,
          confirmButtonText: 'Cancelar Ahora',
          confirmButtonClass: 'btn-error'
        };
    }
  };

  const handleActionClick = (subscription: Subscription, action: 'cancel' | 'reactivate' | 'cancel_immediately') => {
    const config = getModalConfig(subscription, action);
    setModalConfig({ ...config, isOpen: true });
  };

  const handleConfirm = async () => {
    try {
      await onAction(modalConfig.subscriptionId, modalConfig.action);
    } finally {
      setModalConfig(prev => ({ ...prev, isOpen: false }));
    }
  };

  const getAvailableActions = (subscription: Subscription) => {
    if (!subscription.active) {
      return [
        { action: 'reactivate' as const, label: 'Reactivar', className: 'btn-success btn-sm' }
      ];
    }
    
    if (subscription.cancelAtPeriodEnd) {
      return [
        { action: 'reactivate' as const, label: 'Reactivar', className: 'btn-success btn-sm' },
        { action: 'cancel_immediately' as const, label: 'Cancelar ahora', className: 'btn-error btn-sm' }
      ];
    }
    
    return [
      { action: 'cancel' as const, label: 'Cancelar al final del periodo', className: 'btn-warning btn-sm' },
      { action: 'cancel_immediately' as const, label: 'Cancelar ahora', className: 'btn-error btn-sm' }
    ];
  };

  const getPlanBadge = (plan: SubscriptionPlan) => {
    switch (plan) {
      case SubscriptionPlan.BASIC:
        return <span className="badge badge-primary">Básico</span>;
      case SubscriptionPlan.PREMIUM:
        return <span className="badge badge-secondary">Premium</span>;
      default:
        return <span className="badge">Free</span>;
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Plan</th>
              <th>Estado</th>
              <th>Periodo Actual</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((subscription) => (
              <tr key={subscription._id}>
                <td>
                  <div>
                    <div className="font-bold">{subscription.userName}</div>
                    <div className="text-sm opacity-50">{subscription.userEmail}</div>
                  </div>
                </td>
                <td>{getPlanBadge(subscription.plan)}</td>
                <td>{getStatusBadge(subscription)}</td>
                <td>
                  <div className="text-sm space-y-1">
                    <div className="text-base-content/70">
                      Inicio: {formatDate(subscription.currentPeriodStart)}
                    </div>
                    <div className="text-base-content/70">
                      Fin: {formatDate(subscription.currentPeriodEnd)}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="flex gap-2">
                    {getAvailableActions(subscription).map(({ action, label, className }) => (
                      <button
                        key={action}
                        className={`btn ${className}`}
                        onClick={() => handleActionClick(subscription, action)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de confirmación */}
      <dialog className={`modal ${modalConfig.isOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">{modalConfig.title}</h3>
          <p className="py-4">{modalConfig.message}</p>
          <div className="modal-action">
            <button 
              className="btn btn-ghost"
              onClick={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
            >
              Cancelar
            </button>
            <button 
              className={`btn ${modalConfig.confirmButtonClass}`}
              onClick={handleConfirm}
            >
              {modalConfig.confirmButtonText}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}>close</button>
        </form>
      </dialog>
    </>
  );
} 