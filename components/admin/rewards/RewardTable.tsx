'use client';

import { useState } from 'react';
import { IReward } from '@/libs/types/reward';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Pagination from '@/components/common/Pagination';

interface RewardTableProps {
  rewards: IReward[];
  currentPage: number;
  totalPages: number;
}

export default function RewardTable({
  rewards,
  currentPage,
  totalPages,
}: RewardTableProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleStatus = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/rewards/${id}/toggle`, {
        method: 'PATCH',
      });

      if (!response.ok) throw new Error('Error al actualizar el estado');

      toast.success('Estado actualizado correctamente');
      // Recargar la página para reflejar los cambios
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar el estado');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta recompensa?')) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/rewards/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar la recompensa');

      toast.success('Recompensa eliminada correctamente');
      // Recargar la página para reflejar los cambios
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al eliminar la recompensa');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Título</th>
            <th>Tipo</th>
            <th>Puntos</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rewards.map((reward) => (
            <tr key={reward._id}>
              <td>{reward.title}</td>
              <td>{reward.type.replace('_', ' ').toUpperCase()}</td>
              <td>{reward.pointsCost}</td>
              <td>
                <button
                  className={`btn btn-xs ${
                    reward.active ? 'btn-success' : 'btn-error'
                  }`}
                  onClick={() => handleToggleStatus(reward._id)}
                  disabled={isLoading}
                >
                  {reward.active ? 'Activo' : 'Inactivo'}
                </button>
              </td>
              <td className="flex gap-2">
                <Link
                  href={`/admin/rewards/${reward._id}`}
                  className="btn btn-xs btn-info"
                >
                  Editar
                </Link>
                <button
                  className="btn btn-xs btn-error"
                  onClick={() => handleDelete(reward._id)}
                  disabled={isLoading}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="p-4 border-t">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl="/admin/rewards"
        />
      </div>
    </div>
  );
} 