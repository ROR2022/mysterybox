import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ProtectedNav } from "@/components/protected/ProtectedNav";
import { ThemeController } from "@/components/ThemeController";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header específico para área protegida */}
      <header className="bg-base-200 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-primary">
                Bienvenido, {session.user?.name || 'Usuario'}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <ThemeController />
              <ProtectedNav />
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
} 