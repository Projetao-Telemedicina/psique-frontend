import { Calendar as CalendarIcon, Clock, Video, ArrowLeftRight, XCircle, CheckCircle, UserX } from 'lucide-react';

interface AppointmentDetailsProps {
  appointment: any;
  isProfissional: boolean;
  getParticipantName: (app: any) => string;
  onClose: () => void;
  handleJoinCall: (app: any) => Promise<void>;
  handleMarkAsCompleted: (id: string) => Promise<void>;
  handleMarkAsNoShow: (id: string) => Promise<void>; 
  setIsRescheduleOpen: (open: boolean) => void;
  setIsCancelOpen: (open: boolean) => void;
}

export default function AppointmentSidebarDetails({
  appointment,
  isProfissional,
  getParticipantName,
  onClose,
  handleJoinCall,
  handleMarkAsCompleted,
  handleMarkAsNoShow, 
  setIsRescheduleOpen,
  setIsCancelOpen
}: AppointmentDetailsProps) {
  return (
    <aside className="w-[380px] bg-white border-l border-slate-100 p-6 flex flex-col shrink-0 overflow-y-auto text-left h-full shadow-sm">
      
      {/* Cabeçalho */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600">
            {appointment.status === 'RESCHEDULE_REQUESTED' ? 'Reagendamento Solicitado' : 'Agendada'}
          </span>
          <h2 className="text-xl font-black text-slate-800 mt-3">{getParticipantName(appointment)}</h2>
        </div>
        <button onClick={onClose} className="text-xs font-bold text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-xl transition-all cursor-pointer">
          Fechar
        </button>
      </div>

      {/* Card de Informações com o botão do Google Meet */}
      <div className="bg-slate-50/60 rounded-2xl p-4 border border-slate-100 text-sm text-slate-600 font-medium mb-6 flex justify-between items-center">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <CalendarIcon size={16} className="text-slate-400" />
            <span>{new Date(appointment.startsAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock size={16} className="text-slate-400" />
            <span>Das {new Date(appointment.startsAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} às {new Date(appointment.endsAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        {/* Link azul do Meet */}
        <button 
          onClick={() => handleJoinCall(appointment)}
          title="Acessar Sala de Vídeo"
          className="p-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition-colors cursor-pointer flex items-center justify-center"
        >
          <Video size={18} />
        </button>
      </div>

      {/* Grupo de Ações */}
      <div className="flex flex-col gap-5 mt-4">
        
        {/* Bloco 1: Ações Pós-Sessão (Apenas Profissional) */}
        {isProfissional && appointment.status === 'SCHEDULED' && (
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Ações Pós-Sessão
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => handleMarkAsCompleted(appointment.id || (appointment as any).appointment_id)}
                className="py-2.5 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <CheckCircle size={14} /> Concluir
              </button>
              <button 
                onClick={() => handleMarkAsNoShow(appointment.id || (appointment as any).appointment_id)}
                className="py-2.5 bg-amber-50 border border-amber-100 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <UserX size={14} /> Ausência
              </button>
            </div>
          </div>
        )}

        {/* Bloco 2: Gestão de Agenda */}
        <div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            Gestão de Agenda
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => setIsRescheduleOpen(true)} 
              className="py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <ArrowLeftRight size={13} /> Reagendar
            </button>
            <button 
              onClick={() => setIsCancelOpen(true)} 
              className="py-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <XCircle size={13} /> Cancelar
            </button>
          </div>
        </div>

      </div>
    </aside>
  );
}