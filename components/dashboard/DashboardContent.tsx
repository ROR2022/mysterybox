'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { SubscriptionStatus } from "@/components/subscription/SubscriptionStatus";
import { CurrentBox } from "@/components/box/CurrentBox";
import { BoxHistory } from "@/components/box/BoxHistory";
import { IUserSubscription, IDigitalBox } from "@/libs/types/user";
import toast from "react-hot-toast";

interface DashboardContentProps {
  user: {
    points: number;
    interests: string[];
  };
  subscription: IUserSubscription;
  checkoutSession?: {
    status: string;
  };
}

export function DashboardContent({ user, subscription, checkoutSession }: DashboardContentProps) {
  const [showSuccess, setShowSuccess] = useState(checkoutSession?.status === "complete");
  const [currentBox, setCurrentBox] = useState<IDigitalBox | null>(null);
  const [isLoadingBox, setIsLoadingBox] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userPoints, setUserPoints] = useState(user.points);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  useEffect(() => {
    if (subscription.active) {
      fetchCurrentBox();
    }
  }, [subscription.active]);

  const fetchCurrentBox = async () => {
    try {
      setIsLoadingBox(true);
      const response = await fetch('/api/boxes/current');
      if (!response.ok) {
        throw new Error('Error al cargar la caja actual');
      }
      const data = await response.json();
      setCurrentBox(data.box);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar la caja actual');
    } finally {
      setIsLoadingBox(false);
    }
  };

  const handleOpenBox = async () => {
    if (!currentBox?._id) return;
    try {
      const response = await fetch('/api/boxes/open', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ boxId: currentBox._id }),
      });
      
      if (!response.ok) {
        throw new Error('Error al abrir la caja');
      }

      const data = await response.json();
      setCurrentBox(data.box);
      setUserPoints(prevPoints => prevPoints + data.pointsEarned);
      toast.success(`¡Caja abierta con éxito! Has ganado ${data.pointsEarned} puntos`);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al abrir la caja');
    }
  };

  const handleGenerateTestBox = async () => {
    try {
      setIsGenerating(true);
      const response = await fetch('/api/boxes/generate-test', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Error al generar la caja de prueba');
      }

      await fetchCurrentBox();
      toast.success('Caja de prueba generada con éxito');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al generar la caja de prueba');
    } finally {
      setIsGenerating(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No disponible';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error('Fecha inválida:', dateString);
        return 'No disponible';
      }
      return date.toLocaleDateString('es', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return 'No disponible';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        {process.env.NODE_ENV === 'development' && subscription.active && (
          <button
            onClick={handleGenerateTestBox}
            disabled={isGenerating}
            className="btn btn-secondary btn-sm"
          >
            {isGenerating ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Generando...
              </>
            ) : (
              'Generar Caja de Prueba'
            )}
          </button>
        )}
      </div>

      {/* Mensaje de éxito de suscripción */}
      {showSuccess && (
        <div className="alert alert-success">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>¡Tu suscripción se ha activado correctamente!</span>
        </div>
      )}

      {/* Estado de la cuenta */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Estado de Suscripción</h2>
            <SubscriptionStatus subscription={subscription} />
          </div>
        </div>

        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Puntos Acumulados</h2>
            <p className="text-2xl font-bold">{userPoints} pts</p>
            <div className="card-actions justify-end">
              <button className="btn btn-ghost btn-sm">Ver Recompensas</button>
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Próxima Caja</h2>
            <p>
              {subscription.active && subscription.currentPeriodEnd
                ? `Disponible el ${formatDate(subscription.currentPeriodEnd)}`
                : "Suscríbete para recibir tu primera caja"}
            </p>
            <div className="card-actions justify-end">
              <button className="btn btn-ghost btn-sm">Ver Detalles</button>
            </div>
          </div>
        </div>
      </div>

      {/* Caja Actual */}
      {subscription.active ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Tu Caja Digital</h2>
          {isLoadingBox ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <CurrentBox box={currentBox || undefined} onOpen={handleOpenBox} />
          )}
        </div>
      ) : (
        <div className="alert">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-info shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>Suscríbete para recibir contenido personalizado.</span>
          <Link className="btn btn-sm btn-primary" href="/subscription">
            Ver Planes
          </Link>
        </div>
      )}

      {/* Historial de Cajas */}
      {subscription.active && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Historial de Cajas</h2>
          <BoxHistory />
        </div>
      )}
    </div>
  );
} 