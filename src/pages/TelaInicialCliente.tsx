import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import EmergencyButton from '../components/EmergencyButton';
import { EmergencyModal } from "../components/EmergencyModal";
import { useAuth } from '../components/AuthContext';
import { MatchModal } from "../components/MatchModal";
import { AppointmentModal } from "../components/AppointmentModal";
// 1. Importamos o hook do React Query
import { useQuery } from '@tanstack/react-query';

interface UserFormat {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'PROFESSIONAL' | 'PATIENT';
    status: string;
    bio?: string;
    avatarUrl?: string;
}

interface ProfessionalFormat {
    userId: string;
    crp: string;
    specialty: string;
    scoreAvg: string;
    reviewCount: number;
    user: {
        name: string;
        email: string;
        bio: string;
        avatarUrl: string | null;
        role: string;
    };
    tags?: string[];
}

interface RecommendationFormat {
    professionalId: string;
    professionalName: string;
    avatarUrl: string | null;
    specialty: string;
    scoreAvg: number;
    reviewCount: number;
    scoreDisplay: number;
    scoreBruto: number;
    cosine: number;
    hamming: number;
    penalidade: number;
    modClinico: number;
    explicacoes: string[];
}

type ListaGeralItem = UserFormat & Partial<ProfessionalFormat>;

interface AppointmentData {
    id: string;
    status: 'SCHEDULED' | 'CANCELED' | 'COMPLETED';
    startsAt: string;
    endsAt: string;
    professional: {
        id?: string;
        userId?: string;
        specialty: string;
        user: {
            name: string;
            avatarUrl: string | null;
        };
    };
}

