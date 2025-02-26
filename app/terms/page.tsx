export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-primary mb-8">Términos y Condiciones</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="lead">
          Al usar MysteryBox, aceptas estos términos y condiciones. Por favor, léelos cuidadosamente
          antes de usar nuestros servicios.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">1. Suscripción y Servicios</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Planes de suscripción:</strong> Ofrecemos planes básico y premium con diferentes
            niveles de acceso a contenido y características.
          </li>
          <li>
            <strong>Renovación automática:</strong> Las suscripciones se renuevan automáticamente
            al final de cada período hasta que sean canceladas.
          </li>
          <li>
            <strong>Cancelación:</strong> Puedes cancelar tu suscripción en cualquier momento desde
            tu panel de control.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">2. Contenido Digital</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Personalización:</strong> El contenido se selecciona basado en tus preferencias,
            pero no podemos garantizar que todo el contenido será de tu interés.
          </li>
          <li>
            <strong>Uso personal:</strong> El contenido es para uso personal y no comercial.
            No está permitido compartir o revender el contenido.
          </li>
          <li>
            <strong>Disponibilidad:</strong> Nos esforzamos por mantener el contenido disponible,
            pero no garantizamos su disponibilidad continua.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">3. Sistema de Puntos y Recompensas</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Los puntos se obtienen por actividades específicas en la plataforma.</li>
          <li>Los puntos no tienen valor monetario y no son transferibles.</li>
          <li>Nos reservamos el derecho de modificar el sistema de puntos en cualquier momento.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">4. Responsabilidades del Usuario</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Mantener la seguridad de tu cuenta y credenciales.</li>
          <li>Proporcionar información precisa y actualizada.</li>
          <li>No usar la plataforma para actividades ilegales o no autorizadas.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">5. Cambios en el Servicio</h2>
        <p>
          Nos reservamos el derecho de modificar, suspender o discontinuar cualquier aspecto
          del servicio en cualquier momento, con o sin previo aviso.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">6. Limitación de Responsabilidad</h2>
        <p>
          MysteryBox no será responsable por daños indirectos, incidentales o consecuentes
          que surjan del uso o la imposibilidad de usar nuestros servicios.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">7. Contacto</h2>
        <p>
          Para preguntas sobre estos términos, contáctanos en{' '}
          <a href="mailto:legal@mysteryboxapp.lat" className="text-primary hover:underline">
            legal@mysteryboxapp.lat
          </a>
        </p>

        <div className="mt-8 p-4 bg-base-200 rounded-lg">
          <p className="text-sm">
            Última actualización: {new Date().toLocaleDateString('es-ES', { 
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>
    </div>
  );
} 