import { Calendar, Clock, AlertTriangle, Loader2, Check, Ban } from 'lucide-react';

interface RescheduleProposal {
    id: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
    suggestedStartsAt: string;
    suggestedEndsAt: string;
    requestedBy: string;
    expiresAt: string;
}

interface RescheduleNegotiationProps {
    proposal: RescheduleProposal;
    isMyOwnProposal: boolean;
    loading: boolean;
    onConfirm: (confirmed: boolean) => void;
    onClose: () => void;
}

export default function RescheduleNegotiation({ proposal, isMyOwnProposal, loading, onConfirm, onClose }: RescheduleNegotiationProps) {
    return (
        <div className="flex flex-col gap-5">
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl text-blue-900 text-sm">
                <p className="font-bold text-base mb-1">📅 Proposta de Novo Horário</p>
                <p className="text-xs text-blue-700 mb-3">
                    {isMyOwnProposal 
                        ? "Você sugeriu esta alteração. Aguardando resposta da outra parte." 
                        : "A outra parte sugeriu modificar o horário desta consulta:"}
                </p>
                
                <div className="flex flex-col gap-2 font-medium bg-white p-3 rounded-xl border border-blue-200/50 text-slate-700">
                    <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-teal-600" />
                        <span>{new Date(proposal.suggestedStartsAt).toLocaleDateString('pt-BR', { dateStyle: 'long' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock size={16} className="text-teal-600" />
                        <span>
                            {new Date(proposal.suggestedStartsAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} às {' '}
                            {new Date(proposal.suggestedEndsAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-[11px] text-red-600 bg-red-50 p-2 rounded-lg border border-red-100">
                    <AlertTriangle size={14} className="shrink-0" />
                    <span>Responda até {new Date(proposal.expiresAt).toLocaleString('pt-BR')}, ou a consulta original será cancelada.</span>
                </div>
            </div>

            {!isMyOwnProposal ? (
                <footer className="flex gap-3">
                    <button 
                        disabled={loading} 
                        onClick={() => onConfirm(false)} 
                        className="flex-1 py-3 border-2 border-red-500 text-red-500 font-bold text-sm rounded-full hover:bg-red-50 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                    >
                        <Ban size={16} /> Recusar
                    </button>
                    <button 
                        disabled={loading} 
                        onClick={() => onConfirm(true)} 
                        className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-full flex items-center justify-center gap-2 shadow-sm transition-colors disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />} Aceitar
                    </button>
                </footer>
            ) : (
                <button 
                    onClick={onClose} 
                    className="w-full py-2.5 bg-slate-100 text-slate-600 font-bold text-sm rounded-full hover:bg-slate-200 transition-colors"
                >
                    Fechar e Aguardar
                </button>
            )}
        </div>
    );
}