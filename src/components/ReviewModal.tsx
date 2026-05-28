import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Star, X } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string;
  onSuccess: () => void;
}

export default function ReviewModal({ isOpen, onClose, appointmentId, onSuccess }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/appointments/${appointmentId}/review`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ rating, comment })
      });

      if (response.ok) {
        toast.success("Avaliação enviada com sucesso!");
        onSuccess();
        onClose();
      } else {
        const data = await response.json();
        toast.error(data.message || "Erro ao enviar avaliação.");
      }
    } catch {
      toast.error("Erro de conexão com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] p-6 w-full max-w-sm shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-bold text-slate-800 mb-1">Como foi a consulta?</h2>
        <p className="text-slate-500 text-sm mb-6">Sua opinião ajuda outros pacientes.</p>

        {/* Seletor de Estrelas */}
        <div className="flex gap-2 mb-6 justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`transition-all ${star <= rating ? 'text-amber-400 scale-110' : 'text-slate-300'}`}
            >
              <Star size={32} fill={star <= rating ? "currentColor" : "none"} />
            </button>
          ))}
        </div>

        {/* Campo de Comentário */}
        <textarea
          className="w-full h-24 p-4 mb-6 bg-slate-50 rounded-2xl text-sm border border-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          placeholder="Conte um pouco sobre sua experiência (opcional)..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button 
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-2xl transition-all disabled:opacity-50"
        >
          {isLoading ? "Enviando..." : "Enviar Avaliação"}
        </button>
      </div>
    </div>
  );
}