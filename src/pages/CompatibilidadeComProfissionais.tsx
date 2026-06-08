import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import EmergencyButton from "../components/EmergencyButton";
import { EmergencyModal } from "../components/EmergencyModal";
import { useAuth } from "../components/AuthContext";

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

function LinhaProfissional({ prof, renderStars, defaultAvatar }: {
    prof: RecommendationFormat,
    renderStars: (score: number) => React.ReactNode,
    defaultAvatar: string
}) {
    const tagsExplicacao = prof.explicacoes || [];

    return (
        <Link
            to={`/paciente/profissional/${prof.professionalId}`}
            className="flex flex-col gap-3 p-4 rounded-2xl transition-all duration-200 border border-gray-100 hover:bg-slate-50 hover:shadow-md cursor-pointer group bg-white"
        >
            {/* Bloco Superior: Imagem, Nome, Estrelas e Tags */}
            <div className="flex gap-4 items-start">
                <img
                    src={prof.avatarUrl || defaultAvatar}
                    alt={prof.professionalName}
                    className="w-20 h-20 rounded-2xl object-cover shrink-0 shadow-sm border border-gray-100"
                />

                {/* Conteúdo à direita da foto */}
                <div className="flex flex-col gap-1.5 w-full min-w-0">
                    {/* Nome + Estrelas */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors truncate max-w-[160px]">
                            {prof.professionalName}
                        </h3>
                        {renderStars(prof.scoreAvg)}
                    </div>


                    <div className="flex flex-wrap gap-1.5">
                        {tagsExplicacao.slice(0, 6).map((tag, index) => (
                            <span
                                key={index}
                                title={tag} 
                                className="bg-[#A3D1C1] text-[#4A7A6A] text-[11px] font-semibold py-1 px-3 rounded-full min-w-[60px] text-center truncate max-w-[150px]"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Descrição / Especialidade */}
            <p className="text-xs text-gray-500 leading-relaxed font-normal line-clamp-3">
                {prof.specialty || "Profissional altamente recomendado com base no seu perfil."}
            </p>
        </Link>
    );
}

function CompatibilidadeComProfissionais() {
    const { user, token } = useAuth();
    const [showEmergencyModal, setShowEmergencyModal] = useState(false);

    const [profissionais, setProfissionais] = useState<RecommendationFormat[]>([]);
    const [loading, setLoading] = useState(true);

    const TIPO_USUARIO = "paciente";
    const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150";

    useEffect(() => {
        const carregarProfissionaisCompativeis = async () => {
            const activeToken = token || localStorage.getItem("token");
            if (!activeToken) return;

            try {
                setLoading(true);
                const headers = { Authorization: `Bearer ${activeToken}` };

                const resMatch = await fetch("/api/matching/recommendations", { headers });
                
                if (resMatch.ok) {
                    const matchData = await resMatch.json();
                    setProfissionais(matchData.recommendations || []);
                } else {
                    console.error("Erro ao buscar recomendações:", await resMatch.text());
                }

            } catch (error) {
                console.error("Erro ao carregar profissionais compatíveis:", error);
            } finally {
                setLoading(false);
            }
        };

        carregarProfissionaisCompativeis();
    }, [user, token]);

    const renderStarsFromScore = (scoreStr: string | number) => {
        const score = Math.round(typeof scoreStr === 'string' ? parseFloat(scoreStr || "5") : scoreStr);
        return (
            <div className="flex gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                    <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill={i < score ? "currentColor" : "#C4C4C4"}
                        className="w-3.5 h-3.5"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                            clipRule="evenodd"
                        />
                    </svg>
                ))}
            </div>
        );
    };

    return (
        <main className="flex h-screen w-full overflow-hidden bg-white font-sans antialiased text-slate-800">
            <Sidebar role={TIPO_USUARIO} itemAtivo="home" />

            <EmergencyModal
                isOpen={showEmergencyModal}
                onClose={() => setShowEmergencyModal(false)}
            />

            <section className="flex flex-col flex-1 overflow-hidden px-12 py-8 relative">
                <div className="flex items-center justify-between mb-6 shrink-0 w-full">
                    <Link
                        to="/paciente/home"
                        className="inline-flex items-center gap-2 text-rich-black hover:text-rich-black/80 transition-colors group"
                    >
                        <ChevronLeft size={48} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-lg font-medium">Voltar</span>
                    </Link>
                    <EmergencyButton onClick={() => setShowEmergencyModal(true)} />
                </div>

                <header className="mb-8 shrink-0 w-fit flex flex-col items-start pl-[12px]">
                    <h1 className="text-xl font-medium text-slate-700 m-0 p-0 leading-none">
                        Compatibilidade com Profissionais
                    </h1>
                </header>

                {loading ? (
                    <div className="flex-1 flex items-center justify-center text-gray-400">
                        Buscando os melhores profissionais para você...
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto pr-2 pl-[12px] grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 content-start items-start">
                        {profissionais.map((prof) => (
                            <LinhaProfissional
                                key={prof.professionalId}
                                prof={prof}
                                renderStars={renderStarsFromScore}
                                defaultAvatar={DEFAULT_AVATAR}
                            />
                        ))}

                        {profissionais.length === 0 && (
                            <p className="text-sm text-gray-400 italic col-span-full">
                                Nenhum profissional com compatibilidade encontrado no momento. Verifique se o seu questionário foi respondido.
                            </p>
                        )}
                    </div>
                )}
            </section>
        </main>
    );
}

export default CompatibilidadeComProfissionais;