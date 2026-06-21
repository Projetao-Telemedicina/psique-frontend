import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext'; 

const formatCents = (cents: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
const formatDate = (iso: string | null) => iso ? new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';
const billingCycleLabel: Record<string, string> = { MONTHLY: 'mês', QUARTERLY: 'trimestre', YEARLY: 'ano' };
const statusConfig: Record<string, any> = {
  ACTIVE: { label: 'Ativa', color: 'text-[#4A8F74]', bg: 'bg-[#BCE3D0]' },
  PENDING: { label: 'Pendente', color: 'text-amber-700', bg: 'bg-amber-100' },
  OVERDUE: { label: 'Inadimplente', color: 'text-red-700', bg: 'bg-red-100' },
  CANCELED: { label: 'Cancelada', color: 'text-slate-500', bg: 'bg-slate-200' },
  EXPIRED: { label: 'Expirada', color: 'text-slate-500', bg: 'bg-slate-200' },
};

export function SubscriptionCard({ subscription }: { subscription: any }) {
  const navigate = useNavigate();
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [showCancelModal, setShowCancelModal] = useState(false);

  const { mutate: cancel, isPending: canceling } = useMutation({
    mutationFn: async () => {
      const activeToken = token || localStorage.getItem('token');
      const res = await fetch(`/api/subscriptions/${subscription.id}/cancel`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${activeToken}`, 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Falha ao cancelar');
    },
    onSuccess: () => {
      toast.success('Assinatura cancelada com sucesso.');
      setShowCancelModal(false);
      queryClient.invalidateQueries({ queryKey: ['mySubscription'] });
    },
    onError: () => toast.error('Erro ao cancelar assinatura.'),
  });

  const canCancel = subscription && ['ACTIVE', 'PENDING', 'OVERDUE'].includes(subscription.status) && !subscription.cancelAtPeriodEnd;

  return (
    <>
      <div className="flex flex-col gap-4 w-full">
        {/* Card Visual */}
        <div className="bg-[#F2F2F2] rounded-3xl p-7 flex flex-col gap-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800">{subscription.plan.name}</h2>
              {subscription.plan.description && <p className="text-xs text-slate-400 mt-0.5">{subscription.plan.description}</p>}
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full shrink-0 ${statusConfig[subscription.status]?.bg} ${statusConfig[subscription.status]?.color}`}>
              {statusConfig[subscription.status]?.label}
            </span>
          </div>

          <div className="flex items-end gap-1">
            <p className="text-3xl font-bold text-slate-800">{formatCents(subscription.plan.priceCents)}</p>
            <p className="text-sm text-slate-400 mb-0.5">/{billingCycleLabel[subscription.plan.billingCycle] ?? subscription.plan.billingCycle.toLowerCase()}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white rounded-2xl px-4 py-3">
              <p className="text-xs font-semibold text-slate-400 mb-0.5">Período atual</p>
              <p className="font-semibold text-slate-700 text-xs">{formatDate(subscription.currentPeriodStart)} → {formatDate(subscription.currentPeriodEnd)}</p>
            </div>
            <div className="bg-white rounded-2xl px-4 py-3">
              <p className="text-xs font-semibold text-slate-400 mb-0.5">Início</p>
              <p className="font-semibold text-slate-700 text-xs">{formatDate(subscription.createdAt)}</p>
            </div>
          </div>

          {subscription.cancelAtPeriodEnd && (
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
              <p className="text-xs text-amber-700 font-medium">Cancelamento agendado até {formatDate(subscription.currentPeriodEnd)}.</p>
            </div>
          )}

          <div>
            <p className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">Benefícios</p>
            <ul className="flex flex-col gap-1.5">
              {subscription.plan.benefits.map((b: string, i: number) => (
                <li key={i} className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6AB092]" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Ações */}
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => navigate('/planos')}
            className="w-full bg-[#5EBA91] hover:bg-[#4EAB82] text-white text-sm font-semibold py-3 rounded-full transition-colors cursor-pointer"
          >
            Ver todos os planos
          </button>
          {canCancel && (
            <button onClick={() => setShowCancelModal(true)} className="w-full bg-transparent hover:bg-red-50 text-red-500 text-sm font-semibold py-3 rounded-full border border-red-200 transition-colors cursor-pointer">
              Cancelar assinatura
            </button>
          )}
        </div>
      </div>

      {/* Modal interno de cancelamento */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-sm bg-[#EAEAEA] rounded-3xl p-8 shadow-2xl flex flex-col gap-6">
            <button onClick={() => setShowCancelModal(false)} className="absolute top-6 right-6 text-slate-500 hover:text-slate-800 text-xl cursor-pointer">✕</button>
            <h2 className="text-xl font-bold text-slate-800">Cancelar assinatura?</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Seu acesso continuará ativo até o fim do período atual ({formatDate(subscription.currentPeriodEnd)}). Após isso, a assinatura não será renovada.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowCancelModal(false)} disabled={canceling} className="flex-1 bg-slate-200 py-3 rounded-full font-semibold text-slate-700">Manter</button>
              <button onClick={() => cancel()} disabled={canceling} className="flex-1 bg-red-500 py-3 rounded-full font-semibold text-white">
                {canceling ? 'Cancelando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}