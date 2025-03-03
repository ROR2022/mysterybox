import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ProtectedNav } from "@/components/protected/ProtectedNav";
import { ThemeController } from "@/components/ThemeController";
//import { checkAdminAccess } from "@/app/admin/config";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  

  if (!session) {
    redirect("/auth/signin");
  }

  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
  let isAdmin = false;
  if (adminEmails.includes(session.user?.email || '')) {
    isAdmin = true;
  }

  const fistWordName = session.user?.name?.split(' ')[0];

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header específico para área protegida */}
      <header className="bg-base-200 shadow-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h2 className="text-lg md:text-xl font-bold text-primary truncate">
                Bienvenido, {fistWordName || 'Usuario'}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <ThemeController />
              <ProtectedNav isAdmin={isAdmin} />
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="container mx-auto px-4 py-6 md:py-8">
        {children}
      </main>
    </div>
  );
} 