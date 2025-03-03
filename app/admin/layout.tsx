import { AdminNav } from "@/components/admin/AdminNav";
import { checkAdminAccess } from "./config";
import { ThemeController } from "@/components/ThemeController";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkAdminAccess();

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header específico para área de administración */}
      <header className="bg-neutral text-neutral-content shadow-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Panel de Administración</h1>
            <div className="flex items-center gap-4">
              <ThemeController />
              <AdminNav />
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