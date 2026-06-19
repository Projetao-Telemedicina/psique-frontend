import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { AddCardForm } from './AddCardForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? '');

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expiresMonth: number;
  expiresYear: number;
  isDefault: boolean;
}

export function CheckoutModal({
  title,
  priceCents,
  onClose,
  onCheckout,
  authHeaders,
  children
}: {
  title: string;
  priceCents: number;
  onClose: () => void;
  onCheckout: (methodId: string) => Promise<any>;
  authHeaders: HeadersInit;
  children?: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  const [showAddCard, setShowAddCard] = useState(false);

  const headersRecord = authHeaders as Record<string, string>;
  const activeToken = headersRecord['Authorization']?.replace('Bearer ', '') ?? '';

  const { data: methods = [], isLoading } = useQuery<PaymentMethod[]>({
    queryKey: ['paymentMethods'],
    queryFn: async () => {
      const res = await fetch('/api/payment-methods', { headers: authHeaders });
      if (!res.ok) throw new Error('Erro ao carregar cartões.');
      const data = await res.json();
      if (data.length > 0 && !selectedMethodId) {
        const def = data.find((m: PaymentMethod) => m.isDefault) ?? data[0];
        setSelectedMethodId(def.id);
      }
      return data;
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-[#EAEAEA] rounded-3xl p-8 shadow-2xl flex flex-col gap-6">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-slate-800">✕</button>

        <div>
          <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
          <p className="text-3xl font-bold text-[#4A8F74] mt-1">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(priceCents / 100)}
          </p>
        </div>

        {children}

        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-slate-500">Método de pagamento</p>
          {isLoading ? (
            <div className="h-14 rounded-2xl bg-slate-200 animate-pulse" />
          ) : (
            methods.map((m: PaymentMethod) => (
              <div 
                key={m.id}
                onClick={() => setSelectedMethodId(m.id)}
                className={`p-4 rounded-2xl border-2 cursor-pointer ${selectedMethodId === m.id ? 'border-[#6AB092] bg-[#F0FAF5]' : 'border-slate-200 bg-white'}`}
              >
                <p className="text-sm font-bold capitalize">{m.brand} •••• {m.last4}</p>
              </div>
            ))
          )}

          {showAddCard ? (
            <Elements stripe={stripePromise}>
              <AddCardForm 
                activeToken={activeToken}
                onSuccess={() => { setShowAddCard(false); queryClient.invalidateQueries({ queryKey: ['paymentMethods'] }); }}
                onCancel={() => setShowAddCard(false)}
              />
            </Elements>
          ) : (
            <button onClick={() => setShowAddCard(true)} className="text-sm font-semibold text-[#4A8F74]">+ Adicionar cartão</button>
          )}
        </div>

        <button 
          onClick={() => selectedMethodId && onCheckout(selectedMethodId)}
          className="w-full bg-[#5EBA91] text-white py-3.5 rounded-full font-semibold"
        >
          Confirmar Pagamento
        </button>
      </div>
    </div>
  );
}