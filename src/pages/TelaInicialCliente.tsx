import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import EmergencyButton from '../components/EmergencyButton';
import { EmergencyModal } from "../components/EmergencyModal";
import { useAuth } from '../components/AuthContext';
import {MatchModal} from "../components/MatchModal";

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
    // Adicionar ao back
    tags?: string[];
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
    const [showMatchModal, setShowMatchModal] = useState(false);
    const navigate = useNavigate();
    const [showEmergencyModal, setShowEmergencyModal] = useState(false);
    const { user, token } = useAuth();

    const [nomeUsuario, setNomeUsuario] = useState('Paciente');
    const [profissionais, setProfissionais] = useState<ProfessionalFormat[]>([]);
    const [proximaConsulta, setProximaConsulta] = useState<AppointmentData | null>(null);
    const [loading, setLoading] = useState(true);

    const TIPO_USUARIO = 'paciente';

    useEffect(() => {
        const carregarDadosDashboard = async () => {
            const userId = user?.id || localStorage.getItem('userId');
            const activeToken = token || localStorage.getItem('token');

            if (!activeToken) return;

            try {
                setLoading(true);
                const headers = { 'Authorization': `Bearer ${activeToken}` };

                //VERIFICA SE O PACIENTE RESPONDEU O QUESTIONÁRIO DE MATCH
                //Se não respondeu, exibe o modal do match 
                const resMatch = await fetch("/api/matching/recommendations", { headers });
                if (resMatch.status === 500) {
                    const errorData = await resMatch.json();
                    if (errorData.message === "Questionario do paciente nao encontrado. Preencha o questionario antes de buscar recomendacoes.") {
                    setShowMatchModal(true); 
                    }
                }

                if (userId) {
                    const resUser = await fetch(`/api/users/${userId}`, { headers });
                    if (resUser.ok) {
                        const dataUser = await resUser.json();
                        setNomeUsuario(dataUser.name);
                    }
                }

                const resUsersList = await fetch('/api/users?status=ACTIVE', { headers });
                if (resUsersList.ok) {
                    const listaGeral: ListaGeralItem[] = await resUsersList.json();
                    const apenasProfs = listaGeral.filter(
                        (u) => u.role === 'PROFESSIONAL' || u.user?.role === 'PROFESSIONAL'
                    );

                    const dadosFormatados: ProfessionalFormat[] = apenasProfs.map((p) => ({
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
                    setProfissionais(dadosFormatados);
                }

                const resAppointments = await fetch('/api/appointments/me/upcoming', { headers });
                if (resAppointments.ok) {
                    const appointments: AppointmentData[] = await resAppointments.json();
                    const agendada = appointments.find(app => app.status === 'SCHEDULED');
                    if (agendada) setProximaConsulta(agendada);
                }

            } catch (error) {
                console.error("Erro ao carregar dados da Tela Inicial:", error);
            } finally {
                setLoading(false);
            }
        };

        carregarDadosDashboard();
    }, [user, token]);

    const renderStarsFromScore = (scoreStr: string) => {
        const score = Math.round(parseFloat(scoreStr || '5'));
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

    const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150";

    const idProfConsulta = proximaConsulta?.professional.userId || proximaConsulta?.professional.id;

    return (
        <main className="flex h-screen w-full overflow-hidden bg-white font-sans antialiased text-slate-800">
            <Sidebar role={TIPO_USUARIO} itemAtivo="home" />
            
            {/* Modal do match */}
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

            <section className="flex flex-col flex-1 overflow-hidden px-12 py-8 pb-0">
                <header className="flex items-center justify-between mb-8 shrink-0">
                    <div>
                        <h1 className="text-xl font-medium text-slate-700">
                            Bom dia, {nomeUsuario}
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
                                                        if (idProfConsulta) {
                                                            navigate(`/paciente/perfil_do_profissional/${idProfConsulta}`);
                                                        } else {
                                                            console.warn("ID do profissional não encontrado nos dados da consulta.");
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
                                    {profissionais.slice(0, 2).map((prof) => {
                                        {/* 
                                            MOCK TEMPORÁRIO ENQUANTO NÂO TEM NO BACK
                                        */}
                                        const tagsExemplo = prof.tags || ["Ansiedade", "Depressão", "TCC", "Casal", "LGBT+", "Trauma"];

                                        return (
                                            <Link
                                                key={prof.userId}
                                                to={`/paciente/perfil_do_profissional/${prof.userId}`}
                                                className="flex flex-row items-center gap-5 p-4 rounded-2xl transition-all duration-200 border border-gray-100 hover:bg-slate-50 hover:shadow-sm cursor-pointer group bg-white w-full"
                                            >
                                                <img
                                                    src={prof.user.avatarUrl || DEFAULT_AVATAR}
                                                    alt={prof.user.name}
                                                    className="w-20 h-20 rounded-2xl object-cover shrink-0 shadow-sm border border-gray-100"
                                                />

                                                <div className="flex flex-col justify-center gap-1 flex-1 min-w-0">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors truncate max-w-[200px]">
                                                            {prof.user.name}
                                                        </h3>
                                                        <div className="shrink-0">
                                                            {renderStarsFromScore(prof.scoreAvg)}
                                                        </div>
                                                    </div>

                                                    {/* 
                                                        MOCK TEMPORÁRIO ENQUANTO NÂO TEM NO BACK
                                                    */}
                                                    {tagsExemplo && tagsExemplo.length > 0 ? (
                                                        /* Layout Estilo Maria Laura: Tags + Início da Bio na mesma linha */
                                                        <div className="flex items-center gap-4 w-full min-w-0">
                                                            <div className="flex gap-1.5 shrink-0">
                                                                {tagsExemplo.slice(0, 3).map((tag, index) => (
                                                                    <span
                                                                        key={index}
                                                                        className="bg-[#A3D1C1] text-[#4A7A6A] text-[11px] font-semibold py-1 px-3 rounded-full min-w-[55px] text-center"
                                                                    >
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                            <p className="text-xs text-gray-500 font-normal truncate flex-1">
                                                                {prof.user.bio}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        /* Layout Alternativo: Apenas texto da Bio cheia */
                                                        <p className="text-xs text-gray-500 font-normal truncate w-full">
                                                            {prof.user.bio}
                                                        </p>
                                                    )}
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Profissionais em Destaque */}
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
                                {profissionais.slice(0, 4).map((prof) => {
                                    /* 
                                       MOCK TEMPORÁRIO ENQUANTO NÂO TEM NO BACK
                                    */
                                    const tagsProfissional = prof.tags || ["Ansiedade", "TCC", "Depressão", "Luto", "Fobia", "Estresse"];

                                    return (
                                        <Link
                                            key={prof.userId}
                                            to={`/paciente/perfil_do_profissional/${prof.userId}`}
                                            className="bg-[#EFEFEF] rounded-[32px] p-8 flex flex-col items-center text-center shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group border border-gray-100/40"
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

                                            <p className="text-xs text-[#5A6A85] leading-relaxed text-left w-full line-clamp-5 font-normal tracking-wide">
                                                {prof.user.bio || "Nenhuma biografia informada no momento."}
                                            </p>
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