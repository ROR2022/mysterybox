//import { auth } from "@/auth";

export default async function DashboardPage() {
  //const session = await auth();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      {/* Estado de la cuenta */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Estado de Suscripción</h2>
            <p>Plan Básico</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary btn-sm">
                Actualizar Plan
              </button>
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Puntos Acumulados</h2>
            <p className="text-2xl font-bold">0 pts</p>
            <div className="card-actions justify-end">
              <button className="btn btn-ghost btn-sm">
                Ver Recompensas
              </button>
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Próxima Caja</h2>
            <p>Disponible en 30 días</p>
            <div className="card-actions justify-end">
              <button className="btn btn-ghost btn-sm">
                Ver Detalles
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Reciente */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Contenido Reciente</h2>
        <div className="alert">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>Completa tu perfil para recibir contenido personalizado.</span>
          <button className="btn btn-sm">Completar Perfil</button>
        </div>
      </div>
    </div>
  );
} 