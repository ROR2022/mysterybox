'use client';

import { useState } from 'react';
import { InterestCategory } from '@/libs/types/user';

// Mapa de categorías a información descriptiva
const categoryInfo = {
  [InterestCategory.TECNOLOGIA]: {
    title: 'Tecnología',
    description: 'Desarrollo, innovación y avances tecnológicos',
    icon: '💻'
  },
  [InterestCategory.ARTE]: {
    title: 'Arte',
    description: 'Expresión artística y creatividad',
    icon: '🎨'
  },
  [InterestCategory.MUSICA]: {
    title: 'Música',
    description: 'Géneros, artistas y producción musical',
    icon: '🎵'
  },
  [InterestCategory.LITERATURA]: {
    title: 'Literatura',
    description: 'Libros, escritura y narrativa',
    icon: '📚'
  },
  [InterestCategory.CINE]: {
    title: 'Cine',
    description: 'Películas, series y producción audiovisual',
    icon: '🎬'
  },
  [InterestCategory.GASTRONOMIA]: {
    title: 'Gastronomía',
    description: 'Cocina, recetas y cultura culinaria',
    icon: '🍳'
  },
  [InterestCategory.VIAJES]: {
    title: 'Viajes',
    description: 'Destinos, culturas y experiencias',
    icon: '✈️'
  },
  [InterestCategory.DEPORTES]: {
    title: 'Deportes',
    description: 'Actividades físicas y competición',
    icon: '⚽'
  },
  [InterestCategory.CIENCIA]: {
    title: 'Ciencia',
    description: 'Descubrimientos e investigación',
    icon: '🔬'
  },
  [InterestCategory.HISTORIA]: {
    title: 'Historia',
    description: 'Eventos históricos y civilizaciones',
    icon: '📜'
  },
  [InterestCategory.NATURALEZA]: {
    title: 'Naturaleza',
    description: 'Medio ambiente y vida silvestre',
    icon: '🌿'
  },
  [InterestCategory.FOTOGRAFIA]: {
    title: 'Fotografía',
    description: 'Técnicas y arte fotográfico',
    icon: '📸'
  },
  [InterestCategory.GAMING]: {
    title: 'Gaming',
    description: 'Videojuegos y entretenimiento digital',
    icon: '🎮'
  },
  [InterestCategory.MODA]: {
    title: 'Moda',
    description: 'Tendencias y diseño de moda',
    icon: '👗'
  },
  [InterestCategory.SALUD]: {
    title: 'Salud',
    description: 'Bienestar y cuidado personal',
    icon: '🏥'
  },
  [InterestCategory.EDUCACION]: {
    title: 'Educación',
    description: 'Aprendizaje y desarrollo personal',
    icon: '📖'
  }
};

interface InterestsFormProps {
  initialInterests?: InterestCategory[];
  onSave: (interests: InterestCategory[]) => Promise<void>;
}

export function InterestsForm({ initialInterests = [], onSave }: InterestsFormProps) {
  const [selectedInterests, setSelectedInterests] = useState<InterestCategory[]>(
    initialInterests.map(i => i.toLowerCase() as InterestCategory)
  );
  const [isSaving, setIsSaving] = useState(false);

  const toggleInterest = (interest: InterestCategory) => {
    const normalizedInterest = interest.toLowerCase() as InterestCategory;
    setSelectedInterests(current =>
      current.includes(normalizedInterest)
        ? current.filter(i => i !== normalizedInterest)
        : [...current, normalizedInterest]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Asegurarse de que los intereses coincidan exactamente con los valores del enum
      const validInterests = selectedInterests.filter(i => 
        Object.values(InterestCategory).includes(i)
      );
      console.log('Submitting interests:', {
        original: selectedInterests,
        validated: validInterests,
        enumValues: Object.values(InterestCategory)
      });
      await onSave(validInterests);
    } catch (error) {
      console.error('Error saving interests:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Selecciona tus intereses</h3>
        <p className="text-sm text-base-content/70">
          Esto nos ayudará a personalizar tu experiencia y el contenido de tus cajas digitales.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(categoryInfo).map(([key, info]) => {
            const category = key as InterestCategory;
            const normalizedCategory = category.toLowerCase() as InterestCategory;
            return (
              <button
                key={category}
                type="button"
                onClick={() => toggleInterest(category)}
                className={`p-4 rounded-lg border transition-all ${
                  selectedInterests.includes(normalizedCategory)
                    ? 'border-primary bg-primary/10'
                    : 'border-base-300 hover:border-primary/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{info.icon}</span>
                  <div className="text-left">
                    <h4 className="font-medium">{info.title}</h4>
                    <p className="text-sm text-base-content/70">{info.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="btn btn-primary"
        >
          {isSaving ? (
            <>
              <span className="loading loading-spinner"></span>
              Guardando...
            </>
          ) : (
            'Guardar Intereses'
          )}
        </button>
      </div>
    </form>
  );
} 