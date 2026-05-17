import { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, 
  Video, ArrowLeftRight, XCircle, ExternalLink, FileText, CheckCircle, AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import EmergencyButton from '../components/EmergencyButton';
import CancelAppointmentModal from '../components/CancelAppointmentModal';
import AppointmentRescheduleModal from '../components/AppointmentRescheduleModal';

interface Appointment {
  id: string;
  startsAt: string;
  endsAt: string;
  status: 'SCHEDULED' | 'RESCHEDULE_REQUESTED' | 'COMPLETED' | 'CANCELED' | 'NO_SHOW';
  patientId: string;
  professionalId: string;
  meetLink?: string;
  professional?: {
    specialty: string;
    user: { name: string; avatarUrl: string | null };
  };
  patient?: {
    user: { name: string; avatarUrl: string | null };
  };
}

export default function Agenda() {
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [historyAppointments, setHistoryAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const [currentDate, setCurrentDate] = useState(new Date());

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0 = Janeiro, 4 = Maio, etc.

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const formattedMonthYear = currentDate.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric'
  });

  const formattedMonthShort = currentDate.toLocaleDateString('pt-BR', {
    month: 'short'
  }).replace('.', '');

  // Busca os agendamentos futuros/ativos do paciente logado
  const fetchUpcomingAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/appointments/me/upcoming', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      } else {
        toast.error("Erro ao carregar os compromissos da agenda.");
      }
    } catch {
      toast.error("Erro de conexão com o servidor.");
    }
  };

  // Busca o histórico de consultas
  const fetchAppointmentsHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/appointments/me/history', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setHistoryAppointments(data);
      }
    } catch {
      console.error("Erro ao carregar histórico de consultas do servidor.");
    }
  };

  useEffect(() => {
    fetchUpcomingAppointments();
    fetchAppointmentsHistory();
  }, []);

  const handleJoinCall = async (appointment: Appointment) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/appointments/${appointment.id}/can-join`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();

      if (response.ok && data.canJoin) {
        window.open(data.meetLink, '_blank', 'noopener,noreferrer');
      } else {
        toast.error(data.message || "Acesso à sala indisponível no momento.");
      }
    } catch {
      toast.error("Erro ao verificar permissão da chamada.");
    }
  };

  const handleDownloadCertificate = (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    window.open(`/api/appointments/${id}/certificate?token=${token}`, '_blank', 'noopener,noreferrer');
  };

  const getParticipantName = (app: Appointment) => {
    if (app.professional?.user?.name) return app.professional.user.name;
    if (app.patient?.user?.name) return app.patient.user.name;
    return "Consulta Psique";
  };

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md"><CheckCircle size={10} /> Concluída</span>;
      case 'CANCELED':
        return <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md"><XCircle size={10} /> Cancelada</span>;
      case 'NO_SHOW':
        return <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md"><AlertCircle size={10} /> Ausência</span>;
      default:
        return null;
    }
  };

  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#F8FAFC]">
      <Sidebar role="paciente" itemAtivo="agenda" />

      <section className="flex flex-col flex-1 overflow-hidden text-left">
        <header className="flex items-center justify-between px-8 py-6 bg-white border-b border-slate-100 shrink-0">
          <div>
            <h1 className="text-3xl font-bold text-[#1E293B]">Agenda</h1>
            <p className="text-slate-500 text-sm">Sincronizada com o seu Google Agenda</p>
          </div>
          <EmergencyButton onClick={() => console.log('Botão de pânico disparado')} />
        </header>

        <div className="flex flex-1 overflow-hidden">
          
          {/* PAINEL DA ESQUERDA: Calendário + Histórico abaixo */}
          <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
            
            {/* Bloco do Calendário */}
            <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm flex flex-col shrink-0">
              
              <div className="flex items-center gap-4 mb-6">
                <span className="text-lg font-bold text-slate-800 capitalize">{formattedMonthYear}</span>
                <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                  <button 
                    onClick={handlePreviousMonth}
                    className="p-1 hover:bg-white rounded-md text-slate-600 hover:shadow-xs transition-all cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <div className="bg-[#52B788] text-white font-semibold text-xs px-2.5 py-1 rounded-lg shadow-xs min-w-[50px] text-center capitalize">
                    {formattedMonthShort}
                  </div>
                  <button 
                    onClick={handleNextMonth}
                    className="p-1 hover:bg-white rounded-md text-slate-600 hover:shadow-xs transition-all cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 text-center gap-2 border-b border-slate-100 pb-3 mb-2">
                {['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'].map(d => (
                  <span key={d} className="text-xs font-bold text-slate-400 uppercase tracking-wide">{d}</span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {/* 3. Renderização Dinâmica do Offset do primeiro dia da semana */}
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="bg-slate-50/40 rounded-2xl min-h-[85px]"></div>
                ))}
                
                {/* 4. Renderização Dinâmica da quantidade exata de dias do mês */}
                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const diaAtual = index + 1;
                  
                  // Procura consultas filtrando pelo Dia, Mês e Ano selecionados dinamicamente
                  const consultaDoDia = appointments.find(app => {
                    const dataAgendada = new Date(app.startsAt);
                    return (
                      dataAgendada.getUTCDate() === diaAtual && 
                      dataAgendada.getUTCMonth() === currentMonth &&
                      dataAgendada.getUTCFullYear() === currentYear
                    );
                  });

                  return (
                    <div 
                      key={diaAtual} 
                      className={`p-2.5 rounded-2xl border min-h-[85px] flex flex-col justify-between transition-all ${
                        consultaDoDia ? 'border-emerald-100 bg-emerald-50/20 shadow-xs' : 'border-slate-100 bg-white'
                      }`}
                    >
                      <span className={`text-xs font-bold ${consultaDoDia ? 'text-[#52B788]' : 'text-slate-400'}`}>
                        {diaAtual}
                      </span>

                      {consultaDoDia && (
                        <button
                          type="button"
                          onClick={() => setSelectedAppointment(consultaDoDia)}
                          className="w-full bg-[#52B788] hover:bg-[#409A70] text-white text-[10px] font-bold py-1 px-2 rounded-lg text-left flex flex-col justify-between truncate transition-all mt-1 cursor-pointer"
                        >
                          <span className="truncate block w-full">{getParticipantName(consultaDoDia)}</span>
                          <span className="text-[9px] opacity-90 mt-0.5 block">
                            {new Date(consultaDoDia.startsAt).getUTCHours().toString().padStart(2, '0')}:00h
                          </span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bloco do Histórico */}
            <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm flex flex-col text-left">
              <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Histórico de Consultas</h3>
                  <p className="text-slate-400 text-xs">Registro de sessões anteriores</p>
                </div>
                <span className="text-xs bg-slate-100 text-slate-500 font-semibold px-3 py-1 rounded-full">
                  {historyAppointments.length} {historyAppointments.length === 1 ? 'sessão' : 'sessões'}
                </span>
              </div>

              {historyAppointments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {historyAppointments.map((histApp) => (
                    <div 
                      key={histApp.id} 
                      className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl flex flex-col justify-between gap-3 hover:border-slate-200 transition-all"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 truncate max-w-[180px]">
                            {getParticipantName(histApp)}
                          </h4>
                          <p className="text-xs text-slate-400 mt-0.5">{histApp.professional?.specialty}</p>
                        </div>
                        {getStatusBadge(histApp.status)}
                      </div>

                      <div className="flex items-center justify-between pt-2.5 border-t border-slate-200/60 text-xs text-slate-500 font-medium">
                        <div className="flex items-center gap-1.5">
                          <CalendarIcon size={13} className="text-slate-400" />
                          <span>{new Date(histApp.startsAt).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'})}</span>
                          <Clock size={13} className="text-slate-400 ml-2" />
                          <span>{new Date(histApp.startsAt).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>

                        {histApp.status === 'COMPLETED' && (
                          <button 
                            onClick={() => handleDownloadCertificate(histApp.id)}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-bold transition-all bg-white shadow-xs border border-slate-100 px-2 py-1 rounded-lg text-[11px] cursor-pointer"
                          >
                            <FileText size={12} /> PDF
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                  <CalendarIcon size={24} className="text-slate-300 mx-auto mb-1.5" />
                  <p className="text-xs font-medium">Nenhuma consulta anterior encontrada no seu histórico.</p>
                </div>
              )}
            </div>

          </div>

          {/* PAINEL DA DIREITA */}
          {selectedAppointment && (
            <aside className="w-[380px] bg-white border-l border-slate-100 p-6 flex flex-col shrink-0 overflow-y-auto text-left">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600">
                    {selectedAppointment.status === 'RESCHEDULE_REQUESTED' ? 'Reagendamento Solicitado' : 'Agendada'}
                  </span>
                  <h2 className="text-xl font-black text-slate-800 mt-3">{getParticipantName(selectedAppointment)}</h2>
                </div>
                <button 
                  onClick={() => setSelectedAppointment(null)}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-xl transition-all cursor-pointer"
                >
                  Fechar
                </button>
              </div>

              <div className="space-y-3 bg-slate-50/60 rounded-2xl p-4 border border-slate-100 text-sm text-slate-600 font-medium mb-6">
                <div className="flex items-center gap-3">
                  <CalendarIcon size={16} className="text-slate-400" />
                  <span>
                    {new Date(selectedAppointment.startsAt).toLocaleDateString('pt-BR', {day: '2-digit', month: 'long', year: 'numeric'})}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-slate-400" />
                  <span>
                    Das {new Date(selectedAppointment.startsAt).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})} às {new Date(selectedAppointment.endsAt).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-auto">
                <button 
                  onClick={() => handleJoinCall(selectedAppointment)}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Video size={14} /> Acessar Sala de Vídeo <ExternalLink size={12} />
                </button>
                
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
            </aside>
          )}

        </div>
      </section>

      {selectedAppointment && (
        <>
          <CancelAppointmentModal 
            isOpen={isCancelOpen} 
            onClose={() => setIsCancelOpen(false)} 
            appointment={selectedAppointment}
            onSuccess={() => {
              setSelectedAppointment(null);
              fetchUpcomingAppointments();
              fetchAppointmentsHistory();
            }}
          />
          <AppointmentRescheduleModal 
            isOpen={isRescheduleOpen} 
            onClose={() => setIsRescheduleOpen(false)} 
            appointment={selectedAppointment}
            onSuccess={() => {
              setSelectedAppointment(null);
              fetchUpcomingAppointments();
              fetchAppointmentsHistory();
            }}
          />
        </>
      )}
    </main>
  );
}