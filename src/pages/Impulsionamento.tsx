import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../components/AuthContext';
import {CheckoutModal} from '../components/CheckoutModal';

interface PromotionPlan {
  id: string;
  name: string;
  description: string | null;
  priceCents: number;
  durationDays: number;
}

interface PromotionCheckoutResponse {
  id: string;
  promotionId: string | null;
  status: string;
  finalAmountCents: number;
  promotionActivated: boolean;
  startsAt: string | null;
  endsAt: string | null;
  isPromoted: boolean;
}

const formatCents = (cents: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);

const formatDate = (iso: string | null) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
};

const pluralDays = (days: number) => `${days} ${days === 1 ? 'dia' : 'dias'}`;

export default function Impulsionamento() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [selectedPlan, setSelectedPlan] = useState<PromotionPlan | null>(null);
  const [checkoutResult, setCheckoutResult] = useState<PromotionCheckoutResponse | null>(null);

  const activeToken = token || localStorage.getItem('token');
  const authHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
  };

  const { data: plans = [], isLoading } = useQuery<PromotionPlan[]>({
    queryKey: ['promotionPlans', activeToken],
    queryFn: async () => {
      const res = await fetch('/api/promotion-plans', { headers: authHeaders });
      if (!res.ok) throw new Error('Erro ao carregar planos de impulsionamento.');
      return res.json();
    },
    enabled: !!activeToken,
  });

  // ── Tela de sucesso ──
  if (checkoutResult?.promotionActivated) {
    return (
      <main className="flex h-screen w-full overflow-hidden bg-white font-sans antialiased text-slate-800">
        <Sidebar role="profissional" itemAtivo="perfil" />
        <section className="flex flex-col flex-1 items-center justify-center px-8">
          <div className="flex flex-col items-center gap-5 max-w-sm text-center">
            <div className="w-20 h-20 rounded-full bg-[#BCE3D0] flex items-center justify-center">
              <svg className="w-10 h-10 text-[#4A8F74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Perfil impulsionado!</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Seu perfil será destacado até{' '}
              <span className="font-semibold text-slate-600">{formatDate(checkoutResult.endsAt)}</span>.
            </p>
            <button
              onClick={() => navigate('/profissional/home')}
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
      <Sidebar role="profissional" itemAtivo="perfil" />

      {selectedPlan && (
        <CheckoutModal
          title={selectedPlan.name}
          priceCents={selectedPlan.priceCents}
          authHeaders={authHeaders}
          onClose={() => setSelectedPlan(null)}
          onCheckout={async (methodId) => {
            const res = await fetch('/api/promotions/checkout', {
              method: 'POST',
              headers: authHeaders,
              body: JSON.stringify({ promotionPlanId: selectedPlan.id, paymentMethodId: methodId }),
            });
            const data = await res.json();
            if (!res.ok) throw data;
            setCheckoutResult(data);
            setSelectedPlan(null);
            return data;
          }}
        >
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs font-semibold text-slate-500 bg-slate-200 px-3 py-1 rounded-full">
              {pluralDays(selectedPlan.durationDays)}
            </span>
          </div>
          {selectedPlan.description && (
            <p className="text-xs text-slate-400 mt-1">{selectedPlan.description}</p>
          )}
        </CheckoutModal>
      )}

      <section className="flex flex-col flex-1 overflow-y-auto scrollbar-thin">
        <header className="flex items-center justify-between px-12 py-8 border-b border-slate-100 shrink-0">
          <div className="text-left">
            <h1 className="text-3xl font-bold text-[#1E293B]">Impulsionamento</h1>
            <p className="text-slate-500 text-sm mt-0.5">Destaque seu perfil e atraia mais pacientes</p>
          </div>
        </header>

        <div className="px-12 py-10 max-w-5xl w-full flex flex-col gap-8">
          {/* Explicação */}
          <div className="bg-[#F0FAF5] border border-[#BCE3D0] rounded-3xl p-6 flex gap-4">
            <div className="w-10 h-10 rounded-full bg-[#BCE3D0] flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-[#4A8F74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-[#4A8F74]">Como funciona o impulsionamento?</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Ao impulsionar seu perfil, você aparece com destaque nos resultados de busca de pacientes pelo período escolhido. O impulsionamento é ativado imediatamente após o pagamento.
              </p>
            </div>
          </div>

          {/* Grade de planos */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-56 rounded-3xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : plans.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <p className="text-sm font-semibold text-slate-400">Nenhum plano de impulsionamento disponível no momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan, idx) => {
                const isHighlighted = idx === Math.floor(plans.length / 2);
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
                        MELHOR CUSTO-BENEFÍCIO
                      </span>
                    )}

                    {/* Duração em destaque */}
                    <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center ${isHighlighted ? 'bg-white/10' : 'bg-white'}`}>
                      <p className={`text-xl font-bold leading-none ${isHighlighted ? 'text-white' : 'text-slate-800'}`}>
                        {plan.durationDays}
                      </p>
                      <p className={`text-[10px] font-semibold ${isHighlighted ? 'text-slate-400' : 'text-slate-400'}`}>dias</p>
                    </div>

                    <div>
                      <h3 className={`text-lg font-bold ${isHighlighted ? 'text-white' : 'text-slate-800'}`}>{plan.name}</h3>
                      {plan.description && (
                        <p className={`text-xs mt-1 ${isHighlighted ? 'text-slate-400' : 'text-slate-400'}`}>{plan.description}</p>
                      )}
                    </div>

                    <div className="flex-1">
                      <p className={`text-3xl font-bold ${isHighlighted ? 'text-white' : 'text-slate-800'}`}>
                        {formatCents(plan.priceCents)}
                      </p>
                      <p className={`text-xs mt-0.5 ${isHighlighted ? 'text-slate-400' : 'text-slate-400'}`}>pagamento único</p>
                    </div>

                    <button
                      onClick={() => setSelectedPlan(plan)}
                      className={`w-full py-3 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
                        isHighlighted
                          ? 'bg-[#5EBA91] hover:bg-[#4EAB82] text-white'
                          : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200'
                      }`}
                    >
                      Contratar
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