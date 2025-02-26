'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function ProtectedNav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'text-primary font-medium' : '';
  };

  return (
    <nav className="flex items-center gap-4">
      <Link 
        href="/dashboard" 
        className={`link link-hover ${isActive('/dashboard')}`}
      >
        Dashboard
      </Link>
      <Link 
        href="/profile" 
        className={`link link-hover ${isActive('/profile')}`}
      >
        Perfil
      </Link>
      <button 
        onClick={() => signOut({ callbackUrl: '/' })}
        className="btn btn-ghost btn-sm"
      >
        Cerrar Sesión
      </button>
    </nav>
  );
} 