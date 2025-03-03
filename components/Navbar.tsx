'use client';

import { ThemeController } from './ThemeController';
import Link from 'next/link';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();

  const AuthButtons = () => {
    if (session) {
      return (
        <>
          <Link href="/dashboard" className="btn btn-ghost">
            Dashboard
          </Link>
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="btn btn-primary"
          >
            Cerrar Sesión
          </button>
        </>
      );
    }
    return (
      <>
        <Link href="/auth/signin" className="btn btn-ghost">
          Iniciar Sesión
        </Link>
        <Link href="/auth/signin" className="btn btn-primary">
          Registrarse
        </Link>
      </>
    );
  };

  const MobileMenuItems = () => {
    if (session) {
      return (
        <>
          <li><Link href="/#features" onClick={() => setIsMenuOpen(false)}>Características</Link></li>
          <li><Link href="/#pricing" onClick={() => setIsMenuOpen(false)}>Precios</Link></li>
          <div className="divider"></div>
          <li>
            <Link 
              href="/dashboard" 
              className="justify-between"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <button 
              onClick={() => {
                setIsMenuOpen(false);
                signOut({ callbackUrl: '/' });
              }}
              className="text-error justify-between"
            >
              Cerrar Sesión
            </button>
          </li>
        </>
      );
    }
    return (
      <>
        <li><Link href="/#features" onClick={() => setIsMenuOpen(false)}>Características</Link></li>
        <li><Link href="/#pricing" onClick={() => setIsMenuOpen(false)}>Precios</Link></li>
        <div className="divider"></div>
        <li>
          <Link 
            href="/auth/signin" 
            className="justify-between"
            onClick={() => setIsMenuOpen(false)}
          >
            Iniciar Sesión
          </Link>
        </li>
        <li>
          <Link 
            href="/auth/signin"
            className="text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            Registrarse
          </Link>
        </li>
      </>
    );
  };

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        {/* Hamburger menu for mobile */}
        <div className="dropdown lg:hidden">
          <label 
            tabIndex={0} 
            className="btn btn-ghost btn-circle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </label>
          {isMenuOpen && (
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <MobileMenuItems />
            </ul>
          )}
        </div>
        
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-primary px-2">
          MysteryBox
        </Link>
      </div>
      
      {/* Desktop menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><Link href="/#features">Características</Link></li>
          <li><Link href="/#pricing">Precios</Link></li>
        </ul>
      </div>
      
      {/* Desktop auth buttons */}
      <div className="navbar-end gap-2">
        <ThemeController />
        <div className="hidden lg:flex gap-2">
          <AuthButtons />
        </div>
      </div>
    </div>
  );
} 