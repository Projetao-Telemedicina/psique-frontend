import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { toast } from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import EmergencyButton from '../components/EmergencyButton';
import { EmergencyModal } from '../components/EmergencyModal';
import { useAuth } from '../components/AuthContext';
import { AddCardForm } from '../components/AddCardForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? '');

interface PaymentMethod {
  id: string;
  type: 'CARD';
  brand: string;
  last4: string;
  holderName: string | null;
  expiresMonth: number;
  expiresYear: number;
  isDefault: boolean;
}

interface CheckoutResponse {
  id: string;
  appointmentId: string | null;
  status: string;
  originalAmountCents: number;
  discountAmountCents: number;
  finalAmountCents: number;
  clientSecret: string | null;
  appointmentConfirmed: boolean;
  paidAt: string | null;
}

const brandIcons: Record<string, string> = {
  visa: '💳',
  mastercard: '💳',
  amex: '💳',
  default: '💳',
};

const formatCents = (cents: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);

function PaymentMethodCard({
  method,
  selected,
  onSelect,
  onRemove,
  removing,
}: {
  method: PaymentMethod;
  selected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  removing: boolean;
}) {
  const brand = method.brand?.toLowerCase() ?? 'default';
  const icon = brandIcons[brand] ?? brandIcons.default;

  return (
    <div
      onClick={onSelect}
      className={`relative flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all select-none ${
        selected
          ? 'border-[#6AB092] bg-[#F0FAF5]'
          : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
          selected ? 'border-[#6AB092] bg-[#6AB092]' : 'border-slate-300'
        }`}
      >
        {selected && (
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>

      <span className="text-2xl">{icon}</span>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-700 capitalize">
          {method.brand} •••• {method.last4}
        </p>
        <p className="text-xs text-slate-400 mt-0.5">
          Vence {String(method.expiresMonth).padStart(2, '0')}/{method.expiresYear}
        </p>
      </div>

      {method.isDefault && (
        <span className="text-[10px] font-bold text-[#4A8F74] bg-[#BCE3D0] px-3 py-1 rounded-full">
          Padrão
        </span>
      )}

      <button
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        disabled={removing}
        className="p-1.5 text-slate-400 hover:text-red-500 transition-colors cursor-pointer disabled:opacity-40 rounded-lg hover:bg-red-50"
        title="Remover cartão"
      >
        {removing ? (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        )}
      </button>
    </div>
  );
}

export default function Pagamento() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, token } = useAuth();
  const queryClient = useQueryClient();

  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [checkoutResult, setCheckoutResult] = useState<CheckoutResponse | null>(null);

  const activeToken = token || localStorage.getItem('token');

  const professionalId = searchParams.get('professionalId');
  const startsAt = searchParams.get('startsAt');
  const endsAt = searchParams.get('endsAt');
  const priceCents = Number(searchParams.get('priceCents') ?? 15000);
  const isCheckoutMode = !!(professionalId && startsAt && endsAt);

  const authHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
  };

  const { data: methods = [], isLoading: loadingMethods } = useQuery<PaymentMethod[]>({
    queryKey: ['paymentMethods', activeToken],
    queryFn: async () => {
      const res = await fetch('/api/payment-methods', { headers: authHeaders });
      if (!res.ok) throw new Error('Erro ao carregar cartões.');
      return res.json();
    },
    enabled: !!activeToken,
  });

  useEffect(() => {
    if (methods.length > 0 && !selectedMethodId) {
      const def = methods.find((m) => m.isDefault) ?? methods[0];
      setSelectedMethodId(def.id);
    }
  }, [methods, selectedMethodId]);

  const { mutate: removeMethod } = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/payment-methods/${id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      if (!res.ok) throw new Error('Erro ao remover cartão.');
      return res.json();
    },
    onMutate: (id) => setRemovingId(id),
    onSettled: () => setRemovingId(null),
    onSuccess: (_, id) => {
      if (selectedMethodId === id) setSelectedMethodId(null);
      queryClient.invalidateQueries({ queryKey: ['paymentMethods'] });
      toast.success('Cartão removido com sucesso!');
    },
    onError: (err: any) => toast.error(err.message ?? 'Falha ao remover cartão.'),
  });

  const { mutate: checkout, isPending: checkingOut } = useMutation({
    mutationFn: async () => {
      if (!selectedMethodId) throw new Error('Selecione um método de pagamento.');
      const res = await fetch('/api/payments/appointments/checkout', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ professionalId, startsAt, endsAt, priceCents, paymentMethodId: selectedMethodId }),
      });
      const data = await res.json();
      if (!res.ok) throw data;
      return data as CheckoutResponse;
    },
    onSuccess: (data) => setCheckoutResult(data),
    onError: (err: any) => {
      const msg = Array.isArray(err?.message) ? err.message.join(', ') : err?.message;
      toast.error(msg || 'Falha ao processar pagamento.');
    },
  });

  const handleAddCardSuccess = useCallback(() => {
    setShowAddCard(false);
    queryClient.invalidateQueries({ queryKey: ['paymentMethods'] });
  }, [queryClient]);

  if (checkoutResult?.appointmentConfirmed) {
    return (
      <main className="flex h-screen w-full overflow-hidden bg-white font-sans antialiased text-slate-800">
        <Sidebar role={user?.role === 'PATIENT' ? 'paciente' : 'profissional'} itemAtivo="home" />
        <section className="flex flex-col flex-1 items-center justify-center px-8">
          <div className="flex flex-col items-center gap-5 max-w-sm text-center">
            <div className="w-20 h-20 rounded-full bg-[#BCE3D0] flex items-center justify-center">
              <svg className="w-10 h-10 text-[#4A8F74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Consulta confirmada!</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Seu pagamento de{' '}
              <span className="font-semibold text-slate-600">
                {formatCents(checkoutResult.finalAmountCents)}
              </span>{' '}
              foi processado e sua consulta está agendada.
            </p>
            <button
              onClick={() => navigate(user?.role === 'PROFESSIONAL' ? '/profissional/home' : '/paciente/home')}
              className="mt-4 bg-[#5EBA91] hover:bg-[#4EAB82] text-white text-sm font-semibold px-8 py-3 rounded-full transition-colors shadow-sm cursor-pointer"
            >
              Ir para o início
            </button>
          </div>
        </section>
      </main>
    );
  }

  const selectedMethod = methods.find((m) => m.id === selectedMethodId);

  return (
    <main className="flex h-screen w-full overflow-hidden bg-white font-sans antialiased text-slate-800">
      <Sidebar role={user?.role === 'PATIENT' ? 'paciente' : 'profissional'} itemAtivo="home" />

      <EmergencyModal isOpen={showEmergencyModal} onClose={() => setShowEmergencyModal(false)} />

      <section className="flex flex-col flex-1 overflow-y-auto scrollbar-thin">
        <header className="flex items-center justify-between px-12 py-8 border-b border-slate-100 shrink-0">
          <div className="text-left">
            <h1 className="text-3xl font-bold text-[#1E293B]">Pagamento</h1>
            <p className="text-slate-500 text-sm mt-0.5">Gerencie seus métodos de pagamento</p>
          </div>
          {user?.role === 'PATIENT' && (
            <EmergencyButton onClick={() => setShowEmergencyModal(true)} />
          )}
        </header>

        <div className="flex flex-col lg:flex-row gap-8 px-12 py-8 max-w-5xl w-full">
          <div className="flex flex-col flex-1 gap-6">
            {loadingMethods ? (
              <div className="flex flex-col gap-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-20 rounded-2xl bg-slate-100 animate-pulse" />
                ))}
              </div>
            ) : methods.length === 0 && !showAddCard ? (
              <div className="flex flex-col items-center justify-center bg-[#F2F2F2] rounded-3xl p-10 gap-3 text-center">
                <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <p className="text-sm font-semibold text-slate-400">Nenhum cartão cadastrado</p>
                <p className="text-xs text-slate-400">Adicione um cartão para realizar pagamentos.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {methods.map((method) => (
                  <PaymentMethodCard
                    key={method.id}
                    method={method}
                    selected={selectedMethodId === method.id}
                    onSelect={() => setSelectedMethodId(method.id)}
                    onRemove={() => removeMethod(method.id)}
                    removing={removingId === method.id}
                  />
                ))}
              </div>
            )}

            {showAddCard ? (
              <div className="bg-[#F2F2F2] rounded-3xl p-6">
                <h3 className="text-sm font-bold text-slate-700 mb-5">Novo cartão</h3>
                <Elements stripe={stripePromise}>
                  <AddCardForm
                    activeToken={activeToken}
                    onSuccess={handleAddCardSuccess}
                    onCancel={() => setShowAddCard(false)}
                  />
                </Elements>
              </div>
            ) : (
              <button
                onClick={() => setShowAddCard(true)}
                className="flex items-center gap-2 text-sm font-semibold text-[#4A8F74] hover:text-[#3D7A62] transition-colors cursor-pointer w-fit"
              >
                <span className="w-7 h-7 rounded-full border-2 border-[#6AB092] flex items-center justify-center text-[#6AB092]">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                  </svg>
                </span>
                Adicionar cartão
              </button>
            )}
          </div>

          {/* Resumo do checkout */}
          {isCheckoutMode && (
            <div className="lg:w-80 shrink-0">
              <div className="bg-[#F2F2F2] rounded-3xl p-7 flex flex-col gap-5 sticky top-8">
                <h3 className="text-sm font-bold text-slate-700">Resumo</h3>

                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Consulta</span>
                    <span className="font-semibold text-slate-700">{formatCents(priceCents)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Desconto</span>
                    <span className="font-semibold text-green-600">– R$ 0,00</span>
                  </div>
                  <div className="border-t border-slate-200 pt-3 flex justify-between">
                    <span className="font-bold text-slate-700">Total</span>
                    <span className="font-bold text-slate-800 text-base">{formatCents(priceCents)}</span>
                  </div>
                </div>

                {selectedMethod && (
                  <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 border border-slate-200">
                    <span className="text-lg">💳</span>
                    <div>
                      <p className="text-xs font-bold text-slate-700 capitalize">
                        {selectedMethod.brand} •••• {selectedMethod.last4}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Vence {String(selectedMethod.expiresMonth).padStart(2, '0')}/{selectedMethod.expiresYear}
                      </p>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => checkout()}
                  disabled={checkingOut || !selectedMethodId || showAddCard}
                  className="w-full bg-[#5EBA91] hover:bg-[#4EAB82] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-3.5 rounded-full transition-colors shadow-sm cursor-pointer"
                >
                  {checkingOut ? 'Processando...' : `Pagar ${formatCents(priceCents)}`}
                </button>

                <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                  Pagamento processado com segurança via Stripe. Seus dados de cartão nunca são armazenados em nossos servidores.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}