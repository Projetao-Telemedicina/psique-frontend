import { Bell } from 'lucide-react';

interface EmergencyButtonProps {
  onClick?: () => void;
  className?: string; 
}

export default function EmergencyButton({ onClick, className }: EmergencyButtonProps) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:border-red-200 transition-all active:scale-95 group ${className}`}
    >
      <div className="w-6 h-6 bg-[#BF4D00] group-hover:bg-red-600 rounded-full flex items-center justify-center transition-colors">
        <Bell size={14} className="text-white" />
      </div>
      <span>Botão de Emergência</span>
    </button>
  );
}