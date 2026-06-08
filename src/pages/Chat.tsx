import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import EmergencyButton from '../components/EmergencyButton';
import { EmergencyModal } from "../components/EmergencyModal";
import { useAuth } from '../components/AuthContext';
import { Send, Paperclip, Search, MessageSquare, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
// 1. Importamos as ferramentas do React Query
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface ChatRoom {
  id: string;
  recipientName: string;
  recipientAvatar?: string;
  lastMessage?: string;
}

interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export default function Chat() {
  const { user, token } = useAuth();
  const queryClient = useQueryClient();
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  const activeToken = token || localStorage.getItem('token');

  // --- 2. QUERY: LISTA DE CONVERSAS (CONTATOS) ---
  const { data: chatRooms = [], isLoading: isLoadingChats } = useQuery({
    queryKey: ['chatRooms', user?.id],
    queryFn: async () => {
      if (!activeToken) throw new Error("Não autenticado");
      const res = await fetch('/api/chats', {
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      if (!res.ok) throw new Error("Erro ao carregar conversas");
      return res.json() as Promise<ChatRoom[]>;
    },
    enabled: !!activeToken && !!user?.id,
  });

  // --- 3. QUERY: HISTÓRICO DE MENSAGENS (CONDICIONAL) ---
  const { data: messages = [], isLoading: isLoadingMessages } = useQuery({
    queryKey: ['messages', selectedChat],
    queryFn: async () => {
      if (!activeToken || !selectedChat) return [];
      const res = await fetch(`/api/chats/${selectedChat}/messages`, {
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      if (!res.ok) throw new Error("Erro ao carregar mensagens");
      return res.json() as Promise<ChatMessage[]>;
    },
    // A query só roda se um chat estiver ativamente selecionado
    enabled: !!activeToken && !!selectedChat,
    // Mantém atualizando em background a cada 5 segundos (Polling simples para chat sem WebSocket)
    refetchInterval: 5000, 
  });

  // --- 4. MUTATION: ENVIAR MENSAGEM ---
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!selectedChat || !activeToken) return;
      const res = await fetch(`/api/chats/${selectedChat}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${activeToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
      });
      if (!res.ok) throw new Error("Não foi possível enviar a mensagem");
      return res.json();
    },
    // Otimização: limpa o input antes mesmo da resposta do servidor e invalida o cache
    onSuccess: () => {
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ['messages', selectedChat] });
      queryClient.invalidateQueries({ queryKey: ['chatRooms', user?.id] });
    },
    onError: () => {
      toast.error("Erro ao enviar mensagem. Tente novamente.");
    }
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || sendMessageMutation.isPending) return;
    sendMessageMutation.mutate(message.trim());
  };

  const getSidebarRole = (): "paciente" | "profissional" | "administrador" => {
    if (user?.role === 'PROFESSIONAL') return 'profissional';
    if (user?.role === 'ADMIN') return 'administrador';
    return 'paciente';
  };

  const isPaciente = getSidebarRole() === 'paciente';

  // Filtra as conversas da barra lateral com base na busca do usuário
  const filteredRooms = chatRooms.filter(room => 
    room.recipientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Encontra os detalhes do contato selecionado para o cabeçalho do chat
  const activeChatDetails = chatRooms.find(room => room.id === selectedChat);

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

            {/* Lista de Contatos Reativa */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {isLoadingChats ? (
                <div className="flex justify-center py-8"><Loader2 className="animate-spin text-[#5BB38A]" /></div>
              ) : filteredRooms.length > 0 ? (
                filteredRooms.map((room) => (
                  <div 
                    key={room.id}
                    onClick={() => setSelectedChat(room.id)}
                    className={`flex items-center gap-4 p-3 rounded-xl shadow-sm cursor-pointer transition-all ${selectedChat === room.id ? 'bg-white border-2 border-[#5BB38A]' : 'bg-white hover:bg-gray-50'}`}
                  >
                    {room.recipientAvatar ? (
                      <img src={room.recipientAvatar} alt={room.recipientName} className="w-[75px] h-[73px] rounded-[15px] object-cover" />
                    ) : (
                      <div className="w-[75px] h-[73px] bg-gray-300 rounded-[15px] flex items-center justify-center font-bold text-slate-600 text-xl">{room.recipientName[0]}</div>
                    )}
                    <div className="flex-1 min-w-0 text-left">
                      <h2 className="font-semibold text-lg text-slate-800 truncate">{room.recipientName}</h2>
                      {room.lastMessage && <p className="text-xs text-slate-400 truncate mt-0.5">{room.lastMessage}</p>}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-sm text-slate-500 py-8">Nenhuma conversa encontrada.</p>
              )}
            </div>
          </div>

          {/* Área de Conversa */}
          <div className="flex-1 bg-[#EAEAEA] rounded-[15px] shadow-lg flex flex-col p-8 relative overflow-hidden">
            {selectedChat ? (
              <>
                {/* Cabeçalho do Chat Ativo */}
                <div className="flex items-center gap-4 mb-8 text-left">
                   {activeChatDetails?.recipientAvatar ? (
                     <img src={activeChatDetails.recipientAvatar} alt={activeChatDetails.recipientName} className="w-[75px] h-[73px] rounded-[15px] object-cover" />
                   ) : (
                     <div className="w-[75px] h-[73px] bg-gray-300 rounded-[15px] flex items-center justify-center font-bold text-slate-600 text-xl">{activeChatDetails?.recipientName?.[0]}</div>
                   )}
                   <h2 className="font-poppins font-semibold text-[24px] text-[#454545]">{activeChatDetails?.recipientName || "Carregando..."}</h2>
                </div>

                {/* Janela de Mensagens Dinâmica */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 flex flex-col">
                   {isLoadingMessages ? (
                     <div className="flex-1 flex items-center justify-center"><Loader2 className="animate-spin text-slate-500" /></div>
                   ) : messages.map((msg) => {
                     const isMe = msg.senderId === user?.id;
                     return (
                       <div 
                         key={msg.id} 
                         className={`p-4 max-w-[435px] text-left break-words ${
                           isMe 
                             ? 'bg-[#4A6C9C] text-white rounded-[20px_20px_4px_20px] ml-auto' 
                             : 'bg-[#FDFDFB] text-[#2D3A33] rounded-[20px_20px_20px_4px] border border-[#DCE4DE]'
                         }`}
                       >
                         <p className="text-sm">{msg.content}</p>
                         <span className={`text-[10px] block mt-1 text-right ${isMe ? 'text-blue-100' : 'text-slate-400'}`}>
                           {new Date(msg.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                         </span>
                       </div>
                     );
                   })}
                </div>

                {/* Input de Mensagem integrado ao Submit da Mutation */}
                <form onSubmit={handleSendMessage} className="mt-6 flex items-center gap-3 bg-white/90 border border-slate-200 p-3 rounded-full">
                  <Paperclip className="text-slate-400 cursor-pointer ml-2" />
                  <input 
                    className="flex-1 bg-transparent outline-none text-slate-700" 
                    placeholder="Digite sua mensagem..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button 
                    type="submit"
                    disabled={sendMessageMutation.isPending || !message.trim()} 
                    className="bg-[#5BB38A] p-3 rounded-full text-white hover:bg-[#4a9c75] transition-colors disabled:opacity-50"
                  >
                    {sendMessageMutation.isPending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                  </button>
                </form>
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