import { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, X } from 'lucide-react'; // Adicionei o X aqui
import { toast } from 'react-hot-toast';
import { useAuth } from '../components/AuthContext';
import { GerenciarHorariosModal } from './GerenciarHorariosModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function ListaDeDisponibilidades({ isOpen, onClose }: Props) {
  if (!isOpen) return null;  
  const { token } = useAuth();
  const [slots, setSlots] = useState<any[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [slotParaEdicao, setSlotParaEdicao] = useState<any | null>(null);

  const fetchSlots = async () => {
    try {
      const response = await fetch('/api/professionals/me/availabilities', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setSlots(data);
    } catch {
      toast.error("Erro ao carregar horários");
    }
  };

  useEffect(() => { if (isOpen) fetchSlots(); }, [isOpen]);

  const handleDeletar = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este horário?")) return;
    
    await fetch(`/api/professionals/me/availabilities/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchSlots();
    toast.success("Horário removido!");
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 z-[999]" 
        onClick={onClose} 
      />

      {/* 2. Container do Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[1000] p-6 shadow-2xl flex flex-col overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">Seus Horários</h2>
          {/* 3. Botão de fechar (X) */}
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        <button 
          onClick={() => { setSlotParaEdicao(null); setIsDrawerOpen(true); }}
          className="flex items-center justify-center gap-2 bg-[#5BB38A] text-white w-full py-3 rounded-xl font-semibold hover:bg-[#4a9c75] mb-6"
        >
          <Plus size={18} /> Adicionar Novo Horário
        </button>

        <div className="space-y-3">
          {slots.map((slot) => (
            <div key={slot.id} className="flex justify-between items-center p-4 border border-slate-100 rounded-xl hover:bg-slate-50">
              <div>
                <p className="font-semibold text-slate-800">
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][slot.weekday]}
                </p>
                <p className="text-sm text-slate-500">{slot.startTime} às {slot.endTime}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setSlotParaEdicao(slot); setIsDrawerOpen(true); }} className="p-2 text-slate-400 hover:text-[#5BB38A]">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => handleDeletar(slot.id)} className="p-2 text-slate-400 hover:text-red-500">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <GerenciarHorariosModal 
          isOpen={isDrawerOpen} 
          onClose={() => { setIsDrawerOpen(false); fetchSlots(); }} 
          slot={slotParaEdicao} 
        />
      </div>
    </>
  );
}