'use client';

import { useState } from 'react';
import { getStripe } from '@/libs/stripe-client';
import Stripe from 'stripe';
import toast from 'react-hot-toast';

interface SubscriptionPlansProps {
  prices: Stripe.Price[];
  userEmail: string;
}

const BASIC_PRICE = process.env.NEXT_PUBLIC_BASIC_PRICE;
const PREMIUM_PRICE = process.env.NEXT_PUBLIC_PREMIUM_PRICE;
const prices_stripe = [
  {
    id: BASIC_PRICE,
    name: 'Básico',
    amount: 500,
    description: 'Basic Subscription,1 experiencia digital al mes,Acceso a la comunidad,Sistema de puntos básico',
    features: [
      'Acceso a las funcionalidades básicas de la plataforma.',
      'Soporte básico por correo electrónico.',
      'Acceso a la plataforma en cualquier dispositivo.',
    ]
  },
  {
    id: PREMIUM_PRICE,
    name: 'Premium',
    amount: 1000,
    description: 'Premium Subscription,3 experiencias digitales al mes,Acceso prioritario a eventos,Sistema de puntos premium,Contenido exclusivo',
    features: [
      'Acceso a todas las funcionalidades de la plataforma.',
      'Soporte prioritario por correo electrónico.',
      'Acceso a la plataforma en cualquier dispositivo.',
      'Acceso a funcionalidades avanzadas de la plataforma.',
    ]
  }
];

//eslint-disable-next-line @typescript-eslint/no-unused-vars
export function SubscriptionPlans({ prices, userEmail }: SubscriptionPlansProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
 // console.log('prices:...', prices_stripe);

  const handleSubscribe = async (priceId: string) => {
    //console.log('priceId:...', priceId);
    if (!priceId) {
      toast.error('No se pudo obtener el precio de la suscripción.');
      return;
    }
    try {
      setIsLoading(priceId);
      
      const response = await fetch('/api/subscription/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          email: userEmail,
        }),
      });

      const { sessionId } = await response.json();
      
      // Redirigir a Stripe Checkout
      const stripe = await getStripe();
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          throw error;
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Hubo un error al procesar tu suscripción. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(null);
    }
  };

  const formatPrice = (price: number) => {
    const amount = price ? price / 100 : 0;
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const createUniqueId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {prices_stripe.map((price) => {
        const product = {...price};
        //console.log('product:...', product);
        const isBasic = product.name.toLowerCase().includes('básico');
        
        return (
          <div
            key={createUniqueId()}
            className={`card bg-base-200 shadow-xl ${
              isBasic ? '' : 'border-2 border-primary'
            }`}
          >
            <div className="card-body">
              <h2 className="card-title text-2xl">
                {product.name}
                {!isBasic && (
                  <span className="badge badge-primary">Recomendado</span>
                )}
              </h2>
              <p className="text-3xl font-bold my-4">
                {formatPrice(price.amount)}
                <span className="text-base font-normal">/mes</span>
              </p>
              <ul className="space-y-2 my-4">
                {product.description?.split(',').map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-success"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="card-actions justify-end mt-4">
                <button
                  className={`btn btn-primary btn-block`}
                  onClick={() => handleSubscribe(price.id || '')}
                  disabled={isLoading !== null}
                >
                  {isLoading === price.id ? (
                   <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    'Suscribirse'
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
} 