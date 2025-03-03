'use client';

import { useState, useEffect } from 'react';
import { IDigitalBox, BoxStatus } from '@/libs/types/user';
import toast from 'react-hot-toast';

interface BoxHistoryProps {
  initialPage?: number;
}

interface PaginationData {
  total: number;
  pages: number;
  currentPage: number;
  perPage: number;
}

export function BoxHistory({ initialPage = 1 }: BoxHistoryProps) {
  const [boxes, setBoxes] = useState<IDigitalBox[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    pages: 0,
    currentPage: initialPage,
    perPage: 10
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchBoxes = async (page: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/boxes/history?page=${page}`);
      if (!response.ok) throw new Error('Error fetching boxes');
      const data = await response.json();
      setBoxes(data.boxes);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar el historial');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBoxes(initialPage);
  }, [initialPage]);

  const getStatusBadge = (status: BoxStatus) => {
    const badges = {
      [BoxStatus.PENDING]: 'badge-primary',
      [BoxStatus.DELIVERED]: 'badge-success',
      [BoxStatus.OPENED]: 'badge-info',
      [BoxStatus.COMPLETED]: 'badge-secondary'
    };
    return `badge ${badges[status] || 'badge-ghost'}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!boxes.length) {
    return (
      <div className="text-center py-8">
        <p className="text-base-content/70">No hay cajas anteriores para mostrar</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {boxes.map((box) => (
          <div key={box._id} className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <div className="flex justify-between items-center">
                <h4 className="card-title text-lg">
                  {new Date(box.month).toLocaleString('es', { 
                    month: 'long',
                    year: 'numeric'
                  })}
                </h4>
                <span className={getStatusBadge(box.status)}>
                  {box.status.charAt(0).toUpperCase() + box.status.slice(1)}
                </span>
              </div>
              
              <div className="mt-2">
                <p className="text-sm text-base-content/70">
                  Contenido: {box.content.length} elementos
                </p>
                <p className="text-sm text-base-content/70">
                  Entregada: {new Date(box.deliveredAt).toLocaleDateString()}
                </p>
                {box.openedAt && (
                  <p className="text-sm text-base-content/70">
                    Abierta: {new Date(box.openedAt).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className="card-actions justify-end mt-4">
                <button className="btn btn-sm">
                  Ver Detalles
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => fetchBoxes(page)}
              className={`btn btn-sm ${
                page === pagination.currentPage
                  ? 'btn-primary'
                  : 'btn-ghost'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 