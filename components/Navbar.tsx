'use client';

import { ThemeController } from './ThemeController';
import Link from 'next/link';

export function Navbar() {
  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <Link href="/" className="text-xl font-bold text-primary">
          MysteryBox
        </Link>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><Link href="/#features">Características</Link></li>
          <li><Link href="/#pricing">Precios</Link></li>
        </ul>
      </div>
      
      <div className="navbar-end gap-2">
        <ThemeController />
        <Link href="/auth/signin" className="btn btn-ghost">
          Iniciar Sesión
        </Link>
        <Link href="/auth/signin" className="btn btn-primary">
          Registrarse
        </Link>
      </div>
    </div>
  );
} 