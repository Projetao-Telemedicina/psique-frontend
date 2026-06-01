import { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { ProfessionalEmergencyModal } from './ProfessionalEmergencyModal'; // O componente que criamos antes

export const EmergencyListener = () => {
  const { user } = useAuth();
  const [activeOffer, setActiveOffer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Só roda se for profissional e estiver logado
    if (user?.role !== 'profissional') return;

    const checkOffers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/panic/my-active-offers', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          // Se chegou uma oferta nova
          if (data && data.offer) {
            setActiveOffer(data.offer);
            setIsModalOpen(true);
          }
        }
      } catch (err) {
        console.error("Erro ao buscar ofertas:", err);
      }
    };

    // Polling a cada 5 segundos
    const interval = setInterval(checkOffers, 5000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <ProfessionalEmergencyModal 
      isOpen={isModalOpen}
      offer={activeOffer}
      onClose={() => setIsModalOpen(false)}
      onActionComplete={() => setActiveOffer(null)}
    />
  );
};