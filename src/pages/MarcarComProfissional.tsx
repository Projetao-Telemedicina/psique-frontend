import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import EmergencyButton from '../components/EmergencyButton';
import { useAuth } from '../components/AuthContext';

const DEFAULT_AVATAR = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

// Interface dos dados da API de profissional
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

// Interface baseada no JSON que você mandou da consulta
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

export default function MarcarComProfissional() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user, token } = useAuth();
    
    const [prof, setProf] = useState<ProfessionalData | null>(null);
    const [gradeHorarios, setGradeHorarios] = useState<DaySchedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);

    // Horários padrão de atendimento da clínica (baseado no design)
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
                // 1. Busca os dados do perfil E a lista de consultas agendadas paralelamente
                const [resProf, resAppt] = await Promise.all([
                    fetch(`/api/users/${id}`, { headers }),
                    fetch(`/api/appointments?status=SCHEDULED`, { headers }) // Endpoint fornecido
                ]);

                if (!resProf.ok) throw new Error('Erro ao buscar profissional');

                const dataProf = await resProf.ok ? await resProf.json() : {};
                const dataAppts: AppointmentData[] = await resAppt.ok ? await resAppt.json() : [];

                // 2. Filtra as consultas apenas para ESTE profissional
                const consultasDesteProfissional = dataAppts.filter(app => app.professionalId === id);

                // 3. Monta o perfil
                const profFormatado: ProfessionalData = {
                    id: dataProf.userId || dataProf.id || id,
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

                // 4. Gera a Grade de Horários Dinâmica (próximos 6 dias a partir de hoje)
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
                        // Criar data exata do slot para comparar e validar
                        const dataDoSlot = new Date(dataCorrente.getFullYear(), dataCorrente.getMonth(), dataCorrente.getDate(), Number(h), Number(m));
                        
                        // Verifica se a hora já passou (se for no dia de hoje)
                        const jaPassou = dataDoSlot.getTime() < new Date().getTime();

                        // Verifica se existe alguma consulta do endpoint SCHEDULED batendo com essa data/hora
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

    // Lógica para enviar requisição POST EXATAMENTE como você pediu
    const handleAgendar = async (dateStr: string, timeStr: string) => {
        if (!prof || bookingLoading) return;

        // Converter DD/MM/YYYY e HH:MM para UTC/ISO 8601 (Formato exigido: 2026-05-15T14:00:00.000Z)
        const [dia, mes, ano] = dateStr.split('/');
        const [hora, min] = timeStr.split(':');
        
        const startsAtDate = new Date(Number(ano), Number(mes) - 1, Number(dia), Number(hora), Number(min));
        // Consulta dura 50 minutos conforme seu JSON
        const endsAtDate = new Date(startsAtDate.getTime() + 50 * 60000); 

        try {
            setBookingLoading(true);
            const activeToken = token || localStorage.getItem('token');
            const patientId = user?.id || localStorage.getItem('userId');

            // Construção idêntica ao fetch que você enviou na referência
            const payloadBody = {
                professionalId: prof.id,
                patientId: patientId, 
                startsAt: startsAtDate.toISOString(), // Ex: "2026-05-15T14:00:00.000Z"
                endsAt: endsAtDate.toISOString(),     // Ex: "2026-05-15T14:50:00.000Z"
                priceCents: 15000                     // Mantendo o custo da sua query
            };

            const res = await fetch('/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(activeToken ? { 'Authorization': `Bearer ${activeToken}` } : {})
                },
                body: JSON.stringify(payloadBody)
            });

            if (res.ok) {
                alert('Consulta agendada com sucesso!');
                navigate('/paciente/home');
            } else {
                alert('Falha ao agendar. O horário pode ter sido reservado por outra pessoa.');
            }
        } catch (error) {
            console.error("Erro ao agendar:", error);
            alert('Ocorreu um erro ao conectar com o servidor.');
        } finally {
            setBookingLoading(false);
        }
    };

    const renderStars = (score: string) => {
        const numStars = Math.round(parseFloat(score || '0'));
        if (numStars === 0) return <span className="text-xs text-gray-400">Sem avaliações</span>;
        return (
            <div className="flex gap-0.5 text-amber-400 text-sm">
                {"★".repeat(numStars)}{"☆".repeat(5 - numStars)}
            </div>
        );
    };

    if (loading) return <div className="flex h-screen items-center justify-center bg-white">Carregando dados...</div>;
    if (!prof) return <div className="flex h-screen items-center justify-center bg-white text-red-500">Profissional não encontrado.</div>;

    return (
        <main className="flex h-screen w-full overflow-hidden bg-white font-sans antialiased text-slate-800">
            <Sidebar role="paciente" itemAtivo="home" />

            <section className="flex flex-col flex-1 overflow-y-auto px-12 py-8 scrollbar-thin">
                <header className="flex items-center justify-between mb-10 shrink-0">
                    <h1 className="text-sm font-semibold text-slate-500">Profissional</h1>
                    <EmergencyButton onClick={() => navigate('/emergencia')} />
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
                            <p className="text-sm text-gray-400 font-medium cursor-pointer hover:underline">Ver avaliações &gt;</p>
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

                    {/* Cards de Estatísticas (Preenchidos com os dados da chamada do profissional) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-[#F2F2F2] rounded-3xl p-6 shadow-xs flex flex-col justify-between h-36">
                            <div className="flex justify-between items-start">
                                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-slate-700">{prof.sessionsCompleted}</p>
                                <p className="text-xs font-semibold text-slate-500 mt-1">Sessões concluídas</p>
                            </div>
                        </div>

                        <div className="bg-[#F2F2F2] rounded-3xl p-6 shadow-xs flex flex-col justify-between h-36">
                            <div className="flex justify-between items-start">
                                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-slate-700">{prof.hoursAttended}</p>
                                <p className="text-xs font-semibold text-slate-500 mt-1">Horas de atendimento</p>
                            </div>
                        </div>

                        <div className="bg-[#F2F2F2] rounded-3xl p-6 shadow-xs flex flex-col justify-between h-36">
                            <div className="flex justify-between items-start">
                                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-slate-700">{prof.clientsAttended}</p>
                                <p className="text-xs font-semibold text-slate-500 mt-1">Clientes atendidos</p>
                            </div>
                        </div>

                        <div className="bg-[#F2F2F2] rounded-3xl p-6 shadow-xs flex flex-col justify-between h-36">
                            <div className="flex justify-between items-start">
                                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-slate-700">{prof.reviewCount}</p>
                                <p className="text-xs font-semibold text-slate-500 mt-1">avaliações</p>
                            </div>
                        </div>
                    </div>

                    {/* Grade Dinâmica de Horários Reais */}
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
                                                onClick={() => handleAgendar(dia.date, slot.time)}
                                                className={`py-1.5 px-2 rounded-full text-xs font-bold transition-transform ${
                                                    slot.status === 'available' 
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
        </main>
    );
}