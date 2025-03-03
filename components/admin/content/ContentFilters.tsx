'use client';

import { InterestCategory, BoxContentType } from '@/libs/types/user';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

// Mapeo de nombres amigables para las categorías
const categoryNames = {
  [InterestCategory.TECNOLOGIA]: 'Tecnología',
  [InterestCategory.ARTE]: 'Arte',
  [InterestCategory.MUSICA]: 'Música',
  [InterestCategory.LITERATURA]: 'Literatura',
  [InterestCategory.CINE]: 'Cine',
  [InterestCategory.GASTRONOMIA]: 'Gastronomía',
  [InterestCategory.VIAJES]: 'Viajes',
  [InterestCategory.DEPORTES]: 'Deportes',
  [InterestCategory.CIENCIA]: 'Ciencia',
  [InterestCategory.HISTORIA]: 'Historia',
  [InterestCategory.NATURALEZA]: 'Naturaleza',
  [InterestCategory.FOTOGRAFIA]: 'Fotografía',
  [InterestCategory.GAMING]: 'Gaming',
  [InterestCategory.MODA]: 'Moda',
  [InterestCategory.SALUD]: 'Salud',
  [InterestCategory.EDUCACION]: 'Educación'
};

// Mapeo de nombres amigables para los tipos de contenido
const contentTypeNames = {
  [BoxContentType.VIDEO]: 'Video',
  [BoxContentType.ARTICULO]: 'Artículo',
  [BoxContentType.PODCAST]: 'Podcast',
  [BoxContentType.CURSO]: 'Curso',
  [BoxContentType.EBOOK]: 'Ebook',
  [BoxContentType.JUEGO]: 'Juego',
  [BoxContentType.EXPERIENCIA]: 'Experiencia',
  [BoxContentType.EVENTO]: 'Evento',
  [BoxContentType.RECURSO]: 'Recurso',
  [BoxContentType.HERRAMIENTA]: 'Herramienta'
};

interface ContentFiltersProps {
  currentSearch?: string;
  currentCategory?: InterestCategory;
  currentType?: BoxContentType;
  currentActive?: boolean;
}

export default function ContentFilters({
  currentSearch,
  currentCategory,
  currentType,
  currentActive,
}: ContentFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (name: string, value: string) => {
    router.push(`/admin/content?${createQueryString(name, value)}`);
  };

  return (
    <div className="bg-base-200 p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="label">
            <span className="label-text">Buscar</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Buscar por título..."
            value={currentSearch || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text">Categoría</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={currentCategory || ''}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {Object.values(InterestCategory).map((category) => (
              <option key={category} value={category}>
                {categoryNames[category]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">
            <span className="label-text">Tipo</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={currentType || ''}
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <option value="">Todos los tipos</option>
            {Object.values(BoxContentType).map((type) => (
              <option key={type} value={type}>
                {contentTypeNames[type]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">
            <span className="label-text">Estado</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={currentActive === undefined ? '' : currentActive.toString()}
            onChange={(e) => handleFilterChange('active', e.target.value)}
          >
            <option value="">Todos</option>
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
        </div>
      </div>
    </div>
  );
} 