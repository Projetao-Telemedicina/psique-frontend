import { useState, useEffect, useRef, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import EmergencyButton from '../components/EmergencyButton';
import { EmergencyModal } from "../components/EmergencyModal";
import { useAuth } from '../components/AuthContext';
import { Send, Paperclip, Search, MessageSquare, Loader2, PlusCircle, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { io, Socket } from 'socket.io-client';

interface ChatRoom {
  id: string;
  recipientName?: string;
  recipientAvatar?: string;
  lastMessage?: string;
  patient: {
    userId: string;
    name: string;
    avatarUrl?: string | null;
  };
  professional: {
    userId: string;
    name: string;
    avatarUrl?: string | null;
    specialty?: string | null;
  };
}

interface ChatAttachment {
  id: string;
  fileName: string;
  mimeType: string;
  downloadUrl: string;
}

interface ChatMessage {
  id: string;
  senderId: string;
  content: string | null;
  type: 'TEXT' | 'IMAGE' | 'FILE';
  attachments: ChatAttachment[];
  sentAt: string;
}

interface ChatAppointment {
  id?: string;
  appointment_id?: string;
  patientId?: string;
  professionalId?: string;
  professional?: { user: { id?: string; name: string; avatarUrl?: string | null } };
  patient?: { user: { id?: string; name: string; avatarUrl?: string | null } };
}

export default function Chat() {
  const { user, token } = useAuth();
  const queryClient = useQueryClient();
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const activeToken = token || localStorage.getItem('token');
  const [socket, setSocket] = useState<Socket | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!activeToken) return;

    const newSocket = io('https://psique-backend-x82n.onrender.com/chat', {
      auth: {
        token: activeToken,
      },
      transports: ['websocket'],
      withCredentials: true,
      extraHeaders: {
        "Origin":"https://psique-frontend.vercel.app"
      }
    });

    newSocket.on('connect', () => {
      console.log('Socket conectado');
    });

    newSocket.on('disconnect', () => {
      console.log('Socket desconectado');
    });

    newSocket.on('chat:message-created', (newMessage) => {
      console.log('Nova mensagem', newMessage);

      queryClient.invalidateQueries({
        queryKey: ['chatRooms'],
      });

      queryClient.invalidateQueries({
        queryKey: ['messages'],
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [activeToken, queryClient]);

  // --- QUERIES ---
  const { data: chatRooms = [], isLoading: isLoadingChats } = useQuery({
    queryKey: ['chatRooms', user?.id],
    queryFn: async () => {
      const res = await fetch('/api/chat/rooms', { headers: { 'Authorization': `Bearer ${activeToken}` } });
      if (!res.ok) throw new Error("Erro ao carregar conversas");
      return res.json() as Promise<ChatRoom[]>;
    },
    enabled: !!activeToken && !!user?.id,
  });

  const { data: appointments = [], isLoading: isLoadingApts } = useQuery({
    queryKey: ['upcoming-appointments', user?.id],
    queryFn: async () => {
      const res = await fetch('/api/appointments/me/upcoming', { headers: { 'Authorization': `Bearer ${activeToken}` } });
      return res.json();
    },
    enabled: !!activeToken && isCreatingNew,
  });

  const { data: messages = [] } = useQuery<ChatMessage[], Error>({
    queryKey: ['messages', selectedChat],
    queryFn: async () => {
      if (!activeToken || !selectedChat) return [];

      const res = await fetch(
        `/api/chat/rooms/${selectedChat}/messages`,
        {
          headers: {
            Authorization: `Bearer ${activeToken}`,
          },
        }
      );

      if (!res.ok) {
        let errorMessage = `Erro ${res.status} ao carregar mensagens`;
        try {
          const errorBody = await res.json();
          if (errorBody?.message) {
            errorMessage = errorBody.message;
          }
        } catch {
          // ignore invalid json
        }
        throw new Error(errorMessage);
      }

      return res.json() as Promise<ChatMessage[]>;
    },
    enabled: !!activeToken && !!selectedChat,
  });

  // --- MUTATIONS ---
  const createRoomMutation = useMutation({
    mutationFn: async (appointment: ChatAppointment) => {
      const appointmentId = appointment.id || appointment.appointment_id;
      const professionalId = appointment.professionalId || appointment.professional?.user?.id;
      const patientId = appointment.patientId || appointment.patient?.user?.id;

      const body: { appointmentId?: string; professionalId?: string; patientId?: string } = {};

      if (appointmentId) body.appointmentId = appointmentId;

      if (user?.role === 'PATIENT') {
        if (professionalId) body.professionalId = professionalId;
      } else if (user?.role === 'PROFESSIONAL') {
        if (patientId) body.patientId = patientId;
      }

      const res = await fetch('/api/chat/rooms', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${activeToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error("Erro ao iniciar conversa");
      return res.json();
    },
    onSuccess: (newRoom) => {
      queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
      setSelectedChat(newRoom.id);
      setIsCreatingNew(false);
      toast.success("Conversa iniciada!");
    },
    onError: () => toast.error("Não foi possível iniciar a conversa.")
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!socket || !selectedChat) {
        throw new Error('Socket não conectado');
      }

      socket.emit('chat:send-message', {
        roomId: selectedChat,
        content,
      });

      return true;
    },
    onSuccess: () => {
      setMessage('');
    },
    onError: () => {
      toast.error('Erro ao enviar mensagem.');
    },
  });

  const getContactAvatar = (room: ChatRoom) => {
    if (room.recipientAvatar) return room.recipientAvatar;
    if (user?.role === 'PATIENT') return room.professional?.avatarUrl || '';
    return room.patient?.avatarUrl || '';
  };

  const uniqueAppointments = useMemo(() => {
    const seen = new Set();
    return appointments.filter((apt: any) =>{
      const contactId = user?.role === 'PATIENT'
        ? apt.professional?.user?.id
        : apt.patient?.user?.id;
        
      if (seen.has(contactId)) return false;
      seen.add(contactId);
      return true;
    });
  }, [appointments, user]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || sendMessageMutation.isPending) return;
    sendMessageMutation.mutate(message.trim());
  };

  const getSidebarRole = (): "paciente" | "profissional" | "administrador" => {
    if (user?.role === 'PROFESSIONAL') return 'profissional';
    return user?.role === 'ADMIN' ? 'administrador' : 'paciente';
  };

  const isPaciente = getSidebarRole() === 'paciente';
  const getRoomName = (room: ChatRoom) => {
    if (room.recipientName) return room.recipientName;
    if (user?.role === 'PATIENT') return room.professional?.name || 'Profissional';
    return room.patient?.name || 'Paciente';
  };

  const filteredRooms = chatRooms.filter((room) => {
    const name = getRoomName(room);
    return name.toLowerCase().includes((searchQuery || '').toLowerCase());
  });
  const activeChatDetails = chatRooms.find((room) => room.id === selectedChat);

  useEffect(() => {
    if (!socket || !selectedChat) return;

    socket.emit('chat:join-room', {
      roomId: selectedChat,
    });

    return () => {
      socket.emit('chat:leave-room', {
        roomId: selectedChat,
      });
    };
  }, [socket, selectedChat]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedChat) return;

    if(file.size > 5 * 1024 * 1024){
      toast.error('O arquivo deve ter no máximo 5MB.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`/api/chat/rooms/${selectedChat}/attachments`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${activeToken}`,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error();
      }

      toast.success('Arquivo enviado!');

      queryClient.invalidateQueries({
        queryKey:['messages', selectedChat],
      });

      queryClient.invalidateQueries({
        queryKey:['chatRooms'],
      });

    } catch {
      toast.error('Erro ao enviar arquivo.');
    }
  };

  const downloadAttachment = async (attachment: ChatAttachment) => {
    try{
      const response = await fetch(
        `/api${attachment.downloadUrl}`,
        {
          headers: {
            Authorization: `Bearer ${activeToken}`,
          },
        }
      );
      if(!response.ok){
        throw new Error();
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = attachment.fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error('Erro ao baixar arquivo.');
    }
  };

  return (
    <main className="flex h-screen w-screen overflow-hidden bg-[#F8F9FA]">
      <Sidebar role={getSidebarRole()} itemAtivo="chat" />
      <EmergencyModal isOpen={showEmergencyModal} onClose={() => setShowEmergencyModal(false)} />

      <section className="flex flex-col flex-1 overflow-hidden p-4 md:p-8">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-black font-poppins">Mensagens</h1>
          {isPaciente && <EmergencyButton onClick={() => setShowEmergencyModal(true)} />}
        </header>

        <div className="flex flex-1 gap-6 min-h-0">
          <div className="w-[350px] md:w-[421px] bg-[#EAEAEA] rounded-[15px] shadow-lg p-4 md:p-6 flex flex-col gap-6 min-h-0">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-700">Conversas</h2>
              <button 
                onClick={() => setIsCreatingNew(!isCreatingNew)} 
                className="text-[#5BB38A] hover:text-[#4a9c75]"
                title={isCreatingNew ? "Voltar para conversas" : "Iniciar nova conversa"}
              >
                {isCreatingNew ? <X size={24} /> : <PlusCircle size={24} />}
              </button>
            </div>

            {!isCreatingNew && (
              <div className="flex items-center gap-3 w-full h-[47px] px-4 py-3 bg-white/80 border border-slate-200 rounded-[24px]">
                <Search size={18} className="text-slate-400" />
                <input type="text" placeholder="Buscar conversas..." className="bg-transparent outline-none text-slate-600 text-[14px] w-full" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
            )}

            <div className="flex-1 overflow-y-auto space-y-3">
              {isCreatingNew ? (
                isLoadingApts ? <Loader2 className="animate-spin mx-auto text-[#5BB38A]" /> : uniqueAppointments.map((apt: any) => (
                  <div key={apt.id || apt.appointment_id || `${apt.professionalId || ''}-${apt.patientId || ''}`} onClick={() => createRoomMutation.mutate(apt)} className="p-4 bg-white rounded-xl cursor-pointer hover:bg-green-50 shadow-sm border border-slate-200 transition-all">
                    <p className="font-semibold text-slate-800">{user?.role === 'PATIENT' ? (apt.professional?.user?.name || 'Profissional') : (apt.patient?.user?.name || 'Paciente')}</p>
                    <p className="text-xs text-slate-400">Consulta agendada</p>
                  </div>
                ))
              ) : isLoadingChats ? <Loader2 className="animate-spin mx-auto text-[#5BB38A]" /> : filteredRooms.map((room) => (
                <div key={room.id} onClick={() => setSelectedChat(room.id)} className={`flex items-center gap-4 p-3 rounded-xl shadow-sm cursor-pointer ${selectedChat === room.id ? 'bg-white border-2 border-[#5BB38A]' : 'bg-white'}`}>
                  <div className="w-[50px] h-[50px] bg-gray-300 rounded-full flex items-center justify-center font-bold overflow-hidden shrink-0">
                    {getContactAvatar(room) ? (
                      <img
                        src={getContactAvatar(room) as string}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      (getRoomName(room) || '?')[0] || '?'
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-slate-800 truncate">{getRoomName(room)}</h2>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 bg-[#EAEAEA] rounded-[15px] shadow-lg flex flex-col p-4 md:p-8 relative min-h-0 overflow-hidden">
            {selectedChat ? (
              <>
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="font-poppins font-semibold text-[24px] text-[#454545]">{activeChatDetails ? getRoomName(activeChatDetails) : "Carregando..."}</h2>
                </div>
                <div className="flex-1 overflow-y-auto space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`p-4 max-w-[435px] ${msg.senderId === user?.id ? 'bg-[#4A6C9C] text-white ml-auto rounded-[20px_20px_4px_20px]' : 'bg-[#FDFDFB] text-[#2D3A33] rounded-[20px_20px_20px_4px]'}`}>
                      {msg.content && <p className="text-sm">{msg.content}</p>}
                      {msg.attachments?.map((attachment) => (
                        <button
                          key={attachment.id}
                          onClick={() => downloadAttachment(attachment)}
                          className="underline block mt-2 text-sm opacity-80 text-left"
                        >
                          📎 {attachment.fileName}
                        </button>
                      ))}
                      <p className="text-[11px] opacity-70 mt-2 text-right">
                        {new Date(msg.sentAt).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendMessage} className="mt-6 flex items-center gap-3 bg-white/90 border border-slate-200 p-3 rounded-full">
                  <>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                    />
                    <Paperclip
                      className="text-slate-400 cursor-pointer ml-2"
                      onClick={() => fileInputRef.current?.click()}
                    />
                  </>
                  <input
                    className="flex-1 bg-transparent outline-none text-slate-700"
                    placeholder="Digite sua mensagem..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button type="submit" disabled={sendMessageMutation.isPending || !message.trim()} className="bg-[#5BB38A] p-3 rounded-full text-white">
                    <Send size={20} />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <MessageSquare size={64} className="mb-4 opacity-20" />
                <p>Selecione uma conversa ou inicie uma nova</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}