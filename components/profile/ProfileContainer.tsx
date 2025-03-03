'use client';

import { InterestCategory } from '@/libs/types/user';
import { InterestsForm } from './InterestsForm';
import { ProfileForm } from './ProfileForm';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface ProfileContainerProps {
  user: {
    name?: string;
    interests: InterestCategory[];
    profile: {
      bio?: string;
      location?: string;
      website?: string;
    };
    notifications: {
      email: boolean;
      push: boolean;
    };
  };
}

export function ProfileContainer({ user }: ProfileContainerProps) {
  const [notifications, setNotifications] = useState(user.notifications);

  const handleApiError = (error: Error | unknown, action: string) => {
    console.error(`Error ${action}:`, error);
    toast.error(`Error al ${action}. Por favor, intenta de nuevo.`);
  };

  const handleSaveInterests = async (interests: InterestCategory[]) => {
    try {
      console.log('Sending interests:', {
        interests,
        interestsType: typeof interests,
        isArray: Array.isArray(interests),
        values: interests.map(i => ({ value: i, type: typeof i }))
      });

      const response = await fetch('/api/profile/interests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interests })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Server response:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error('Failed to update interests');
      }

      toast.success('Intereses actualizados correctamente');
    } catch (error) {
      handleApiError(error, 'actualizar intereses');
    }
  };

  const handleSaveProfile = async (data: { profile: { bio?: string, location?: string, website?: string }, name?: string }) => {
    try {
      const response = await fetch('/api/profile/info', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el perfil');
      }

      toast.success('Perfil actualizado correctamente');
    } catch (error) {
      handleApiError(error, 'actualizar el perfil');
    }
  };

  const handleSaveNotifications = async (notifications: { email: boolean, push: boolean }) => {
    try {
      const response = await fetch('/api/profile/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notifications })
      });
      if (!response.ok) throw new Error('Failed to update notifications');
      setNotifications(notifications);
      toast.success('Preferencias de notificaciones actualizadas');
    } catch (error) {
      handleApiError(error, 'actualizar preferencias de notificaciones');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tu Perfil</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sección de Intereses */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <InterestsForm
              initialInterests={user.interests}
              onSave={handleSaveInterests}
            />
          </div>
        </div>

        {/* Sección de Perfil */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <ProfileForm
              initialProfile={user.profile}
              initialName={user.name}
              onSave={handleSaveProfile}
            />
          </div>
        </div>
      </div>

      {/* Sección de Notificaciones */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h3 className="text-lg font-semibold">Preferencias de Notificaciones</h3>
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Recibir notificaciones por email</span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={notifications.email}
                onChange={async () => {
                  const newNotifications = {
                    ...notifications,
                    email: !notifications.email
                  };
                  await handleSaveNotifications(newNotifications);
                }}
              />
            </label>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Recibir notificaciones push</span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={notifications.push}
                onChange={async () => {
                  const newNotifications = {
                    ...notifications,
                    push: !notifications.push
                  };
                  await handleSaveNotifications(newNotifications);
                }}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
} 