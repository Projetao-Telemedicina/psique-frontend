import { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { ProfessionalEmergencyModal } from './ProfessionalEmergencyModal';
interface ProfessionalProfileResponse {
    userId: string;
    activeEmergencyOfferId?: string | null;
    activeEmergencyOffer?: {
        id: string;
        emergencyRequestId: string;
        status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
        attemptNumber: number;
        sentAt: string;
        expiresAt: string;
        emergencyRequest?: {
            notes?: string | null;
            patient?: {
                user?: {
                    name: string;
                };
            };
        };
    } | null;
}

interface ActiveOfferDetails {
    id: string;
    requestId: string; 
    emergencyRequestId: string;
    professionalId: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
    attemptNumber: number;
    sentAt: string;
    expiresAt: string;
    notes?: string | null;
    patientName: string;
}

export const EmergencyListener = () => {
    const { user, token } = useAuth(); 
    const [activeOffer, setActiveOffer] = useState<ActiveOfferDetails | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (
            user?.role !== 'PROFESSIONAL' || 
            !user?.id ||
            !token || 
            token === 'null' || 
            token === 'undefined'
        ) return;

        const checkOffers = async () => {
            try {
                const res = await fetch(`/api/professionals/${user.id}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!res.ok) {
                    if (isModalOpen) {
                        setIsModalOpen(false);
                        setActiveOffer(null);
                    }
                    return;
                }

                const profile: ProfessionalProfileResponse = await res.json();
                const offer = profile.activeEmergencyOffer;

                if (offer && offer.status === 'PENDING') {
                    setActiveOffer({
                        id: offer.id,
                        requestId: offer.emergencyRequestId, 
                        emergencyRequestId: offer.emergencyRequestId,
                        professionalId: user.id,
                        status: offer.status,
                        attemptNumber: offer.attemptNumber,
                        sentAt: offer.sentAt,
                        expiresAt: offer.expiresAt,
                        notes: offer.emergencyRequest?.notes || 'Paciente em situação de sofrimento agudo.',
                        patientName: offer.emergencyRequest?.patient?.user?.name || 'Paciente'
                    });
                    setIsModalOpen(true);
                } else {
                    // Se a oferta sumiu, expirou ou foi aceita, fecha o modal limpando o estado
                    if (isModalOpen) {
                        setIsModalOpen(false);
                        setActiveOffer(null);
                    }
                }

            } catch (err) {
                console.error("Erro ao escutar chamadas de pânico do profissional:", err);
            }
        };

        checkOffers();

        const interval = setInterval(checkOffers, 5000);
        return () => clearInterval(interval);
        
    }, [user, token, isModalOpen]);

    return (
        <ProfessionalEmergencyModal
            isOpen={isModalOpen}
            offer={activeOffer}
            onClose={() => setIsModalOpen(false)}
            onActionComplete={() => setActiveOffer(null)}
        />
    );
};