'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function AdminNav() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path ? "text-primary-content font-medium" : "";
  };

  const menuItems = [
    { path: '/admin', label: 'Dashboard' },
    { path: '/admin/content', label: 'Contenido' },
    { path: '/admin/users', label: 'Usuarios' },
    { path: '/admin/boxes', label: 'Cajas' },
    { path: '/admin/rewards', label: 'Recompensas' },
    { path: '/admin/subscriptions', label: 'Suscripciones' },
  ];

  return (
    <div className="flex items-center gap-2">
      {/* Mobile menu */}
      <div className="dropdown dropdown-end lg:hidden">
        <label
          tabIndex={0}
          className="btn btn-ghost btn-circle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </label>
        {isMenuOpen && (
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={isActive(item.path)}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <div className="divider my-1"></div>
            <li>
              <Link
                href="/dashboard"
                className="text-error"
                onClick={() => setIsMenuOpen(false)}
              >
                Salir del Admin
              </Link>
            </li>
          </ul>
        )}
      </div>

      {/* Desktop menu */}
      <nav className="hidden lg:flex items-center gap-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`link link-hover ${isActive(item.path)}`}
          >
            {item.label}
          </Link>
        ))}
        <div className="divider divider-horizontal"></div>
        <Link
          href="/dashboard"
          className="btn btn-ghost btn-sm text-error"
        >
          Salir del Admin
        </Link>
      </nav>
    </div>
  );
} 