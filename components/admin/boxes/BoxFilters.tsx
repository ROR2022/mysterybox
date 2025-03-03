'use client';

import { BoxStatus } from "@/libs/types/user";

interface BoxFiltersProps {
  onFilterChange: (filters: BoxFilters) => void;
  filters: BoxFilters;
}

export interface BoxFilters {
  status?: BoxStatus;
  dateFrom?: string;
  dateTo?: string;
  userId?: string;
}

export function BoxFilters({ onFilterChange, filters }: BoxFiltersProps) {
  const handleChange = (name: keyof BoxFilters, value: string) => {
    onFilterChange({
      ...filters,
      [name]: value || undefined
    });
  };

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Estado</span>
        </label>
        <select
          className="select select-bordered w-full"
          value={filters.status || ''}
          onChange={(e) => handleChange('status', e.target.value)}
        >
          <option value="">Todos</option>
          {Object.values(BoxStatus).map(status => (
            <option key={status} value={status}>
              {getStatusLabel(status)}
            </option>
          ))}
        </select>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Fecha desde</span>
        </label>
        <input
          type="date"
          className="input input-bordered w-full"
          value={filters.dateFrom || ''}
          onChange={(e) => handleChange('dateFrom', e.target.value)}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Fecha hasta</span>
        </label>
        <input
          type="date"
          className="input input-bordered w-full"
          value={filters.dateTo || ''}
          onChange={(e) => handleChange('dateTo', e.target.value)}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">ID Usuario</span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={filters.userId || ''}
          onChange={(e) => handleChange('userId', e.target.value)}
          placeholder="Buscar por ID de usuario"
        />
      </div>
    </div>
  );
} 