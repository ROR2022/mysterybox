'use client';

import { Box } from "@/types/box";
import { BoxStatus } from "@/libs/types/user";
import { formatDate } from "@/utils/dates";

interface BoxTableProps {
  boxes: Box[];
  isLoading?: boolean;
  onStatusChange?: (boxId: string, newStatus: BoxStatus) => void;
  onViewDetails?: (boxId: string) => void;
}

export function BoxTable({
  boxes,
  isLoading = false,
  onStatusChange,
  onViewDetails
}: BoxTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!boxes?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-base-content/70">No hay cajas disponibles</p>
      </div>
    );
  }

  const getStatusLabel = (status: BoxStatus) => {
    const labels = {
      [BoxStatus.PENDING]: 'Pendiente',
      [BoxStatus.DELIVERED]: 'Entregada',
      [BoxStatus.OPENED]: 'Abierta',
      [BoxStatus.COMPLETED]: 'Completada'
    };
    return labels[status];
  };

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Estado</th>
            <th>Mes</th>
            <th>Fecha de Entrega</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {boxes.map((box) => (
            <tr key={box._id}>
              <td>{box._id}</td>
              <td>{box.userEmail}</td>
              <td>
                <select
                  className="select select-bordered select-sm w-full max-w-xs"
                  value={box.status}
                  onChange={(e) => onStatusChange?.(box._id, e.target.value as BoxStatus)}
                >
                  {Object.values(BoxStatus).map(status => (
                    <option key={status} value={status}>
                      {getStatusLabel(status)}
                    </option>
                  ))}
                </select>
              </td>
              <td>{formatDate(box.month)}</td>
              <td>{formatDate(box.deliveredAt)}</td>
              <td>
                <button
                  className="btn btn-sm btn-ghost"
                  onClick={() => onViewDetails?.(box._id)}
                >
                  Ver detalles
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 