export default function TelaInicialPaciente() {
    const navigate = useNavigate();
    const { user, token } = useAuth();
    
    const [showMatchModal, setShowMatchModal] = useState(false);
    const [showEmergencyModal, setShowEmergencyModal] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

    const TIPO_USUARIO = 'paciente';
    const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150";

    // Configuração base para as requisições
    const userId = user?.id || localStorage.getItem('userId');
    const activeToken = token || localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${activeToken}` };

    const { data: nomeUsuario = 'Paciente' } = useQuery({
        queryKey: ['user', userId], // A chave identifica o cache unicamente
        queryFn: async () => {
            const res = await fetch(`/api/users/${userId}`, { headers });
            if (!res.ok) throw new Error('Erro ao buscar usuário');
            const data = await res.json();
            return data.name;
        },
        enabled: !!userId && !!activeToken, // Só roda se tivermos o ID e o Token
    });


    const { data: profissionaisCompativeis = [], isLoading: loadingRecs } = useQuery({
        queryKey: ['recommendations', userId],
        queryFn: async () => {
            const res = await fetch("/api/matching/recommendations", { headers });
            
            if (res.status === 500) {
                const errorData = await res.json();
                if (errorData.message === "Questionario do paciente nao encontrado. Preencha o questionario antes de buscar recomendacoes.") {
                    setShowMatchModal(true); // Dispara o modal automaticamente
                    return [];
                }
            }
            
            if (!res.ok) throw new Error('Erro nas recomendações');
            const data = await res.json();
            return data.recommendations || [];
        },
        enabled: !!activeToken,
    });

    const { data: profissionais = [], isLoading: loadingProfs } = useQuery({
        queryKey: ['professionals'],
        queryFn: async () => {
            const res = await fetch('/api/users?status=ACTIVE', { headers });
            if (!res.ok) throw new Error('Erro ao buscar profissionais');
            return res.json() as Promise<ListaGeralItem[]>;
        },
        select: (listaGeral) => {
            // O select formata os dados antes de salvar no cache. Excelente para performance!
            const apenasProfs = listaGeral.filter(u => u.role === 'PROFESSIONAL' || u.user?.role === 'PROFESSIONAL');
            return apenasProfs.map((p) => ({
                userId: p.userId || p.id || '',
                crp: p.crp || "06/000000",
                specialty: p.specialty || "Psicologia Clínica",
                scoreAvg: p.scoreAvg || "5.00",
                reviewCount: p.reviewCount || 0,
                user: {
                    name: p.user?.name || p.name || 'Profissional',
                    email: p.user?.email || p.email || '',
                    bio: p.user?.bio || p.bio || "Nenhuma biografia informada.",
                    avatarUrl: p.user?.avatarUrl || p.avatarUrl || null,
                    role: 'PROFESSIONAL'
                }
            }));
        },
        enabled: !!activeToken,
    });

    const { data: proximaConsulta = null, isLoading: loadingAppt } = useQuery({
        queryKey: ['upcomingAppointments', userId],
        queryFn: async () => {
            const res = await fetch('/api/appointments/me/upcoming', { headers });
            if (!res.ok) throw new Error('Erro nas consultas');
            return res.json() as Promise<AppointmentData[]>;
        },
        select: (appointments) => appointments.find(app => app.status === 'SCHEDULED') || null,
        enabled: !!activeToken,
    });

    const loading = loadingRecs || loadingProfs || loadingAppt;


    const renderStarsFromScore = (scoreStr: string | number) => {
        const score = Math.round(typeof scoreStr === 'string' ? parseFloat(scoreStr || '5') : scoreStr);
        return (
            <div className="flex gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={i < score ? "currentColor" : "#C4C4C4"} className="w-4 h-4">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                    </svg>
                ))}
            </div>
        );
    };

    return (
        <main className="flex h-screen w-full overflow-hidden bg-white font-sans antialiased text-slate-800">
            <Sidebar role={TIPO_USUARIO} itemAtivo="home" />
            
            <MatchModal 
                isOpen={showMatchModal} 
                onClose={() => setShowMatchModal(false)} 
                onStart={() => navigate('/match')} 
                role="PATIENT"
            />

            <EmergencyModal 
                isOpen={showEmergencyModal}
                onClose={() => setShowEmergencyModal(false)}
            />

            <AppointmentModal 
                isOpen={!!selectedAppointmentId} 
                onClose={() => setSelectedAppointmentId(null)} 
                appointmentId={selectedAppointmentId} 
            />

            <section className="flex flex-col flex-1 overflow-hidden px-12 py-8 pb-0">
                <header className="flex items-center justify-between mb-8 shrink-0">
                    <div>
                        <h1 className="text-xl font-medium text-slate-700">
                            Bem-vindo, {nomeUsuario}
                        </h1>
                    </div>
                    <EmergencyButton onClick={() => setShowEmergencyModal(true)} />
                </header>

                {loading ? (
                    <div className="flex-1 flex items-center justify-center text-gray-400">
                        Carregando seu portal...
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto space-y-10 pr-2">

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

                            {/* Card Agenda */}
                            <div className="lg:col-span-5 bg-[#F2F2F2] rounded-[2rem] p-6 min-h-[260px] flex flex-col justify-start shadow-xs">
                                {proximaConsulta ? (
                                    <div className="flex flex-col h-full gap-4">
                                        <h3 className="text-base font-bold text-slate-800 tracking-wide px-1">
                                            Próximas consultas
                                        </h3>

                                        <div className="flex gap-4 overflow-x-auto pb-2 pr-1 scrollbar-thin">
                                            <div className="bg-[#EFEFEF] border border-gray-300/70 rounded-2xl p-4 min-w-[240px] flex-1 flex flex-col justify-between gap-4">
                                                <div className="space-y-3">
                                                    <p className="font-extrabold text-sm text-slate-900">
                                                        {new Date(proximaConsulta.startsAt).toLocaleDateString('pt-BR')} às {new Date(proximaConsulta.startsAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                    </p>

                                                    <div className="flex justify-between items-center gap-2">
                                                        <p className="text-sm font-medium text-slate-800 truncate">
                                                            Psi. {proximaConsulta.professional.user.name}
                                                        </p>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => {
                                                        if (proximaConsulta?.id) {
                                                            setSelectedAppointmentId(proximaConsulta.id);
                                                        } else {
                                                            console.warn("ID da consulta não encontrado.");
                                                        }
                                                    }}
                                                    className="w-full bg-[#A2CDB5] hover:bg-[#91BEA4] text-slate-700 font-medium text-xs py-2.5 rounded-full transition-colors shadow-xs"
                                                >
                                                    Detalhes da consulta
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full flex items-center justify-center">
                                        <p className="text-gray-500 font-normal text-base tracking-wide text-center">
                                            Nenhuma consulta agendada
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Seção Compatibilidade */}
                            <div className="lg:col-span-7 flex flex-col gap-4">
                                <div className="flex justify-between items-center px-1">
                                    <h2 className="text-lg font-bold text-slate-800 tracking-wide">
                                        Compatibilidade com Profissionais
                                    </h2>
                                    <Link
                                        to="/paciente/compatibilidade"
                                        className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1 group"
                                    >
                                        Ver mais{" "}
                                        <span className="text-xs font-bold group-hover:translate-x-0.5 transition-transform">
                                            &gt;
                                        </span>
                                    </Link>
                                </div>

                                <div className="flex flex-col gap-4 w-full">
                                    {profissionaisCompativeis.length > 0 ? (
                                        profissionaisCompativeis.slice(0, 2).map((prof: RecommendationFormat) => {
                                            const tagsExplicacao = prof.explicacoes || [];

                                            return (
                                                <Link
                                                    key={prof.professionalId}
                                                    to={`/paciente/perfil_do_profissional/${prof.professionalId}`}
                                                    className="flex flex-row items-center gap-5 p-4 rounded-2xl transition-all duration-200 border border-gray-100 hover:bg-slate-50 hover:shadow-sm cursor-pointer group bg-white w-full"
                                                >
                                                    <img
                                                        src={prof.avatarUrl || DEFAULT_AVATAR}
                                                        alt={prof.professionalName}
                                                        className="w-20 h-20 rounded-2xl object-cover shrink-0 shadow-sm border border-gray-100"
                                                    />

                                                    <div className="flex flex-col justify-center gap-1 flex-1 min-w-0">
                                                        <div className="flex items-center gap-3">
                                                            <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors truncate max-w-[200px]">
                                                                {prof.professionalName}
                                                            </h3>
                                                            <div className="shrink-0">
                                                                {renderStarsFromScore(prof.scoreAvg)}
                                                            </div>
                                                        </div>

                                                        {tagsExplicacao.length > 0 ? (
                                                            <div className="flex items-center gap-4 w-full min-w-0">
                                                                <div className="flex gap-1.5 shrink-0 flex-wrap">
                                                                    {tagsExplicacao.slice(0, 2).map((tag, index) => (
                                                                        <span
                                                                            key={index}
                                                                            title={tag}
                                                                            className="bg-[#A3D1C1] text-[#4A7A6A] text-[11px] font-semibold py-1 px-3 rounded-full text-center max-w-[120px] truncate"
                                                                        >
                                                                            {tag}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                                <p className="text-xs text-gray-500 font-normal truncate flex-1">
                                                                    {prof.specialty || "Profissional altamente recomendado com base no seu perfil."}
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <p className="text-xs text-gray-500 font-normal truncate w-full">
                                                                {prof.specialty || "Profissional altamente recomendado com base no seu perfil."}
                                                            </p>
                                                        )}
                                                        <p className="text-[11px] font-medium text-slate-400 mt-1 group-hover:text-[#4A7A6A] transition-colors">
                                                            Clique para ver datas e horários disponíveis
                                                        </p>
                                                    </div>
                                                </Link>
                                            );
                                        })
                                    ) : (
                                        <div className="p-4 rounded-2xl border border-gray-100 bg-slate-50 text-center text-sm text-gray-500">
                                            Nenhum profissional compatível encontrado no momento.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center px-1">
                                <h2 className="text-lg font-bold text-slate-800 tracking-wide">
                                    Profissionais em destaque
                                </h2>
                                <Link
                                    to="/paciente/destaque"
                                    className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1 group"
                                >
                                    Ver mais{" "}
                                    <span className="text-xs font-bold group-hover:translate-x-0.5 transition-transform">
                                        &gt;
                                    </span>
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {profissionais.slice(0, 4).map((prof: ProfessionalFormat) => {
                                    const tagsProfissional = prof.tags || ["Ansiedade", "TCC", "Depressão", "Luto", "Fobia", "Estresse"];

                                    return (
                                        <Link
                                            key={prof.userId}
                                            to={`/paciente/perfil_do_profissional/${prof.userId}`}
                                            className="bg-[#EFEFEF] rounded-[32px] p-8 flex flex-col items-center text-center shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group border border-gray-100/40 min-h-[340px]"
                                        >
                                            <div className="w-24 h-24 rounded-full overflow-hidden mb-5 shrink-0 shadow-md bg-white border border-gray-200">
                                                <img
                                                    src={prof.user.avatarUrl || DEFAULT_AVATAR}
                                                    alt={prof.user.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>

                                            <div className="w-full flex items-center justify-between gap-2 mb-4 px-1">
                                                <h3 className="font-bold text-base text-[#2D3748] tracking-tight truncate max-w-[55%] text-left">
                                                    {prof.user.name}
                                                </h3>
                                                <div className="shrink-0">
                                                    {renderStarsFromScore(prof.scoreAvg)}
                                                </div>
                                            </div>

                                            {tagsProfissional && tagsProfissional.length > 0 && (
                                                <div className="grid grid-cols-3 gap-1.5 w-full mb-5">
                                                    {tagsProfissional.slice(0, 6).map((tag, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="bg-[#A3D1C1] text-[#4A7A6A] text-[10px] font-bold py-1.5 px-1 rounded-full text-center truncate"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <p className="text-xs text-[#5A6A85] leading-relaxed text-left w-full line-clamp-4 font-normal tracking-wide">
                                                {prof.user.bio || "Nenhuma biografia informada no momento."}
                                            </p>

                                            <div className="w-full mt-auto pt-4 text-center">
                                                <p className="text-[11px] font-medium text-slate-400 group-hover:text-[#4A7A6A] transition-colors">
                                                    Clique para ver datas e horários disponíveis
                                                </p>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                    </div>
                )}
            </section>
        </main>
    );
}