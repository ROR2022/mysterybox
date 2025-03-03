'use client';

import { IBoxContent, BoxContentType, InterestCategory } from "@/libs/types/user";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface BoxFormProps {
  onClose: () => void;
}

export function BoxForm({ onClose }: BoxFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState('');
  const [content, setContent] = useState<IBoxContent[]>([{
    title: '',
    description: '',
    category: InterestCategory.TECNOLOGIA,
    type: BoxContentType.ARTICULO,
    url: '',
    points: 10
  }]);

  const handleContentChange = (index: number, field: keyof IBoxContent, value: string | number) => {
    const newContent = [...content];
    newContent[index] = {
      ...newContent[index],
      [field]: value
    };
    setContent(newContent);
  };

  const addContentItem = () => {
    setContent([...content, {
      title: '',
      description: '',
      category: InterestCategory.TECNOLOGIA,
      type: BoxContentType.ARTICULO,
      url: '',
      points: 10
    }]);
  };

  const removeContentItem = (index: number) => {
    setContent(content.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validar que el userId no esté vacío
      if (!userId.trim()) {
        throw new Error('El ID de usuario es requerido');
      }

      // Validar que haya al menos un contenido
      if (content.length === 0) {
        throw new Error('Debe agregar al menos un contenido');
      }

      // Validar que todos los campos del contenido estén completos
      const invalidContent = content.some(item => 
        !item.title.trim() || 
        !item.description.trim() || 
        !item.url.trim()
      );

      if (invalidContent) {
        throw new Error('Todos los campos del contenido son requeridos');
      }

      const response = await fetch('/api/admin/boxes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          content,
          month: new Date().toISOString(),
          deliveredAt: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al crear la caja');
      }

      router.refresh();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la caja');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Nueva Caja Digital</h2>
          <button onClick={onClose} className="btn btn-circle btn-ghost">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text">ID de Usuario</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="ID del usuario"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Contenido</h3>
              <button
                type="button"
                onClick={addContentItem}
                className="btn btn-primary btn-sm"
              >
                Agregar Contenido
              </button>
            </div>

            {content.map((item, index) => (
              <div key={index} className="card bg-base-200 p-4">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium">Contenido #{index + 1}</h4>
                  {content.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeContentItem(index)}
                      className="btn btn-ghost btn-sm text-error"
                    >
                      Eliminar
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Título</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={item.title}
                      onChange={(e) => handleContentChange(index, 'title', e.target.value)}
                      placeholder="Título del contenido"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">URL</span>
                    </label>
                    <input
                      type="url"
                      className="input input-bordered w-full"
                      value={item.url}
                      onChange={(e) => handleContentChange(index, 'url', e.target.value)}
                      placeholder="URL del contenido"
                    />
                  </div>

                  <div className="form-control md:col-span-2">
                    <label className="label">
                      <span className="label-text">Descripción</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered w-full"
                      value={item.description}
                      onChange={(e) => handleContentChange(index, 'description', e.target.value)}
                      placeholder="Descripción del contenido"
                      rows={3}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Categoría</span>
                    </label>
                    <select
                      className="select select-bordered w-full"
                      value={item.category}
                      onChange={(e) => handleContentChange(index, 'category', e.target.value)}
                    >
                      {Object.values(InterestCategory).map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Tipo</span>
                    </label>
                    <select
                      className="select select-bordered w-full"
                      value={item.type}
                      onChange={(e) => handleContentChange(index, 'type', e.target.value)}
                    >
                      {Object.values(BoxContentType).map(type => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Puntos</span>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered w-full"
                      value={item.points}
                      onChange={(e) => handleContentChange(index, 'points', parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                'Crear Caja'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 