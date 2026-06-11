import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../components/AuthContext';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  slot?: any;
}

export const RecurrenceType = {
  WEEKLY: 'WEEKLY',
  BIWEEKLY: 'BIWEEKLY',
  MONTHLY: 'MONTHLY',
} as const;

type RecurrenceType = typeof RecurrenceType[keyof typeof RecurrenceType];

// Mapeamento para tradução
const recurrenceLabels: Record<RecurrenceType, string> = {
  [RecurrenceType.WEEKLY]: 'Semanal',
  [RecurrenceType.BIWEEKLY]: 'Quinzenal',
  [RecurrenceType.MONTHLY]: 'Mensal',
};

export function GerenciarHorariosModal({ isOpen, onClose, slot }: DrawerProps) {
  const { token } = useAuth();
  
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("18:00");
  const [weekday, setWeekday] = useState("1");
  const [recurrence, setRecurrence] = useState<RecurrenceType>(RecurrenceType.WEEKLY);

  useEffect(() => {
    if (isOpen && slot) {
      setStartTime(slot.startTime);
      setEndTime(slot.endTime);
      setWeekday(slot.weekday.toString());
      setRecurrence(slot.recurrence);
    } else {
      setStartTime("08:00");
      setEndTime("18:00");
      setWeekday("1");
      setRecurrence(RecurrenceType.WEEKLY);
    }
  }, [isOpen, slot]);

  const handleSalvar = async () => {
    const isEditing = !!slot;
    const url = isEditing 
      ? `/api/professionals/me/availabilities/${slot.id}` 
      : '/api/professionals/me/availabilities';

    const payload: any = {
      startTime,
      endTime,
      recurrence,
      slotDurationMinutes: 60,
    };

    if (!isEditing) {
      payload.weekday = parseInt(weekday);
    }
      
    try {
      const response = await fetch(url, {
        method: isEditing ? 'PATCH' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Erro ao salvar');
      }

      toast.success(isEditing ? "Horário atualizado!" : "Disponibilidade criada!");
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Erro ao salvar");
    }
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/40 z-[999] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose}
      />

      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[1000] transform transition-transform duration-300 ease-in-out p-6 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-slate-800">
            {slot ? "Editar Horário" : "Nova Disponibilidade"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
        </div>

        <div className="flex-1 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Dia da semana</label>
            <select 
              value={weekday} 
              onChange={(e) => setWeekday(e.target.value)} 
              disabled={!!slot} // Bloqueia se estiver editando
              className={`w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#5BB38A] ${slot ? 'bg-slate-50 cursor-not-allowed' : ''}`}
            >
              {['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map((day, idx) => (
                <option key={idx} value={idx}>{day}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Início</label>
              <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#5BB38A]" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Fim</label>
              <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#5BB38A]" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Recorrência</label>
            <select value={recurrence} onChange={(e) => setRecurrence(e.target.value as RecurrenceType)} className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#5BB38A]">
              {Object.entries(RecurrenceType).map(([key, value]) => (
                <option key={key} value={value}>{recurrenceLabels[value]}</option>
              ))}
            </select>
          </div>
        </div>

        <button 
          onClick={handleSalvar} 
          className="w-full bg-[#5BB38A] text-white py-4 rounded-xl font-semibold hover:bg-[#4a9c75] transition-colors"
        >
          {slot ? "Atualizar Horário" : "Salvar Disponibilidade"}
        </button>
      </div>
    </>
  );
}