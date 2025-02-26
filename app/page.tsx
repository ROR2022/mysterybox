//import Image from "next/image";
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="hero min-h-[calc(100vh-4rem)] bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold text-primary">MysteryBox Digital</h1>
            <p className="py-6">
              Descubre experiencias digitales sorpresa personalizadas cada mes.
              Aprende, explora y crece con contenido seleccionado especialmente para ti.
            </p>
            <Link href="/auth/signin" className="btn btn-primary">
              Comenzar Ahora
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-base-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">
            ¿Qué hace especial a MysteryBox?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-secondary">Personalización</h3>
                <p>Contenido adaptado a tus intereses y objetivos de aprendizaje.</p>
              </div>
            </div>
            {/* Feature Card 2 */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-secondary">Sorpresa Mensual</h3>
                <p>Cada mes descubre nuevo contenido emocionante y valioso.</p>
              </div>
            </div>
            {/* Feature Card 3 */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-secondary">Gamificación</h3>
                <p>Gana puntos y recompensas mientras aprendes y creces.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">
            Planes Disponibles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Basic Plan */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-secondary">Plan Básico</h3>
                <div className="text-3xl font-bold my-4">$9.99/mes</div>
                <ul className="space-y-2">
                  <li>✓ 1 experiencia digital al mes</li>
                  <li>✓ Acceso a la comunidad</li>
                  <li>✓ Sistema de puntos básico</li>
                </ul>
                <div className="card-actions justify-end mt-4">
                  <Link href="/auth/signin" className="btn btn-primary">
                    Seleccionar Plan
                  </Link>
                </div>
              </div>
            </div>
            {/* Premium Plan */}
            <div className="card bg-base-100 shadow-xl border-2 border-primary">
              <div className="card-body">
                <div className="badge badge-primary mb-2">Más Popular</div>
                <h3 className="card-title text-secondary">Plan Premium</h3>
                <div className="text-3xl font-bold my-4">$19.99/mes</div>
                <ul className="space-y-2">
                  <li>✓ 3 experiencias digitales al mes</li>
                  <li>✓ Acceso prioritario a eventos</li>
                  <li>✓ Sistema de puntos premium</li>
                  <li>✓ Contenido exclusivo</li>
                </ul>
                <div className="card-actions justify-end mt-4">
                  <Link href="/auth/signin" className="btn btn-primary">
                    Seleccionar Plan
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-base-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-primary">
            ¿Listo para comenzar tu viaje?
          </h2>
          <p className="mb-8 max-w-2xl mx-auto">
            Únete a nuestra comunidad de aprendices y descubre nuevas experiencias
            digitales cada mes. Tu próxima aventura de aprendizaje está a un clic de
            distancia.
          </p>
          <Link href="/auth/signin" className="btn btn-primary btn-lg">
            Crear Cuenta
          </Link>
        </div>
      </section>
    </main>
  );
}
