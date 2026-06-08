import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import EmergencyButton from '../components/EmergencyButton';
import { EmergencyModal } from "../components/EmergencyModal";
import { useAuth } from '../components/AuthContext';

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

interface AppointmentData {
    id: string;
    patientId: string;
    professionalId: string;
    status: string;
    startsAt: string;
    endsAt: string;
    priceCents: number;
}

interface TimeSlot {
    time: string;
    status: 'available' | 'unavailable';
}

interface DaySchedule {
    date: string;
    slots: TimeSlot[];
}

interface ReviewData {
    id: string;
    appointmentId: string;
    patientId: string;
    professionalId: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export default function MarcarComProfissional() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const [showEmergencyModal, setShowEmergencyModal] = useState(false);

    const [prof, setProf] = useState<ProfessionalData | null>(null);
    const [gradeHorarios, setGradeHorarios] = useState<DaySchedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string } | null>(null);

    const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
    const [reviews, setReviews] = useState<ReviewData[]>([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);

    const HORARIOS_ATENDIMENTO = ['09:00', '10:00', '12:00', '14:00', '16:00', '17:00'];

    useEffect(() => {
        if (!id) return;

        const carregarDadosReais = async () => {
            const activeToken = token || localStorage.getItem('token');
            const headers: HeadersInit = activeToken ? {
                'Authorization': `Bearer ${activeToken}`,
                'Content-Type': 'application/json'
            } : { 'Content-Type': 'application/json' };

            try {
                const [resProf, resAppt] = await Promise.all([
                    fetch(`/api/users/${id}`, { headers }),
                    fetch(`/api/appointments/me/upcoming`, { headers })
                ]);

                if (!resProf.ok) throw new Error('Erro ao buscar profissional');

                const dataProf = await resProf.json();
                const dataAppts: AppointmentData[] = resAppt.ok ? await resAppt.json() : [];

                const consultasDesteProfissional = dataAppts.filter(app => app.professionalId === id);

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
                setProf(profFormatado);

                const agendamentosGerados: DaySchedule[] = [];
                const hoje = new Date();

                for (let i = 0; i < 6; i++) {
                    const dataCorrente = new Date(hoje);
                    dataCorrente.setDate(hoje.getDate() + i);

                    const diaStr = String(dataCorrente.getDate()).padStart(2, '0');
                    const mesStr = String(dataCorrente.getMonth() + 1).padStart(2, '0');
                    const anoStr = dataCorrente.getFullYear();
                    const dataFormatada = `${diaStr}/${mesStr}/${anoStr}`;

                    const slotsDia = HORARIOS_ATENDIMENTO.map(hora => {
                        const [h, m] = hora.split(':');
                        const dataDoSlot = new Date(dataCorrente.getFullYear(), dataCorrente.getMonth(), dataCorrente.getDate(), Number(h), Number(m));
                        const jaPassou = dataDoSlot.getTime() < new Date().getTime();

                        const horarioOcupado = consultasDesteProfissional.some(consulta => {
                            const dataConsulta = new Date(consulta.startsAt);
                            return dataConsulta.getTime() === dataDoSlot.getTime();
                        });

                        return {
                            time: hora,
                            status: (jaPassou || horarioOcupado) ? 'unavailable' : 'available' as 'unavailable' | 'available'
                        };
                    });

                    agendamentosGerados.push({ date: dataFormatada, slots: slotsDia });
                }

                setGradeHorarios(agendamentosGerados);

            } catch (err) {
                console.error("Erro ao carregar dados:", err);
            } finally {
                setLoading(false);
            }
        };

        carregarDadosReais();
    }, [id, token]);

    const handleAbrirConfirmacao = (dateStr: string, timeStr: string) => {
        setSelectedSlot({ date: dateStr, time: timeStr });
        setIsModalOpen(true);
    };

    const handleConfirmarAgendamento = async () => {
        if (!prof || !selectedSlot || bookingLoading) return;

        const [dia, mes, ano] = selectedSlot.date.split('/');
        const [hora, min] = selectedSlot.time.split(':');

        const startsAtDate = new Date(Number(ano), Number(mes) - 1, Number(dia), Number(hora), Number(min));
        const endsAtDate = new Date(startsAtDate.getTime() + 50 * 60000);

        try {
            setBookingLoading(true);
            const activeToken = token || localStorage.getItem('token');
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

            if (res.ok) {
                alert(data.message || 'Consulta agendada com sucesso!');
                setIsModalOpen(false);
                navigate('/paciente/home');
            } else {
                console.error('Erro real do backend:', data);
                const errorMessage = Array.isArray(data.message) ? data.message.join(', ') : data.message;
                alert(errorMessage || `Erro ${res.status}: Falha no servidor.`);
            }
        } catch (error) {
            console.error("Erro de conexão/rede:", error);
            alert('Erro de conexão com o servidor.');
        } finally {
            setBookingLoading(false);
        }
    };

    const handleAbrirAvaliacoes = async () => {
        setIsReviewsModalOpen(true);
        if (reviews.length > 0) return; // Evita buscar novamente se já carregou

        setReviewsLoading(true);
        try {
            const activeToken = token || localStorage.getItem('token');
            const headers: HeadersInit = activeToken ? {
                'Authorization': `Bearer ${activeToken}`,
                'Content-Type': 'application/json'
            } : { 'Content-Type': 'application/json' };

            const res = await fetch(`/api/professionals/${id}/reviews?page=1&limit=10`, { headers });

            if (res.ok) {
                const data = await res.json();
                setReviews(data);
            } else {
                console.error('Falha ao carregar as avaliações');
            }
        } catch (error) {
            console.error("Erro ao buscar avaliações:", error);
        } finally {
            setReviewsLoading(false);
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
                                onClick={handleAbrirAvaliacoes}
                                className="text-sm text-gray-400 font-medium cursor-pointer hover:text-slate-600 transition-colors inline-block"
                            >
                                Ver avaliações &gt;
                            </p>
                            <p className="text-sm text-gray-400 leading-relaxed max-w-2xl mt-2">{prof.user.bio}</p>
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
                        <div className="bg-[#F2F2F2] rounded-3xl p-6 shadow-xs flex flex-col justify-between h-36">
                            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            <div>
                                <p className="text-3xl font-bold text-slate-700">{prof.sessionsCompleted}</p>
                                <p className="text-xs font-semibold text-slate-500 mt-1">Sessões concluídas</p>
                            </div>
                        </div>

                        <div className="bg-[#F2F2F2] rounded-3xl p-6 shadow-xs flex flex-col justify-between h-36">
                            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <div>
                                <p className="text-3xl font-bold text-slate-700">{prof.hoursAttended}</p>
                                <p className="text-xs font-semibold text-slate-500 mt-1">Horas de atendimento</p>
                            </div>
                        </div>

                        <div className="bg-[#F2F2F2] rounded-3xl p-6 shadow-xs flex flex-col justify-between h-36">
                            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <div>
                                <p className="text-3xl font-bold text-slate-700">{prof.clientsAttended}</p>
                                <p className="text-xs font-semibold text-slate-500 mt-1">Clientes atendidos</p>
                            </div>
                        </div>

                        <div className="bg-[#F2F2F2] rounded-3xl p-6 shadow-xs flex flex-col justify-between h-36">
                            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
                            <div>
                                <p className="text-3xl font-bold text-slate-700">{prof.reviewCount}</p>
                                <p className="text-xs font-semibold text-slate-500 mt-1">avaliações</p>
                            </div>
                        </div>
                    </div>

                    {/* Grade de Horários */}
                    <div className="mt-4">
                        <h3 className="text-sm font-bold text-slate-600 mb-6">Próximos horários disponíveis</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 pb-12">
                            {gradeHorarios.map((dia, idx) => (
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

            {isReviewsModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs p-4">
                    <div className="relative w-full max-w-4xl bg-[#EEEEEE] rounded-3xl p-10 max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">

                        {/* Botão de Fechar */}
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
                                {reviews.map((rev) => (
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