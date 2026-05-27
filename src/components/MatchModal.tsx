import { useState } from "react";
import { X } from "lucide-react";

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
  role: 'PATIENT' | 'PROFESSIONAL';
}

export function MatchModal({ isOpen, onClose, onStart, role }: MatchModalProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isOpen) return null;

  const isPatient = role === 'PATIENT';
  
  // Título condicional
  const title = isPatient 
    ? "Você ainda não respondeu o questionário de match."
    : "Responda o questionário de match";

  // Descrição condicional
  const description = isPatient 
    ? "A partir das suas respostas, vamos te conectar com profissionais que combinam com seu momento, estilo e objetivos. Isso aumenta as chances de um bom vínculo e continuidade no processo."
    : "Configure seu perfil para que possamos te recomendar aos pacientes que realmente combinam com seu estilo de atendimento, experiência e áreas de atuação.";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-[#F8F9FA] w-full max-w-lg rounded-3xl p-8 relative shadow-xl animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 transition"
        >
          <X size={24} />
        </button>

        <div className="text-center space-y-6">
          {!showConfirm ? (
            <>
              {/* Título */}
              <h2 className="text-2xl font-bold text-slate-900 leading-tight">
                {title}
              </h2>
              
              <p className="text-slate-600 text-sm leading-relaxed">
                {description}
              </p>

              <div className="flex flex-col gap-3 pt-4">
                <button 
                  onClick={onStart}
                  className="w-full py-3 bg-[#0EA5E9] text-white font-bold rounded-full hover:bg-[#0284c7] transition shadow-lg shadow-sky-200"
                >
                  RESPONDER QUESTIONÁRIO
                </button>
                <button 
                  onClick={() => setShowConfirm(true)}
                  className="w-full py-3 border-2 border-[#0EA5E9] text-[#0EA5E9] font-bold rounded-full hover:bg-sky-50 transition"
                >
                  RESPONDER DEPOIS
                </button>
              </div>
            </>
          ) : (
            <div className="py-4 space-y-4">
              <h3 className="text-xl font-bold text-slate-900">Tem certeza?</h3>
              <p className="text-slate-600 text-sm">
                Ao pular o questionário agora, você terá uma experiência limitada na plataforma. 
                Você poderá respondê-lo depois no seu perfil.
              </p>
              
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-3 border border-slate-300 text-slate-600 font-bold rounded-full hover:bg-slate-100 transition"
                >
                  VOLTAR
                </button>
                <button 
                  onClick={onClose}
                  className="flex-1 py-3 bg-red-500 text-white font-bold rounded-full hover:bg-red-600 transition"
                >
                  SIM, PULAR
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}