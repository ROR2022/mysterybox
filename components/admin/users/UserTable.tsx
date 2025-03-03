'use client';

import { useState, useEffect } from 'react';
import { SubscriptionPlan } from '@/libs/types/user';
import toast from 'react-hot-toast';
import Pagination from '@/components/common/Pagination';
import { Document } from 'mongoose';
import Image from 'next/image';

interface IUser extends Document {
  name?: string;
  email: string;
  image?: string;
  points: number;
  subscription?: {
    plan: SubscriptionPlan;
    active: boolean;
  };
  createdAt: Date;
}

interface UserTableProps {
  currentPage: number;
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function UserTable({
  currentPage,
  searchParams
}: UserTableProps) {
  const [users, setUsers] = useState<IUser[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchParams]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const queryParams = new URLSearchParams();
      queryParams.set('page', currentPage.toString());
      
      if (searchParams.search) {
        queryParams.set('search', searchParams.search.toString());
      }
      if (searchParams.subscription) {
        queryParams.set('subscription', searchParams.subscription.toString());
      }

      const response = await fetch(`/api/admin/users?${queryParams.toString()}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar usuarios');
      }
      
      setUsers(data.users);
      setTotalPages(data.pages);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar los usuarios';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formatUserDate = (date: Date | string | undefined) => {
    if (!date) return 'Fecha no disponible';
    try {
      return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  if (error) {
    return (
      <div className="bg-error/10 p-4 rounded-lg text-error text-center">
        <p>{error}</p>
        <button 
          onClick={() => fetchUsers()} 
          className="btn btn-error btn-sm mt-2"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Suscripción</th>
            <th>Puntos</th>
            <th>Fecha de Registro</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id?.toString()}>
              <td className="flex items-center gap-2">
                {user.image && (
                  <Image
                    src={user.image}
                    alt={user.name || ''}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                {user.name || 'Sin nombre'}
              </td>
              <td>{user.email}</td>
              <td>
                <span className={`badge ${
                  user.subscription?.active ? 'badge-success' : 'badge-ghost'
                }`}>
                  {user.subscription?.plan || SubscriptionPlan.FREE}
                </span>
              </td>
              <td>{user.points}</td>
              <td>{formatUserDate(user.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="p-4 border-t">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl="/admin/users"
        />
      </div>
    </div>
  );
} 