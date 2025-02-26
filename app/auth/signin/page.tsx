import { auth } from "@/auth";
import { SignInForm } from "@/components/auth/SignInForm";

export default async function SignInPage() {
  const session = await auth();
  
  // Redirigir si ya está autenticado
  if (session) {
    return { redirect: { destination: "/dashboard", permanent: false } };
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="max-w-md w-full space-y-8 p-8 bg-base-100 rounded-lg shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary">Iniciar Sesión</h2>
          <p className="mt-2 text-sm">
            Accede a tu cuenta para descubrir experiencias digitales personalizadas
          </p>
        </div>
        <SignInForm />
      </div>
    </div>
  );
} 