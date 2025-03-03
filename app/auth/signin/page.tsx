import { auth } from "@/auth";
import { SignInForm } from "@/components/auth/SignInForm";
import Link from "next/link";

export default async function SignInPage() {
  const session = await auth();

  // Redirigir si ya está autenticado
  if (session) {
    return { redirect: { destination: "/dashboard", permanent: false } };
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="max-w-md w-full space-y-8 p-8 bg-base-100 rounded-lg shadow-xl">
        <div className="flex justify-between items-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary">Iniciar Sesión</h2>
          <p className="mt-2 text-sm">
            Accede a tu cuenta para descubrir experiencias digitales
            personalizadas
          </p>
          
        </div>
        <Link href="/" className="btn btn-circle btn-outline">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          </Link>
          </div>
        <SignInForm />
      </div>
    </div>
  );
}
