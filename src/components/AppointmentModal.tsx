import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';

interface AppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    appointmentId: string | null;
}

interface AppointmentDetails {
    id: string;
    patientId: string;
    professionalId: string;
    status: string;
    startsAt: string;
    endsAt: string;
    priceCents: number;
    confirmedAt?: string;
    canceledBy?: string;
    cancellationReason?: string;
    canceledAt?: string;
    completedAt?: string;
}

interface ProfessionalDetails {
    userId: string;
    crp: string;
    specialty: string;
    scoreAvg: string;
    user: {
        name: string;
        email: string;
        phone: string;
        bio: string;
        avatarUrl: string | null;
    };
}

export function AppointmentModal({ isOpen, onClose, appointmentId }: AppointmentModalProps) {
    const { token } = useAuth();
    const [appointment, setAppointment] = useState<AppointmentDetails | null>(null);
    const [professional, setProfessional] = useState<ProfessionalDetails | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen || !appointmentId) return;

        const fetchData = async () => {
            setLoading(true);
            const activeToken = token || localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${activeToken}` };

            try {
                const resApp = await fetch(`/api/appointments/${appointmentId}`, { headers });
                if (!resApp.ok) throw new Error("Erro ao buscar consulta");
                const appData: AppointmentDetails = await resApp.json();
                setAppointment(appData);

                if (appData.professionalId) {
                    const resProf = await fetch(`/api/professionals/${appData.professionalId}`, { headers });
                    if (resProf.ok) {
                        const profData: ProfessionalDetails = await resProf.json();
                        setProfessional(profData);
                    }
                }
            } catch (error) {
                console.error("Erro ao carregar detalhes do modal:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isOpen, appointmentId, token]);

    if (!isOpen) return null;

    const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150";

    // Formatação de valores e datas
    const formatCurrency = (cents: number) => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('pt-BR');
    const formatTime = (dateStr: string) => new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    // Tradução de status
    const statusTranslate: Record<string, string> = {
        SCHEDULED: "Agendada",
        COMPLETED: "Concluída",
        CANCELED: "Cancelada"
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col relative">
                {/* Botão Fechar */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="p-8 pb-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Detalhes da Consulta</h2>
                </div>

                <div className="p-8 pt-6">
                    {loading ? (
                        <div className="flex justify-center items-center h-40 text-gray-500">Carregando informações...</div>
                    ) : (
                        <div className="space-y-6">
                            {/* Profissional Info */}
                            {professional && (
                                <div className="flex items-center gap-4 bg-[#F2F2F2] p-4 rounded-2xl">
                                    <img 
                                        src={professional.user.avatarUrl || DEFAULT_AVATAR} 
                                        alt={professional.user.name} 
                                        className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                                    />
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-800">{professional.user.name}</h3>
                                        <p className="text-sm text-slate-500">{professional.specialty}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">CRP: {professional.crp}</p>
                                    </div>
                                </div>
                            )}

                            {/* Consulta Info */}
                            {appointment && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 border border-gray-100 p-4 rounded-2xl">
                                        <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Data</span>
                                        <span className="text-slate-800 font-medium">{formatDate(appointment.startsAt)}</span>
                                    </div>
                                    <div className="bg-slate-50 border border-gray-100 p-4 rounded-2xl">
                                        <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Horário</span>
                                        <span className="text-slate-800 font-medium">
                                            {formatTime(appointment.startsAt)} - {formatTime(appointment.endsAt)}
                                        </span>
                                    </div>
                                    <div className="bg-slate-50 border border-gray-100 p-4 rounded-2xl">
                                        <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Valor</span>
                                        <span className="text-slate-800 font-medium">{formatCurrency(appointment.priceCents)}</span>
                                    </div>
                                    <div className="bg-slate-50 border border-gray-100 p-4 rounded-2xl">
                                        <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Status</span>
                                        <span className={`font-medium ${
                                            appointment.status === 'SCHEDULED' ? 'text-amber-600' : 
                                            appointment.status === 'COMPLETED' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {statusTranslate[appointment.status] || appointment.status}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-6 bg-gray-50 mt-auto border-t border-gray-100 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 px-6 rounded-full transition-colors"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}