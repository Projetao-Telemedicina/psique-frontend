import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Appointment {
    id: string;
    startsAt: string;
    endsAt: string;
    status: string;
    patientId: string;
    professionalId: string;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    appointment: Appointment;
    onSuccess?: () => void;
}

export default function CancelAppointmentModal({ isOpen, onClose, appointment, onSuccess }: ModalProps) {
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    if (!isOpen) return null;

    // Calcula a antecedência da consulta em horas
    const hoursUntilAppointment = (new Date(appointment.startsAt).getTime() - Date.now()) / (1000 * 60 * 60);
    const isLessThan24h = hoursUntilAppointment < 24;

    const handleConfirmCancel = async () => {
        try {
            setLoading(true);
            setErrorMessage(null);
            const token = localStorage.getItem('token');

            const response = await fetch(`/api/appointments/${appointment.id}/cancel`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    canceledBy: 'PATIENT', 
                    cancellationReason: reason || undefined
                })
            });

            if (response.ok) {
                toast.success("Cancelamento confirmado. O valor pago será convertido em créditos no sistema.", {
                    duration: 5000
                });
                if (onSuccess) onSuccess();
                onClose();
            } else {
                
                const err = await response.json();
                const msg = err.message || "Erro ao processar o cancelamento.";
                setErrorMessage(msg);
                toast.error("Não foi possível cancelar a consulta.");
            }
        } catch {
            toast.error("Erro de conexão.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden">
                
                {/* Cabeçalho no padrão do módulo */}
                <header className="flex items-center justify-between p-6 border-b bg-slate-50/50">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Cancelar Consulta</h3>
                        <p className="text-xs text-slate-500">Esta ação liberará o horário na agenda.</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 hover:bg-slate-200 text-slate-400 rounded-full transition-colors"
                        disabled={loading}
                    >
                        <X size={18} />
                    </button>
                </header>

                <div className="p-6 overflow-y-auto max-h-[80vh] flex flex-col gap-4">
                    
                    {/* Alerta Preventivo Visual (Menos de 24h) antes do envio */}
                    {isLessThan24h && !errorMessage && (
                        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex gap-3 text-amber-800 text-sm">
                            <AlertTriangle className="shrink-0 text-amber-600" size={20} />
                            <div>
                                <p className="font-bold">Atenção ao Prazo</p>
                                <p className="text-xs mt-0.5 opacity-90">
                                    Este cancelamento está fora do prazo gratuito e está sujeito à retenção de taxas.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Alerta Crítico */}
                    {errorMessage && (
                        <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex gap-3 text-red-800 text-sm">
                            <AlertTriangle className="shrink-0 text-red-600" size={20} />
                            <div>
                                <p className="font-bold">Cancelamento Retido</p>
                                <p className="text-xs mt-0.5 opacity-90">{errorMessage}</p>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700">
                            Justificativa do Cancelamento
                        </label>
                        <textarea
                            className="w-full p-3.5 border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm text-slate-800 resize-none transition-all"
                            rows={4}
                            placeholder="Por favor, descreva o motivo do cancelamento..."
                            maxLength={500}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            disabled={loading || !!errorMessage}
                        />
                        <div className="text-right text-xs text-slate-400">
                            {reason.length}/500 caracteres
                        </div>
                    </div>
                </div>

                {/* Botões de Ação baseados no Estado */}
                <footer className="px-6 py-4 bg-slate-50/50 flex justify-end gap-3 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                        {errorMessage ? 'Fechar' : 'Manter Consulta'}
                    </button>

                    {/* Oculta o botão se o back-end já tiver bloqueado a operação */}
                    {!errorMessage && (
                        <button
                          type="button"
                          onClick={handleConfirmCancel}
                          disabled={loading}
                          className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50"
                        >
                          {loading ? 'Processando...' : 'Confirmar Cancelamento'}
                        </button>
                    )}
                </footer>

            </div>
        </div>
    );
}