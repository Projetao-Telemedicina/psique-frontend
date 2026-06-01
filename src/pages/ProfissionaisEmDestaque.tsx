import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import EmergencyButton from "../components/EmergencyButton";
import { useAuth } from "../components/AuthContext";

interface UserFormat {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "PROFESSIONAL" | "PATIENT";
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
    tags?: string[]; 
    user: {
        name: string;
        email: string;
        bio: string;
        avatarUrl: string | null;
        role: string;
    };
}

type ListaGeralItem = UserFormat & Partial<ProfessionalFormat>;

function CardProfissional({ prof, renderStars, defaultAvatar }: { 
    prof: ProfessionalFormat, 
    renderStars: (score: string) => React.ReactNode,
    defaultAvatar: string 
}) {
    const tagsExemplo = prof.tags || ["Tag1", "Tag1", "Tag1", "Tag1", "Tag1", "Tag1"];

    return (
        <Link 
            to={`/paciente/perfil_do_profissional/${prof.userId}`} // Altere a rota aqui conforme a estrutura do seu projeto
            className="bg-[#EFEFEF] rounded-[32px] p-8 shadow-xl max-w-[420px] w-full flex flex-col items-center text-center border border-gray-100/50 
                       transition-all duration-300 ease-in-out 
                       hover:transform hover:-translate-y-2 hover:shadow-2xl hover:bg-[#EAEAEA]
                       cursor-pointer block text-left"
        >
            {/* Foto de Perfil*/}
            <div className="relative w-28 h-28 mb-5 mx-auto">
                <img
                    src={prof.user.avatarUrl || defaultAvatar}
                    alt={prof.user.name}
                    className="w-full h-full rounded-full object-cover shadow-md border-2 border-white"
                />
            </div>

            {/* Nome e Estrelas */}
            <div className="w-full flex items-center justify-between px-2 mb-4">
                <h3 className="font-bold text-xl text-[#2D3748] tracking-tight truncate max-w-[60%]">
                    {prof.user.name}
                </h3>
                <div className="shrink-0">
                    {renderStars(prof.scoreAvg)}
                </div>
            </div>

            {/* Grid de Tags */}
            <div className="grid grid-cols-3 gap-2 w-full mb-6">
                {tagsExemplo.slice(0, 6).map((tag, index) => (
                    <span 
                        key={index} 
                        className="bg-[#A3D1C1] text-[#4A7A6A] text-xs font-semibold py-2 px-3 rounded-full truncate text-center"
                    >
                        {tag}
                    </span>
                ))}
            </div>

            {/* Biografia */}
            <p className="text-sm text-[#5A6A85] leading-relaxed w-full line-clamp-4 font-normal">
                {prof.user.bio}
            </p>
        </Link>
    );
}
function ProfissionaisEmDestaque() {
    const navigate = useNavigate();
    const { user, token } = useAuth();

    const [profissionais, setProfissionais] = useState<ProfessionalFormat[]>([]);
    const [loading, setLoading] = useState(true);

    const TIPO_USUARIO = "paciente";
    const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150";

    useEffect(() => {
        const carregarProfissionais = async () => {
            const activeToken = token || localStorage.getItem("token");
            if (!activeToken) return;

            try {
                setLoading(true);
                const headers = { Authorization: `Bearer ${activeToken}` };

                const resUsersList = await fetch("/api/users?status=ACTIVE", { headers });
                if (resUsersList.ok) {
                    const listaGeral: ListaGeralItem[] = await resUsersList.json();

                    const apenasProfs = listaGeral.filter(
                        (u) => u.role === "PROFESSIONAL" || u.user?.role === "PROFESSIONAL"
                    );

                    const dadosFormatados: ProfessionalFormat[] = apenasProfs.map((p) => ({
                        userId: p.userId || p.id || "",
                        crp: p.crp || "06/000000",
                        specialty: p.specialty || "Psicologia Clínica",
                        scoreAvg: p.scoreAvg || "5.00",
                        reviewCount: p.reviewCount || 0,
                        user: {
                            name: p.user?.name || p.name || "Profissional",
                            email: p.user?.email || p.email || "",
                            bio: p.user?.bio || p.bio || "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
                            avatarUrl: p.user?.avatarUrl || p.avatarUrl || null,
                            role: "PROFESSIONAL",
                        },
                    }));

                    setProfissionais(dadosFormatados);
                }
            } catch (error) {
                console.error("Erro ao carregar profissionais:", error);
            } finally {
                setLoading(false);
            }
        };

        carregarProfissionais();
    }, [user, token]);

    const renderStarsFromScore = (scoreStr: string) => {
        const score = Math.round(parseFloat(scoreStr || "5"));
        return (
            <div className="flex gap-1 text-[#2D3748]">
                {[...Array(5)].map((_, i) => (
                    <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill={i < score ? "currentColor" : "#C4C4C4"}
                        className="w-[18px] h-[18px]"
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

            <section className="flex flex-col flex-1 overflow-hidden px-12 py-8 relative">
                <div className="flex items-center justify-between mb-6 shrink-0 w-full">
                    <Link
                        to="/paciente/home"
                        className="inline-flex items-center gap-2 text-rich-black hover:text-rich-black/80 transition-colors group"
                    >
                        <ChevronLeft size={48} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-lg font-medium">Voltar</span>
                    </Link>
                    <EmergencyButton onClick={() => navigate('/emergencia')} />
                </div>

                <header className="mb-8 shrink-0 w-fit flex flex-col items-start pl-[12px]">
                    <h1 className="text-xl font-medium text-slate-700 m-0 p-0 leading-none">
                        Profissionais em destaque
                    </h1>
                </header>

                {loading ? (
                    <div className="flex-1 flex items-center justify-center text-gray-400">
                        Carregando lista de profissionais...
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto pr-2 pl-[12px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start content-start">
                        {profissionais.map((prof) => (
                            <CardProfissional 
                                key={prof.userId} 
                                prof={prof} 
                                renderStars={renderStarsFromScore}
                                defaultAvatar={DEFAULT_AVATAR}
                            />
                        ))}

                        {profissionais.length === 0 && (
                            <p className="text-sm text-gray-400 italic col-span-full">
                                Nenhum profissional de destaque disponível no momento.
                            </p>
                        )}
                    </div>
                )}
            </section>
        </main>
    );
}

export default ProfissionaisEmDestaque;