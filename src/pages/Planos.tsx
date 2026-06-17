import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { PlanCard } from "../components/PlanCard"; 
import { toast } from 'react-hot-toast';

export default function Planos() {
  const navigate = useNavigate();

  const plans = [
    {
      title: "Essência",
      description: "Flexibilidade total, sem compromisso",
      features: ["1 sessão", "Validade: 30 dias", "Diário disponível", "Sem desconto"],
      priceText: "R$ 140 / sessão",
      highlight: false
    },
    {
      title: "Plano Conexão",
      description: "Para um acompanhamento mais profundo",
      features: ["12 sessões", "Validade: 180 dias", "Suporte à chat", "Diário disponível", "Modo emergência"],
      priceText: "R$ 100 / sessão (1.200 ou 6x de 200)",
      highlight: true
    },
    {
      title: "Plano Presença",
      description: "Comece seu processo com consistência",
      features: ["4 sessões", "Validade: 60 dias", "Suporte à chat", "Diário disponível", "Modo emergência"],
      priceText: "R$ 120 / sessão (R$ 480)",
      highlight: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col p-4 md:p-8 overflow-hidden">
      {/* Cabeçalho com Logo e Voltar */}
      <header className="flex items-center gap-4 mb-4">
        <img src="/psique-logo.svg" alt="Logo Psique" className="w-[80px] h-[80px] object-contain" />
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 hover:opacity-70 transition-opacity text-black"
        >
          <ChevronLeft size={20} />
          <span className="font-poppins text-lg">Voltar</span>
        </button>
      </header>

      {/* Container dos Cards */}
      <main className="flex-1 flex flex-row items-center justify-center gap-2 md:gap-6 scale-90 md:scale-100 origin-center">
        {plans.map((plan, idx) => (
          <PlanCard 
            key={idx}
            title={plan.title}
            description={plan.description}
            features={plan.features}
            priceText={plan.priceText}
            isHighlighted={plan.highlight}
            onBuy={() => toast.success(`Assinando ${plan.title}`)}
          />
        ))}
      </main>
    </div>
  );
}