import { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext'; 
import RescheduleForm from './RescheduleForm';
import RescheduleNegotiation from './RescheduleNegotiation';

interface Appointment {
    id: string;
    startsAt: string;
    endsAt: string;
    status: string;
    patientId: string;
    professionalId: string;
}

interface RescheduleProposal {
    id: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
    suggestedStartsAt: string;
    suggestedEndsAt: string;
    requestedBy: string;
    expiresAt: string;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    appointment: Appointment;
    onSuccess?: () => void;
}

export default function AppointmentRescheduleModal({ isOpen, onClose, appointment, onSuccess }: ModalProps) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [activeProposal, setActiveProposal] = useState<RescheduleProposal | null>(null);
    const [durationMinutes, setDurationMinutes] = useState(50);

    useEffect(() => {
        if (!isOpen) return;
        
        const fetchProposals = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`/api/reschedules/appointment/${appointment.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const proposals: RescheduleProposal[] = await response.json();
                    setActiveProposal(proposals.find(p => p.status === 'PENDING') || null);
                }
            } catch (err) { console.error(err); }
        };

        fetchProposals();

        const diff = (new Date(appointment.endsAt).getTime() - new Date(appointment.startsAt).getTime()) / (1000 * 60);
        if (diff > 0) setDurationMinutes(diff);
    }, [isOpen, appointment]);

    if (!isOpen) return null;

    const hoursUntilAppointment = (new Date(appointment.startsAt).getTime() - Date.now()) / (1000 * 60 * 60);
    const isBlockedByTime = hoursUntilAppointment < 8;

    const handleCreate = async (date: string, time: string) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const starts = new Date(`${date}T${time}:00`);
            const ends = new Date(starts.getTime() + durationMinutes * 60 * 1000);

            const response = await fetch('/api/reschedules', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ appointmentId: appointment.id, suggestedStartsAt: starts.toISOString(), suggestedEndsAt: ends.toISOString() })
            });

            if (response.ok) {
                toast.success("Proposta de reagendamento enviada!");
                if (onSuccess) onSuccess();
                onClose();
            } else {
                const err = await response.json();
                toast.error(err.message || "Erro ao processar alteração.");
            }
        } catch { toast.error("Erro de conexão."); } finally { setLoading(false); }
    };

    const handleConfirm = async (confirmed: boolean) => {
        if (!activeProposal) return;
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/reschedules/${activeProposal.id}/confirm`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ confirmed })
            });

            if (response.ok) {
                toast.success(confirmed ? "Horário atualizado com sucesso!" : "Proposta recusada.");
                if (onSuccess) onSuccess();
                onClose();
            } else {
                const err = await response.json();
                toast.error(err.message || "Erro ao responder proposta.");
            }
        } catch { toast.error("Erro de conexão."); } finally { setLoading(false); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden">
                <header className="flex items-center justify-between p-6 border-b bg-slate-50/50">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Reagendar Consulta</h3>
                        <p className="text-xs text-slate-500">Sincronizado com o Google Agenda.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 text-slate-400 rounded-full transition-colors"><X size={18} /></button>
                </header>

                <div className="p-6 overflow-y-auto max-h-[80vh]">
                    {isBlockedByTime && !activeProposal ? (
                        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex gap-3 text-amber-800 text-sm">
                            <AlertTriangle className="shrink-0 text-amber-600" size={20} />
                            <div>
                                <p className="font-bold">Ação não permitida</p>
                                <p className="text-xs mt-0.5 opacity-90">O reagendamento só é permitido com no mínimo 8 horas de antecedência.</p>
                            </div>
                        </div>
                    ) : activeProposal ? (
                        <RescheduleNegotiation 
                            proposal={activeProposal} 
                            isMyOwnProposal={activeProposal.requestedBy === user?.id} 
                            loading={loading} 
                            onConfirm={handleConfirm} 
                            onClose={onClose} 
                        />
                    ) : (
                        <RescheduleForm appointment={appointment} onSubmit={handleCreate} loading={loading} role={user?.role} />
                    )}
                </div>
            </div>
        </div>
    );
}