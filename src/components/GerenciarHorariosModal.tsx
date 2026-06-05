import { useState } from 'react';
import { Check, Clock, Calendar } from 'lucide-react';

interface HorarioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GerenciarHorariosModal({ isOpen, onClose}: HorarioModalProps) {
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  
  if (!isOpen) return null;

  const horas = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl flex flex-col max-h-[85vh]">
        
        {/* Header com Seletor de Data */}
        <div className="p-6 border-b border-slate-100 shrink-0 flex flex-col gap-8">
          <h2 className="text-xl font-bold text-slate-800">Disponibilidade</h2>
          
          <div className="relative flex items-center">
            <Calendar className="absolute left-3 text-slate-400" size={18} />
            <input 
              type="date" 
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-[#5BB38A] outline-none"
            />
          </div>
        </div>

        {/* Lista de Horários */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {horas.map((hora) => (
            <label 
              key={hora} 
              className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-100"
            >
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-slate-400" />
                <span className="text-slate-700 font-medium">{hora}</span>
              </div>
              <input 
                type="checkbox" 
                className="w-5 h-5 rounded border-slate-300 text-[#5BB38A] focus:ring-[#5BB38A]"
              />
            </label>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 shrink-0 flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg">Cancelar</button>
          <button className="flex-1 bg-[#5BB38A] text-white py-2 rounded-lg font-semibold hover:bg-[#4a9c75] flex items-center justify-center gap-2">
            <Check size={18} /> Salvar
          </button>
        </div>
      </div>
    </div>
  );
}