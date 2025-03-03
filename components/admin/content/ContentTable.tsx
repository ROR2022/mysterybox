'use client';

import { IContent } from '@/libs/types/content';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Pagination from '@/components/common/Pagination';

interface ContentTableProps {
  contents: IContent[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onStatusToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function ContentTable({
  contents,
  currentPage,
  totalPages,
  totalItems,
  onStatusToggle,
  onDelete
}: ContentTableProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleToggleStatus = async (id: string) => {
    try {
      setIsLoading(id);
      await onStatusToggle(id);
      toast.success('Estado actualizado correctamente');
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error('Error al actualizar el estado');
    } finally {
      setIsLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este contenido?')) {
      return;
    }

    try {
      setIsLoading(id);
      await onDelete(id);
      toast.success('Contenido eliminado correctamente');
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('Error al eliminar el contenido');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Título</th>
              <th>Categoría</th>
              <th>Tipo</th>
              <th>Puntos</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {contents.map((content) => (
              <tr key={content._id}>
                <td>
                  <div className="font-medium">{content.title}</div>
                  <div className="text-sm opacity-50">{content.description.substring(0, 50)}...</div>
                </td>
                <td>{content.category}</td>
                <td>{content.type}</td>
                <td>{content.points}</td>
                <td>
                  <button
                    className={`btn btn-sm ${content.active ? 'btn-success' : 'btn-error'} ${
                      isLoading === content._id ? 'loading' : ''
                    }`}
                    onClick={() => handleToggleStatus(content._id)}
                    disabled={isLoading === content._id}
                  >
                    {content.active ? 'Activo' : 'Inactivo'}
                  </button>
                </td>
                <td>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/content/${content._id}`}
                      className="btn btn-sm btn-primary"
                    >
                      Editar
                    </Link>
                    <button
                      className={`btn btn-sm btn-error ${
                        isLoading === content._id ? 'loading' : ''
                      }`}
                      onClick={() => handleDelete(content._id)}
                      disabled={isLoading === content._id}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            baseUrl="/admin/content"
          />
        </div>
      )}

      <div className="text-center text-sm text-base-content/70">
        Total: {totalItems} contenidos
      </div>
    </div>
  );
} 