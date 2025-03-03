'use client';

import { useState } from 'react';
import { IDigitalBox, BoxStatus, BoxContentType } from '@/libs/types/user';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface CurrentBoxProps {
  box?: IDigitalBox;
  onOpen?: () => Promise<void>;
}

// Función auxiliar para obtener el texto del botón según el tipo de contenido
function getButtonText(type: BoxContentType): string {
  switch (type) {
    case BoxContentType.CURSO:
      return 'Ir al Curso';
    case BoxContentType.EBOOK:
      return 'Leer Ahora';
    case BoxContentType.VIDEO:
      return 'Ver Video';
    case BoxContentType.ARTICULO:
      return 'Leer Artículo';
    case BoxContentType.PODCAST:
      return 'Escuchar';
    case BoxContentType.JUEGO:
      return 'Jugar';
    case BoxContentType.EXPERIENCIA:
      return 'Comenzar';
    case BoxContentType.EVENTO:
      return 'Ver Evento';
    case BoxContentType.RECURSO:
      return 'Descargar';
    case BoxContentType.HERRAMIENTA:
      return 'Usar Herramienta';
    default:
      return 'Acceder';
  }
}

export function CurrentBox({ box, onOpen }: CurrentBoxProps) {
  const [isLoading, setIsLoading] = useState(false);

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

  const handleOpenBox = async () => {
    if (!onOpen) return;
    try {
      setIsLoading(true);
      await onOpen();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al abrir la caja');
    } finally {
      setIsLoading(false);
    }
  };

  if (!box) {
    return (
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h3 className="card-title">No hay caja disponible</h3>
          <p>Tu próxima caja digital estará disponible el próximo mes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="card-title">Caja de {formatDate(box.month)}</h3>
            <p className="text-sm text-base-content/70">
              Entregada el {formatDate(box.deliveredAt)}
            </p>
          </div>
          {box.status === BoxStatus.PENDING && (
            <button
              onClick={handleOpenBox}
              disabled={isLoading}
              className="btn btn-primary"
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Abriendo...
                </>
              ) : (
                'Abrir Caja'
              )}
            </button>
          )}
        </div>

        {box.status !== BoxStatus.PENDING && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {box.content.map((item, index) => (
              <div key={index} className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <div className="flex justify-between items-start">
                    <h4 className="card-title text-lg">{item.title}</h4>
                    <div className="badge badge-primary">{item.type}</div>
                  </div>
                  <p className="text-sm">{item.description}</p>
                  {item.imageUrl && (
                    <div className="relative h-40 w-full">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <div className="card-actions justify-between items-center mt-4">
                    <div className="badge badge-ghost">{item.points} pts</div>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-primary"
                    >
                      {getButtonText(item.type)}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 