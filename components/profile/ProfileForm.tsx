'use client';

import { useState } from 'react';
import type { IUser } from '@/libs/models/user';

interface ProfileFormProps {
  initialProfile?: IUser['profile'];
  initialName?: string;
  onSave: (data: { profile: IUser['profile'], name?: string }) => Promise<void>;
}

export function ProfileForm({ initialProfile = {}, initialName = '', onSave }: ProfileFormProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [name, setName] = useState(initialName);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({ profile, name });
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Información del Perfil</h3>
        <p className="text-sm text-base-content/70">
          Cuéntanos un poco más sobre ti para mejorar tu experiencia.
        </p>
        
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Nombre</span>
          </label>
          <input
            type="text"
            className="input input-bordered"
            placeholder="Tu nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Biografía</span>
          </label>
          <textarea
            className="textarea textarea-bordered h-24"
            placeholder="Cuéntanos sobre ti..."
            value={profile.bio || ''}
            onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Ubicación</span>
          </label>
          <input
            type="text"
            className="input input-bordered"
            placeholder="Ciudad, País"
            value={profile.location || ''}
            onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Sitio Web</span>
          </label>
          <input
            type="url"
            className="input input-bordered"
            placeholder="https://..."
            value={profile.website || ''}
            onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
          />
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
            'Guardar Perfil'
          )}
        </button>
      </div>
    </form>
  );
} 