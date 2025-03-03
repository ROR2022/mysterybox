'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IReward, RewardType } from '@/libs/types/reward';
import toast from 'react-hot-toast';

interface RewardFormProps {
  initialReward?: IReward | null;
}

export default function RewardForm({ initialReward }: RewardFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: initialReward?.title || '',
    description: initialReward?.description || '',
    type: initialReward?.type || RewardType.SUBSCRIPTION_DISCOUNT,
    pointsCost: initialReward?.pointsCost || 100,
    discount: initialReward?.discount || 0,
    duration: initialReward?.duration || 0,
    maxRedemptions: initialReward?.maxRedemptions || 0,
    userMaxRedemptions: initialReward?.userMaxRedemptions || 0,
    imageUrl: initialReward?.imageUrl || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = initialReward
        ? `/api/admin/rewards/${initialReward._id}`
        : '/api/admin/rewards';
      
      const response = await fetch(url, {
        method: initialReward ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al guardar la recompensa');
      }

      toast.success(
        initialReward
          ? 'Recompensa actualizada correctamente'
          : 'Recompensa creada correctamente'
      );
      router.push('/admin/rewards');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Error al guardar la recompensa');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes('Cost') || name.includes('duration') || name.includes('max')
        ? parseInt(value) || 0
        : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Título</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="input input-bordered"
          required
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Descripción</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="textarea textarea-bordered h-24"
          required
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Tipo</span>
        </label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="select select-bordered"
          required
        >
          {Object.values(RewardType).map((type) => (
            <option key={type} value={type}>
              {type.replace('_', ' ').toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Costo en Puntos</span>
        </label>
        <input
          type="number"
          name="pointsCost"
          value={formData.pointsCost}
          onChange={handleChange}
          className="input input-bordered"
          min="0"
          required
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Descuento (%)</span>
        </label>
        <input
          type="number"
          name="discount"
          value={formData.discount}
          onChange={handleChange}
          className="input input-bordered"
          min="0"
          max="100"
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Duración (días)</span>
        </label>
        <input
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          className="input input-bordered"
          min="0"
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Límite Global de Canjes</span>
        </label>
        <input
          type="number"
          name="maxRedemptions"
          value={formData.maxRedemptions}
          onChange={handleChange}
          className="input input-bordered"
          min="0"
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Límite de Canjes por Usuario</span>
        </label>
        <input
          type="number"
          name="userMaxRedemptions"
          value={formData.userMaxRedemptions}
          onChange={handleChange}
          className="input input-bordered"
          min="0"
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">URL de Imagen</span>
        </label>
        <input
          type="url"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          className="input input-bordered"
          placeholder="https://..."
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn btn-ghost"
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Guardando...' : initialReward ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
} 