export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-primary mb-8">Política de Privacidad</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="lead">
          En MysteryBox, la privacidad de nuestros usuarios es una prioridad. Esta política describe cómo recolectamos, 
          usamos y protegemos tu información personal.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Información que Recolectamos</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Información de perfil:</strong> Datos básicos como tu nombre, email y preferencias de contenido
            para personalizar tu experiencia.
          </li>
          <li>
            <strong>Datos de uso:</strong> Información sobre cómo interactúas con nuestras cajas digitales y contenido
            para mejorar nuestras recomendaciones.
          </li>
          <li>
            <strong>Información de suscripción:</strong> Detalles necesarios para procesar pagos y gestionar tu suscripción
            (procesados de manera segura por Stripe).
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">Uso de la Información</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Personalizar tu experiencia y contenido mensual.</li>
          <li>Procesar pagos y gestionar tu suscripción.</li>
          <li>Enviar notificaciones importantes sobre tu cuenta y nuevas cajas digitales.</li>
          <li>Mejorar nuestros servicios y recomendaciones.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">Protección de Datos</h2>
        <p>
          Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Encriptación de datos sensibles.</li>
          <li>Acceso restringido a información personal.</li>
          <li>Monitoreo regular de nuestros sistemas de seguridad.</li>
          <li>Cumplimiento con regulaciones de protección de datos.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">Tus Derechos</h2>
        <p>Como usuario de MysteryBox, tienes derecho a:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Acceder a tu información personal.</li>
          <li>Corregir datos inexactos.</li>
          <li>Solicitar la eliminación de tus datos.</li>
          <li>Exportar tus datos en un formato común.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">Contacto</h2>
        <p>
          Si tienes preguntas sobre nuestra política de privacidad, puedes contactarnos en{' '}
          <a href="mailto:privacy@mysteryboxapp.lat" className="text-primary hover:underline">
            privacy@mysteryboxapp.lat
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