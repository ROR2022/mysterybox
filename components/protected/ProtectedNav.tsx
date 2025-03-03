"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface ProtectedNavProps {
  isAdmin: boolean;
}
      
export function ProtectedNav({ isAdmin }: ProtectedNavProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path ? "text-primary font-medium" : "";
  };

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
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-48"
          >
            <li>
              <Link
                href="/dashboard"
                className={isActive("/dashboard")}
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/profile"
                className={isActive("/profile")}
                onClick={() => setIsMenuOpen(false)}
              >
                Perfil
              </Link>
            </li>
            {isAdmin && (
              <li>
                <Link
                  href="/admin"
                  className={isActive("/admin")}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </Link>
              </li>
            )}
            <div className="divider my-1"></div>
            <li>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="text-error"
              >
                Cerrar Sesión
              </button>
            </li>
          </ul>
        )}
      </div>

      {/* Desktop menu */}
      <nav className="hidden lg:flex items-center gap-4">
        <Link
          href="/dashboard"
          className={`link link-hover ${isActive("/dashboard")}`}
        >
          Dashboard
        </Link>
        <Link
          href="/profile"
          className={`link link-hover ${isActive("/profile")}`}
        >
          Perfil
        </Link>
        {isAdmin && (
          <Link
            href="/admin"
            className={`link link-hover ${isActive("/admin")}`}
          >
            Admin
          </Link>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="btn btn-ghost btn-sm"
        >
          Cerrar Sesión
        </button>
      </nav>
    </div>
  );
}
