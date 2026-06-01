import { useState, useEffect } from 'react';
import { Heart, Loader2, Video } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface EmergencyOffer {
    id: string; // offerId
    patientName: string;
    requestId: string;
}

interface ProfessionalEmergencyModalProps {
    isOpen: boolean;
    onClose: () => void;
    offer: EmergencyOffer | null;
    onActionComplete: () => void;
}

export function ProfessionalEmergencyModal({
    isOpen,
    onClose,
    offer,
    onActionComplete
}: ProfessionalEmergencyModalProps) {
    const [loading, setLoading] = useState(false);
    const [isAccepted, setIsAccepted] = useState(false);
    const [meetLink, setMeetLink] = useState<string | null>(null);

    useEffect(() => {
        let intervalId: any;

        if (isAccepted && offer?.requestId) {
            intervalId = setInterval(async () => {
                try {
                    const token = localStorage.getItem('token');
                    // Polling para buscar o status da requisição
                    const res = await fetch(`/api/panic/requests/${offer.requestId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await res.json();

                    // Verifica se o status mudou para MATCHED e se o link existe
                    if (data.status === 'MATCHED' && data.meetLink) {
                        setMeetLink(data.meetLink);
                        clearInterval(intervalId);
                    }
                } catch (error) {
                    console.error("Erro ao verificar status da chamada:", error);
                }
            }, 2000);
        }

        return () => clearInterval(intervalId);
    }, [isAccepted, offer]);

    if (!isOpen || !offer) return null;

    const handleAccept = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/panic/offers/${offer.id}/accept`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                setIsAccepted(true); 
                toast.success("Atendimento aceito! Aguardando sala...");
            } else {
                toast.error("Erro ao aceitar atendimento.");
            }
        } catch (e) {
            toast.error("Erro de conexão.");
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/panic/offers/${offer.id}/reject`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    reason: 'Não consigo assumir atendimento urgente neste momento.'
                })
            });

            if (response.ok) {
                toast.success("Atendimento recusado.");
                onActionComplete();
                onClose();
            } else {
                toast.error("Erro ao recusar atendimento.");
            }
        } catch (e) {
            toast.error("Erro de conexão.");
        } finally {
            setLoading(false);
        }
    };

    const handleJoinMeet = () => {
        if (meetLink) {
            window.open(meetLink, '_blank', 'noopener,noreferrer');
            onActionComplete();
            onClose();
        } else {
            toast.error("Link da sala ainda não disponível. Aguarde um instante.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-[2rem] p-8 flex flex-col items-center text-center shadow-2xl">

                <h2 className="text-2xl font-bold text-black mb-6">
                    {isAccepted ? "Atendimento aceito" : "Atendimento imediato"}
                </h2>

                <div className="flex flex-col items-center mb-6">
                    <Heart className={`w-16 h-16 mb-6 ${isAccepted ? 'text-green-500 fill-green-500' : 'text-red-500 fill-red-500 animate-pulse'}`} />

                    <p className="text-md text-gray-700 font-semibold">
                        {isAccepted 
                            ? (meetLink 
                                ? "A sala de vídeo está pronta. Clique abaixo para entrar." 
                                : "Configurando sala de vídeo...") 
                            : `${offer.patientName} precisa de atendimento urgente.`}
                    </p>
                </div>

                <div className="flex w-full gap-4 mt-4">
                    {!isAccepted ? (
                        <>
                            <button
                                onClick={handleAccept}
                                disabled={loading}
                                className="flex-1 bg-[#5DB075] text-white font-bold py-4 rounded-2xl hover:bg-[#4a915f] transition-colors flex justify-center items-center"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : "Aceitar atendimento"}
                            </button>

                            <button
                                onClick={handleReject}
                                disabled={loading}
                                className="flex-1 bg-[#4A4A4A] text-white font-bold py-4 rounded-2xl hover:bg-[#333] transition-colors"
                            >
                                Recusar
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleJoinMeet}
                            disabled={!meetLink}
                            className={`flex-1 text-white font-bold py-4 rounded-2xl transition-colors flex justify-center items-center gap-2 ${
                                meetLink ? "bg-[#22C55E] hover:bg-[#16A34A]" : "bg-gray-300 cursor-not-allowed"
                            }`}
                        >
                            {meetLink ? (
                                <><Video size={20} /> Entrar na chamada</>
                            ) : (
                                <><Loader2 className="animate-spin" /> Preparando...</>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}