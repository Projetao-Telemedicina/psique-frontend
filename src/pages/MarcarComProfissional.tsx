import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import EmergencyButton from '../components/EmergencyButton';
import { EmergencyModal } from "../components/EmergencyModal";
import { useAuth } from '../components/AuthContext';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import StatCard from '../components/StatCard';
import { CheckCircle, Timer, Users, Star } from 'lucide-react';
const DEFAULT_AVATAR = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

interface ProfessionalData {
    id: string;
    crp: string;
    specialty: string;
    scoreAvg: string;
    reviewCount: number;
    sessionsCompleted?: number;
    hoursAttended?: number;
    clientsAttended?: number;
    user: {
        name: string;
        bio: string | null;
        avatarUrl: string | null;
    };
    tags?: string[];
}

interface Review {
    id: string;
    rating: number;
    comment: string;
}

interface Slot {
    time: string;
    status: 'available' | 'unavailable';
}

interface DaySchedule {
    date: string;
    slots: Slot[];
}


export default function MarcarComProfissional() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const [showEmergencyModal, setShowEmergencyModal] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string } | null>(null);
    const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);

    const activeToken = token || localStorage.getItem('token');
    const queryClient = useQueryClient();

    const [stats, setStats] = useState({ 
        sessionsCompleted: 0, 
        hoursAttended: 0, 
        clientsAttended: 0 
    });


    // --- QUERY PARA DETALHES DO PROFISSIONAL E GRADE DE HORÁRIOS ---
    const { data: profData, isLoading: loading } = useQuery({
        queryKey: ['professionalDetails', id, activeToken],
        queryFn: async () => {
            if (!id) throw new Error("ID do profissional não fornecido");

            const headers: HeadersInit = activeToken ? {
                'Authorization': `Bearer ${activeToken}`,
                'Content-Type': 'application/json'
            } : { 'Content-Type': 'application/json' };

            // 1. Busca os dados do profissional
            const resProf = await fetch(`/api/professionals/${id}`, { headers });
            if (!resProf.ok) throw new Error('Erro ao buscar profissional');
            const dataProf = await resProf.json();

            // 2. Prepara os próximos 6 dias para consulta
            const hoje = new Date();
            const diasParaConsultar = Array.from({ length: 6 }).map((_, i) => {
                const d = new Date(hoje);
                d.setDate(hoje.getDate() + i);
                return {
                    exibicao: d.toLocaleDateString('pt-BR'), // DD/MM/YYYY
                    api: d.toISOString().split('T')[0]        // YYYY-MM-DD
                };
            });

            // 3. Busca os horários disponíveis para cada dia 
            const gradeHorarios = await Promise.all(diasParaConsultar.map(async (dia) => {
                const resSlots = await fetch(`/api/professionals/${id}/available-slots?date=${dia.api}`, { headers });
                const slots = resSlots.ok ? await resSlots.json() : [];

                return {
                    date: dia.exibicao,
                    slots: slots.map((s: { startsAt: string }) => ({
                        time: new Date(s.startsAt).toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            timeZone: 'UTC' // Importante para não deslocar a hora
                        }),
                        status: 'available' as const
                    }))
                };
            }));

            // Formatação do perfil
            const profFormatado: ProfessionalData = {
                id: dataProf.id || id,
                crp: dataProf.crp || "Registro não informado",
                specialty: dataProf.specialty || "Psicologia",
                scoreAvg: dataProf.scoreAvg || "0",
                reviewCount: dataProf.reviewCount || 0,
                sessionsCompleted: dataProf.sessionsCompleted || 0,
                hoursAttended: dataProf.hoursAttended || 0,
                clientsAttended: dataProf.clientsAttended || 0,
                tags: dataProf.tags || [],
                user: {
                    name: dataProf.user?.name || dataProf.name || 'Profissional',
                    bio: dataProf.user?.bio || dataProf.bio || "Nenhuma biografia disponível.",
                    avatarUrl: dataProf.user?.avatarUrl || dataProf.avatarUrl || null,
                }
            };

            return { prof: profFormatado, gradeHorarios };
        },
        enabled: !!id,
    });

    const prof = profData?.prof;
    const gradeHorarios = profData?.gradeHorarios || [];

    useEffect(() => {
        const fetchHistoryAndCalculate = async () => {
            if (!prof?.id || !activeToken) return;

            try {
                const res = await fetch(`/api/appointments/me/history?limit=100`, { 
                    headers: { 'Authorization': `Bearer ${activeToken}` } 
                });
                const data = await res.json();
            
                const completed = data.filter((a: any) => a.status === 'COMPLETED');
            
                setStats({
                    sessionsCompleted: completed.length,
                    hoursAttended: completed.length * 1,
                    clientsAttended: new Set(completed.map((a: any) => a.patientId)).size
                });
            } catch (error) {
                console.error("Erro ao calcular estatísticas:", error);
            }
        };

        fetchHistoryAndCalculate();
    }, [prof?.id, activeToken]);

    // --- QUERY PARA AS AVALIAÇÕES (LAZY LOADING) ---
    const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
        queryKey: ['professionalReviews', id, activeToken],
        queryFn: async () => {
            const headers: HeadersInit = activeToken ? {
                'Authorization': `Bearer ${activeToken}`,
                'Content-Type': 'application/json'
            } : { 'Content-Type': 'application/json' };

            const res = await fetch(`/api/professionals/${id}/reviews?page=1&limit=10`, { headers });
            if (!res.ok) throw new Error('Falha ao carregar as avaliações');
            return res.json();
        },
        // Só executa a requisição se o modal de avaliações estiver aberto
        enabled: isReviewsModalOpen && !!id,
    });

    // --- MUTATION PARA CRIAR O AGENDAMENTO ---
    const { mutate: confirmarAgendamento, isPending: bookingLoading } = useMutation({
        mutationFn: async (slot: { date: string; time: string }) => {
            if (!prof) return;

            const [dia, mes, ano] = slot.date.split('/');
            const [hora, min] = slot.time.split(':');

            const startsAtDate = new Date(Number(ano), Number(mes) - 1, Number(dia), Number(hora), Number(min));
            const durationMs = 60 * 60000; 
            const endsAtDate = new Date(startsAtDate.getTime() + durationMs);

            const patientId = user?.id || localStorage.getItem('userId');

            const payloadBody = {
                professionalId: prof.id,
                patientId: patientId,
                startsAt: startsAtDate.toISOString(),
                endsAt: endsAtDate.toISOString(),
                priceCents: 15000
            };

            const res = await fetch('/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(activeToken ? { 'Authorization': `Bearer ${activeToken}` } : {})
                },
                body: JSON.stringify(payloadBody)
            });

            const data = await res.json();
            if (!res.ok) throw data;
            return data;
        },
        onSuccess: (data) => {
            toast.success(data?.message || 'Consulta agendada com sucesso!');
            setIsModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ['professionalDetails'] });
            navigate('/paciente/home');
        },
        onError: (error: any) => {
            console.error('Erro no servidor:', error);
            const errorMessage = Array.isArray(error?.message) ? error.message.join(', ') : error?.message;
            toast.error(errorMessage || 'Falha no servidor ao agendar.');
        }
    });

    const handleAbrirConfirmacao = (dateStr: string, timeStr: string) => {
        setSelectedSlot({ date: dateStr, time: timeStr });
        setIsModalOpen(true);
    };

    const handleConfirmarAgendamento = () => {
        if (selectedSlot) {
            confirmarAgendamento(selectedSlot);
        }
    };

    const renderStars = (scoreAvg: string | number, reviewCount?: number) => {
        const parsedScore = typeof scoreAvg === 'string' ? parseFloat(scoreAvg || '0') : scoreAvg;

        if (reviewCount === 0 || parsedScore === 0) {
            return <span className="text-xs text-gray-400 font-normal">Sem avaliações</span>;
        }

        const numStars = Math.round(parsedScore);

        return (
            <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5 text-amber-400 text-sm tracking-tighter select-none">
                    {"★".repeat(Math.max(0, Math.min(5, numStars)))}
                    <span className="text-gray-300">
                        {"★".repeat(Math.max(0, Math.min(5, 5 - numStars)))}
                    </span>
                </div>
                <span className="text-xs font-bold text-slate-600">
                    {Number(scoreAvg).toFixed(2)}
                </span>
            </div>
        );
    };

    if (loading) return <div className="flex h-screen items-center justify-center bg-white">Carregando dados...</div>;
    if (!prof) return <div className="flex h-screen items-center justify-center bg-white text-red-500">Profissional não encontrado.</div>;

    const primeiroNomeProfissional = prof.user.name.split(' ')[0] || "Profissional";

    return (
        <main className="flex h-screen w-full overflow-hidden bg-white font-sans antialiased text-slate-800">
            <Sidebar
                role={user?.role === 'PATIENT' ? 'paciente' : 'profissional'}
                itemAtivo="home"
            />

            <EmergencyModal
                isOpen={showEmergencyModal}
                onClose={() => setShowEmergencyModal(false)}
            />

            <section className="flex flex-col flex-1 overflow-y-auto px-12 py-8 scrollbar-thin">
                <header className="flex items-center justify-between mb-10 shrink-0">
                    <h1 className="text-sm font-semibold text-slate-500">Profissional</h1>
                    <EmergencyButton onClick={() => setShowEmergencyModal(true)} />
                </header>

                <div className="flex flex-col max-w-6xl w-full gap-8">
                    {/* Perfil */}
                    <div className="flex flex-col md:flex-row items-start gap-8 w-full">
                        <img src={prof.user.avatarUrl || DEFAULT_AVATAR} alt={prof.user.name} className="w-28 h-28 rounded-full object-cover shadow-sm bg-gray-100 shrink-0" />
                        <div className="flex-1 space-y-2 mt-2">
                            <div className="flex items-center gap-4">
                                <h2 className="text-xl font-bold text-slate-800">{prof.user.name}</h2>
                                {renderStars(prof.scoreAvg)}
                            </div>
                            <p
                                onClick={() => setIsReviewsModalOpen(true)}
                                className="text-sm text-gray-400 font-medium cursor-pointer hover:text-slate-600 transition-colors inline-block"
                            >
                                Ver avaliações &gt;
                            </p>
                            <p className="text-base text-slate-700 leading-relaxed max-w-2xl mt-2 text-left">{prof.user.bio}</p>
                        </div>
                        <div className="md:w-64 shrink-0 mt-2">
                            <h3 className="text-sm font-semibold text-slate-600 mb-3">Atuações e perfil</h3>
                            <div className="flex flex-wrap gap-2">
                                {prof.tags?.map((tag, idx) => (
                                    <span key={idx} className="bg-[#BCE3D0] text-[#4A8F74] text-xs font-semibold px-4 py-1 rounded-full">{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Cards de Estatísticas */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard 
                            value={stats.sessionsCompleted} 
                            label="Sessões concluídas" 
                            icon={<CheckCircle size={40} className="text-slate-600" />} 
                        />
                        <StatCard 
                            value={stats.hoursAttended} 
                            label="Horas de atendimento" 
                            icon={<Timer size={40} className="text-slate-600" />} 
                        />
                        <StatCard 
                            value={stats.clientsAttended} 
                            label="Clientes atendidos" 
                            icon={<Users size={40} className="text-slate-600" />} 
                        />
                        <StatCard 
                            value={prof.reviewCount} 
                            label="Avaliações" 
                            icon={<Star size={40} className="text-slate-600" />} 
                        />
                    </div>

                    {/* Grade de Horários */}
                    <div className="mt-4">
                        <h3 className="text-sm font-bold text-slate-600 mb-1">Próximos horários disponíveis</h3>
                        <p className="text-xs text-gray-400 mb-6">
                            Para marcar uma consulta com este profissional, clique no horário que deseja e depois confirme.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 pb-12">
                            {gradeHorarios.map((dia: DaySchedule, idx: number) => (
                                <div key={idx} className="flex flex-col gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-full border border-blue-400 text-blue-500">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                            </svg>
                                        </div>
                                        <span className="font-bold text-sm text-slate-800">{dia.date}</span>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2">
                                        {dia.slots.map((slot, sIdx) => (
                                            <button
                                                key={sIdx}
                                                disabled={slot.status === 'unavailable' || bookingLoading}
                                                onClick={() => handleAbrirConfirmacao(dia.date, slot.time)}
                                                className={`py-1.5 px-2 rounded-full text-xs font-bold transition-transform ${slot.status === 'available'
                                                    ? 'bg-[#6AB092] hover:bg-[#599A7D] text-white cursor-pointer active:scale-95 shadow-sm'
                                                    : 'bg-[#6D6D6D] text-white cursor-not-allowed opacity-90'
                                                    }`}
                                            >
                                                {slot.time}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* MODAL DE CONFIRMAÇÃO DE AGENDAMENTO */}
            {isModalOpen && selectedSlot && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
                    <div className="relative w-[500px] bg-[#EAEAEA] rounded-[4px] p-10 pt-12 shadow-2xl text-left font-sans">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-6 right-6 text-black hover:text-gray-700 text-2xl font-light cursor-pointer transition-colors"
                        >
                            ✕
                        </button>

                        <h2 className="text-[32px] font-normal tracking-tight text-[#000000] mb-6">
                            {prof.user.name}
                        </h2>

                        <p className="text-[24px] font-normal text-[#000000] mb-0.5">
                            {selectedSlot.date} às {selectedSlot.time}
                        </p>

                        <p className="text-[14px] font-bold text-[#7A7A7A] mb-8">
                            Horário livre
                        </p>

                        <button
                            onClick={handleConfirmarAgendamento}
                            disabled={bookingLoading}
                            className="w-full bg-[#5EBA91] hover:bg-[#4EAB82] text-white text-[16px] font-semibold py-3.5 rounded-full transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                        >
                            {bookingLoading ? 'Processando...' : 'Agendar'}
                        </button>
                    </div>
                </div>
            )}

            {/* MODAL DE AVALIAÇÕES */}
            {isReviewsModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs p-4">
                    <div className="relative w-full max-w-4xl bg-[#EEEEEE] rounded-3xl p-10 max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
                        <button
                            onClick={() => setIsReviewsModalOpen(false)}
                            className="absolute top-8 right-8 text-black hover:text-gray-700 text-2xl font-light cursor-pointer transition-colors"
                        >
                            ✕
                        </button>

                        <h2 className="text-3xl font-medium tracking-tight text-black mb-10">
                            Avaliações sobre a {primeiroNomeProfissional}
                        </h2>

                        {reviewsLoading ? (
                            <div className="flex-1 flex items-center justify-center py-10">
                                <span className="text-gray-500">Carregando avaliações...</span>
                            </div>
                        ) : reviews.length === 0 ? (
                            <div className="flex-1 flex items-center justify-center py-10">
                                <span className="text-gray-500">Nenhuma avaliação encontrada para este profissional.</span>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                {reviews.map((rev: Review) => (
                                    <div key={rev.id} className="bg-[#E4E4E4] rounded-2xl p-6 flex flex-col justify-between gap-4">
                                        <div>
                                            <div className="flex gap-1 mb-3 text-amber-400">
                                                {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                                            </div>
                                            <p className="text-[13px] leading-relaxed text-gray-500 font-medium line-clamp-4">
                                                {rev.comment || "Lorem Ipsum is simply dummy text of the printing and typesetting industry."}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span className="text-sm font-bold text-gray-600">Anônimo</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}