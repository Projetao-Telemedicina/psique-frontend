import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import EmergencyButton from '../components/EmergencyButton';
import { EmergencyModal } from "../components/EmergencyModal";
import { useAuth } from '../components/AuthContext';
import { Send, Paperclip, Search, MessageSquare } from 'lucide-react';

export default function Chat() {
  const { user } = useAuth();
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  const getSidebarRole = (): "paciente" | "profissional" | "administrador" => {
    if (user?.role === 'PROFESSIONAL') return 'profissional';
    if (user?.role === 'ADMIN') return 'administrador';
    return 'paciente';
  };

  const isPaciente = getSidebarRole() === 'paciente';

  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#F8F9FA]">
      <Sidebar role={getSidebarRole()} itemAtivo="chat" />

      <EmergencyModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
      />

      <section className="flex flex-col flex-1 relative p-8">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-black font-poppins">Mensagens</h1>
          {isPaciente && <EmergencyButton onClick={() => setShowEmergencyModal(true)} />}
        </header>

        <div className="flex gap-6 h-[753px]">
          {/* Coluna de Contatos */}
          <div className="w-[421px] bg-[#EAEAEA] rounded-[15px] shadow-lg p-6 flex flex-col gap-6">
            {/* Busca */}
            <div className="flex items-center gap-3 w-full h-[47px] px-4 py-3 bg-white/80 border border-slate-200 rounded-[24px]">
              <Search size={18} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar conversas..." 
                className="bg-transparent outline-none text-slate-600 text-[14px] font-inter w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Card de Contato */}
            <div 
              onClick={() => setSelectedChat('joana-bezerra')}
              className={`flex items-center gap-4 p-3 rounded-xl shadow-sm cursor-pointer transition-colors ${selectedChat === 'joana-bezerra' ? 'bg-white border-2 border-[#5BB38A]' : 'bg-white hover:bg-gray-50'}`}
            >
                <div className="w-[75px] h-[73px] bg-gray-300 rounded-[15px]" />
                <h2 className="font-semibold text-lg text-slate-800">Joana Bezerra</h2>
            </div>
          </div>

          {/* Área de Conversa */}
          <div className="flex-1 bg-[#EAEAEA] rounded-[15px] shadow-lg flex flex-col p-8 relative">
            {selectedChat ? (
              <>
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-[75px] h-[73px] bg-gray-300 rounded-[15px]" />
                   <h2 className="font-poppins font-semibold text-[24px] text-[#454545]">Joana Bezerra</h2>
                </div>

                <div className="flex-1 overflow-y-auto space-y-6">
                   <div className="bg-[#FDFDFB] p-4 rounded-[20px_20px_20px_4px] border border-[#DCE4DE] max-w-[435px]">
                      <p className="text-[#2D3A33]">Olá! Como foi o seu final de semana?</p>
                   </div>
                   <div className="bg-[#4A6C9C] p-4 rounded-[20px_20px_4px_20px] max-w-[435px] self-end ml-auto">
                      <p className="text-white">Oi, Dra. Joana! Tudo bem.</p>
                   </div>
                </div>

                {/* Input de Mensagem */}
                <div className="mt-6 flex items-center gap-3 bg-white/90 border border-slate-200 p-3 rounded-full">
                  <Paperclip className="text-slate-400 cursor-pointer ml-2" />
                  <input 
                    className="flex-1 bg-transparent outline-none text-slate-700" 
                    placeholder="Digite sua mensagem..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button className="bg-[#5BB38A] p-3 rounded-full text-white hover:bg-[#4a9c75] transition-colors">
                    <Send size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <MessageSquare size={64} className="mb-4 opacity-20" />
                <p>Selecione uma conversa para começar</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}