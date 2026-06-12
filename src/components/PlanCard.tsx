interface PlanCardProps {
  title: string;
  description: string;
  features: string[];
  priceText: string;
  isHighlighted?: boolean;
  onBuy: () => void;
}

export function PlanCard({ title, description, features, priceText, isHighlighted = false, onBuy }: PlanCardProps) {
  return (
    <div className={`relative flex flex-col p-6 border rounded-2xl transition-all w-full max-w-[320px] md:max-w-[380px]
      ${isHighlighted ? 'bg-[#B8E3FF] border-[#B8E3FF] scale-105' : 'bg-[rgba(244,247,245,0.3)] border-[#A7A7A7]'}`}>
      
      <h3 className="text-2xl md:text-[32px] font-medium text-slate-900 mb-2">{title}</h3>
      <p className="text-xs md:text-sm text-slate-600 mb-4 text-center">{description}</p>
      
      <ul className="flex-1 space-y-2 mb-6 w-full text-sm md:text-base">
        {features.map((feature, idx) => (
          <li key={idx} className="text-slate-800 font-medium truncate">
            • {feature}
          </li>
        ))}
      </ul>

      <p className="text-base md:text-lg font-semibold mb-4 text-center">💰 {priceText}</p>

      <button 
        onClick={onBuy}
        className="w-full max-w-[280px] mx-auto py-4 bg-[#5BB38A] text-white rounded-full font-semibold hover:bg-[#4a9c75] transition-colors"
      >
        Comprar
      </button>
    </div>
  );
}