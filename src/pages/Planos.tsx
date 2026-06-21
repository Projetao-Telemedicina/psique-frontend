import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery} from '@tanstack/react-query';
import Sidebar from '../components/Sidebar';
import EmergencyButton from '../components/EmergencyButton';
import { EmergencyModal } from '../components/EmergencyModal';
import { useAuth } from '../components/AuthContext';
import {CheckoutModal} from '../components/CheckoutModal';

interface Plan {
  id: string;
  name: string;
  description: string | null;
  priceCents: number;
  billingCycle: string;
  benefits: string[];
}

interface SubscriptionCheckoutResponse {
  id: string;
  subscriptionId: string | null;
  status: string;
  finalAmountCents: number;
  subscriptionActivated: boolean;
  warning: string | null;
}

const formatCents = (cents: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);

const billingCycleLabel: Record<string, string> = {
  MONTHLY: 'mês',
  QUARTERLY: 'trimestre',
  YEARLY: 'ano',
};

export default function Planos() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [checkoutResult, setCheckoutResult] = useState<SubscriptionCheckoutResponse | null>(null);

  const activeToken = token || localStorage.getItem('token');
  const authHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
  };

  const { data: plans = [], isLoading } = useQuery<Plan[]>({
    queryKey: ['plans', activeToken],
    queryFn: async () => {
      const res = await fetch('/api/plans', { headers: authHeaders });
      if (!res.ok) throw new Error('Erro ao carregar planos.');
      return res.json();
    },
    enabled: !!activeToken,
  });

  if (checkoutResult?.subscriptionActivated) {
    return (
      <main className="flex h-screen w-full overflow-hidden bg-white font-sans antialiased text-slate-800">
        <Sidebar role="paciente" itemAtivo="perfil" />
        <section className="flex flex-col flex-1 items-center justify-center px-8">
          <div className="flex flex-col items-center gap-5 max-w-sm text-center">
            <div className="w-20 h-20 rounded-full bg-[#BCE3D0] flex items-center justify-center">
              <svg className="w-10 h-10 text-[#4A8F74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Assinatura ativada!</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Seu plano está ativo. Aproveite todos os benefícios.
            </p>
            <button
              onClick={() => navigate('/paciente/home')}
              className="mt-4 bg-[#5EBA91] hover:bg-[#4EAB82] text-white text-sm font-semibold px-8 py-3 rounded-full transition-colors shadow-sm cursor-pointer"
            >
              Ir para o início
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="flex h-screen w-full overflow-hidden bg-white font-sans antialiased text-slate-800">
      <Sidebar role="paciente" itemAtivo="planos" />

      <EmergencyModal isOpen={showEmergencyModal} onClose={() => setShowEmergencyModal(false)} />

      {selectedPlan && (
        <CheckoutModal
          title={selectedPlan.name}
          priceCents={selectedPlan.priceCents}
          authHeaders={authHeaders}
          onClose={() => setSelectedPlan(null)}
          onCheckout={async (methodId) => {
            const res = await fetch('/api/subscriptions/checkout', {
              method: 'POST',
              headers: authHeaders,
              body: JSON.stringify({ planId: selectedPlan.id, paymentMethodId: methodId }),
            });
            const data = await res.json();
            if (!res.ok) throw data;
            setCheckoutResult(data);
            setSelectedPlan(null);
            return data;
          }}
        >
        </CheckoutModal>
      )}

      <section className="flex flex-col flex-1 overflow-y-auto scrollbar-thin">
        <header className="flex items-center justify-between px-12 py-8 border-b border-slate-100 shrink-0">
          <div className="text-left">
            <h1 className="text-3xl font-bold text-[#1E293B]">Planos</h1>
            <p className="text-slate-500 text-sm mt-0.5">Escolha o plano ideal para o seu acompanhamento</p>
          </div>
          { user?.role === 'PATIENT' && (
            <EmergencyButton onClick={() => setShowEmergencyModal(true)} />
          )}
        </header>

        <div className="px-12 py-10 flex flex-col gap-8 max-w-5xl w-full">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 rounded-3xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : plans.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <p className="text-sm font-semibold text-slate-400">Nenhum plano disponível no momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {plans.map((plan, idx) => {
                const isHighlighted = idx === 1;
                const cycle = billingCycleLabel[plan.billingCycle] ?? plan.billingCycle.toLowerCase();
                return (
                  <div
                    key={plan.id}
                    className={`relative flex flex-col rounded-3xl p-7 gap-5 transition-all ${
                      isHighlighted
                        ? 'bg-[#1E293B] text-white shadow-xl scale-[1.03]'
                        : 'bg-[#F2F2F2] text-slate-800'
                    }`}
                  >
                    {isHighlighted && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#5EBA91] text-white text-[10px] font-bold px-4 py-1 rounded-full whitespace-nowrap">
                        MAIS POPULAR
                      </span>
                    )}

                    <div>
                      <h3 className={`text-lg font-bold ${isHighlighted ? 'text-white' : 'text-slate-800'}`}>
                        {plan.name}
                      </h3>
                      {plan.description && (
                        <p className={`text-xs mt-1 ${isHighlighted ? 'text-slate-400' : 'text-slate-400'}`}>
                          {plan.description}
                        </p>
                      )}
                    </div>

                    <div>
                      <p className={`text-3xl font-bold ${isHighlighted ? 'text-white' : 'text-slate-800'}`}>
                        {formatCents(plan.priceCents)}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">por {cycle}</p>
                    </div>

                    <ul className="flex flex-col gap-2 flex-1">
                      {plan.benefits.map((benefit, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2">
                          <svg
                            className={`w-4 h-4 mt-0.5 shrink-0 ${isHighlighted ? 'text-[#5EBA91]' : 'text-[#6AB092]'}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className={`text-xs font-medium ${isHighlighted ? 'text-slate-300' : 'text-slate-600'}`}>
                            {benefit}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => setSelectedPlan(plan)}
                      className={`w-full py-3 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
                        isHighlighted
                          ? 'bg-[#5EBA91] hover:bg-[#4EAB82] text-white'
                          : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200'
                      }`}
                    >
                      Assinar
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}