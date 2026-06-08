import { useState, useEffect, useCallback } from 'react';
import { Phone, Loader2, CheckCircle2, Video } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface EmergencyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface EmergencyRequest {
    id: string;
    status: 'SEARCHING' | 'MATCHED' | 'CANCELLED' | 'CLOSED';
    matchedProfessionalId?: string;
    meetLink?: string;
    appointmentId?: string;
}

export function EmergencyModal({ isOpen, onClose }: EmergencyModalProps) {
    const [activeRequest, setActiveRequest] = useState<EmergencyRequest | null>(null);
    const [isCanceling, setIsCanceling] = useState(false);
    const [isJoining, setIsJoining] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setActiveRequest(null);
            return;
        }

        const startEmergencyFlow = async () => {
            try {
                const token = localStorage.getItem('token');

                const activeRes = await fetch('/api/panic/me/active', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (activeRes.ok) {
                    const data = await activeRes.json();
                    if (data && (data.status === 'SEARCHING' || data.status === 'MATCHED')) {
                        setActiveRequest(data);
                        return;
                    }
                }

                const createRes = await fetch('/api/panic', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        notes: 'Paciente em situação de sofrimento agudo e precisa de acolhimento.'
                    })
                });

                if (createRes.ok) {
                    const newData = await createRes.json();
                    setActiveRequest(newData);
                } else {
                    toast.error("Não foi possível acionar o atendimento de emergência.");
                }
            } catch (error) {
                console.error("Erro ao iniciar emergência:", error);
                toast.error("Erro de conexão ao tentar acionar o botão do pânico.");
            }
        };

        startEmergencyFlow();
    }, [isOpen]);

    // Polling para verificar status
    useEffect(() => {
        let intervalId: ReturnType<typeof setInterval>;

        if (isOpen && activeRequest?.status === 'SEARCHING') {
            intervalId = setInterval(async () => {
                try {
                    const token = localStorage.getItem('token');
                    const res = await fetch(`/api/panic/${activeRequest.id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    if (res.ok) {
                        const data = await res.json();
                        setActiveRequest(data);

                        if (data.status === 'MATCHED') {
                            clearInterval(intervalId);
                        }
                    }
                } catch (error) {
                    console.error("Erro ao verificar status:", error);
                }
            }, 3000);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [isOpen, activeRequest?.id, activeRequest?.status]);

    // Cancelar busca 
    const handleCancel = useCallback(async () => {
        if (activeRequest && activeRequest.status === 'SEARCHING') {
            setIsCanceling(true);
            try {
                const token = localStorage.getItem('token');
                await fetch(`/api/panic/${activeRequest.id}/cancel`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        reason: 'Paciente cancelou a busca ativamente pelo modal.'
                    })
                });
            } catch (error) {
                console.error("Erro ao cancelar:", error);
            } finally {
                setIsCanceling(false);
            }
        }
        onClose();
    }, [activeRequest, onClose]);

    // Lógica de entrada na chamada
    const handleJoinEmergencyCall = async () => {
        if (!activeRequest) return;

        setIsJoining(true);

        try {
            // link direto
            if (activeRequest.meetLink) {
                window.open(activeRequest.meetLink, '_blank', 'noopener,noreferrer');
                onClose();
                return;
            }

            // Fallback: Verifica via API
            if (activeRequest.appointmentId) {
                const token = localStorage.getItem('token');
                const response = await fetch(`/api/appointments/${activeRequest.appointmentId}/can-join`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();

                if (response.ok && data.canJoin) {
                    window.open(data.meetLink, '_blank', 'noopener,noreferrer');
                    onClose();
                } else {
                    toast.error("Sala ainda não está pronta.");
                }
            }
        } catch (error) {
            console.error("Erro ao entrar na chamada:", error);
            toast.error("Erro ao tentar conectar na sala.");
        } finally {
            // Garante que o loading pare
            setIsJoining(false);
        }
    };

    if (!isOpen) return null;

    const isMatched = activeRequest?.status === 'MATCHED';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-3xl rounded-[2rem] p-6 md:p-8 flex flex-col relative shadow-2xl animate-in fade-in zoom-in duration-200">

                <h2 className="text-xl md:text-2xl font-extrabold text-black mb-4 md:mb-6">
                    {isMatched ? 'Psicólogo encontrado' : 'Atendimento imediato'}
                </h2>

                <div className="flex flex-col items-center justify-center w-full">
                    <p className="text-lg md:text-xl text-black mb-3 md:mb-4">
                        Você não está sozinho
                    </p>

                    <div className={`mb-4 ${isMatched ? 'text-green-500' : 'text-[#FF114A]'}`}>
                        {isMatched ? (
                            <CheckCircle2 className="w-12 h-12 md:w-14 md:h-14 animate-in zoom-in" />
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                className="w-12 h-12 md:w-14 md:h-14 animate-pulse"
                            >
                                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                            </svg>
                        )}
                    </div>

                    <div className="flex items-center gap-3 mb-6 md:mb-8">
                        {!isMatched && <Loader2 className="w-5 h-5 text-[#FF114A] animate-spin" />}
                        <p className="text-center text-black font-medium text-sm md:text-base max-w-lg">
                            {isMatched
                                ? 'Um psicólogo acabou de aceitar seu pedido. A sala de vídeo está pronta para você entrar.'
                                : 'Respire fundo, estamos procurando um psicólogo disponível para iniciar uma videochamada agora mesmo...'}
                        </p>
                    </div>

                    <div className="w-full mb-6 md:mb-8">
                        <h3 className="text-left font-extrabold text-sm md:text-base text-black mb-3">
                            Em caso de risco à vida
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                            <div className="bg-[#EFEFEF] rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col justify-between">
                                <div>
                                    <h4 className="font-extrabold text-black text-sm md:text-base mb-1">Ligue CVV</h4>
                                    <p className="text-[11px] md:text-xs text-gray-800 font-medium leading-snug">
                                        Apoio emocional 24h, gratuito e sob total sigilo
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-black font-medium mt-3 md:mt-4">
                                    <Phone size={18} className="text-black stroke-[2.5]" />
                                    <span className="text-sm md:text-base">188</span>
                                </div>
                            </div>
                            <div className="bg-[#EFEFEF] rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col justify-between">
                                <div>
                                    <h4 className="font-extrabold text-black text-sm md:text-base mb-1">Ligue Samu</h4>
                                    <p className="text-[11px] md:text-xs text-gray-800 font-medium leading-snug">
                                        Serviço de Atendimento Móvel de Urgência
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-black font-medium mt-3 md:mt-4">
                                    <Phone size={18} className="text-black stroke-[2.5]" />
                                    <span className="text-sm md:text-base">192</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {isMatched ? (
                        <button
                            onClick={handleJoinEmergencyCall}
                            disabled={isJoining}
                            className="bg-[#22C55E] text-white font-bold py-3 px-10 rounded-full hover:bg-[#16A34A] transition-colors text-sm md:text-base flex items-center gap-2"
                        >
                            <Video size={20} />
                            {isJoining ? 'Abrindo sala...' : 'Entrar na videochamada'}
                        </button>
                    ) : (
                        <button
                            onClick={handleCancel}
                            disabled={isCanceling}
                            className="bg-[#4A4A4A] text-white font-semibold py-2.5 px-8 md:py-3 md:px-10 rounded-full hover:bg-[#3A3A3A] transition-colors text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isCanceling ? 'Cancelando...' : 'Cancelar consulta'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}