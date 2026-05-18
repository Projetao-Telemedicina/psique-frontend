import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

interface CalendarViewProps {
  appointments: Appointment[];
  onSelectAppointment: (appointment: Appointment) => void;
}

export default function CalendarView({ appointments, onSelectAppointment }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Quantidade exata de dias do mês atual
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Descobre em qual dia da semana o mês começa (0 = Domingo, 1 = Segunda...)
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

  const getParticipantName = (app: Appointment) => {
    if (app.professional?.user?.name) return app.professional.user.name;
    if (app.patient?.user?.name) return app.patient.user.name;
    return "Consulta Psique";
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm flex flex-col shrink-0">
      
      {/* Cabeçalho do Calendário com os Controles de Mês */}
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

      {/* Dias da Semana */}
      <div className="grid grid-cols-7 text-center gap-2 border-b border-slate-100 pb-3 mb-2">
        {['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'].map(d => (
          <span key={d} className="text-xs font-bold text-slate-400 uppercase tracking-wide">{d}</span>
        ))}
      </div>

      {/* Grid de Dias */}
      <div className="grid grid-cols-7 gap-2">
        {/* Renderização Dinâmica do Offset (espaços vazios do começo do mês) */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="bg-slate-50/40 rounded-2xl min-h-[85px]"></div>
        ))}
        
        {/* Renderização Dinâmica dos Dias do Mês */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const diaAtual = index + 1;
          
          // Filtra todas as consultas deste dia específico usando fuso horário local
          const consultasDoDia = appointments.filter(app => {
            const dataAgendada = new Date(app.startsAt);
            return (
              dataAgendada.getDate() === diaAtual && 
              dataAgendada.getMonth() === currentMonth &&
              dataAgendada.getFullYear() === currentYear
            );
          });

          return (
            <div 
              key={diaAtual} 
              className={`p-2.5 rounded-2xl border min-h-[85px] flex flex-col justify-start gap-1 overflow-hidden transition-all ${
                consultasDoDia.length > 0 ? 'border-emerald-100 bg-emerald-50/20 shadow-xs' : 'border-slate-100 bg-white'
              }`}
            >
              <span className={`text-xs font-bold ${consultasDoDia.length > 0 ? 'text-[#52B788]' : 'text-slate-400'}`}>
                {diaAtual}
              </span>

              {/* Lista interna com scroll suave para suportar múltiplas consultas no mesmo dia */}
              {consultasDoDia.length > 0 && (
                <div className="flex flex-col gap-1 overflow-y-auto max-h-[55px] w-full pr-0.5 custom-scrollbar">
                  {consultasDoDia.map(consulta => (
                    <button
                      key={consulta.id}
                      type="button"
                      onClick={() => onSelectAppointment(consulta)}
                      className="w-full bg-[#52B788] hover:bg-[#409A70] text-white text-[10px] font-bold py-1 px-2 rounded-lg text-left flex flex-col justify-between truncate transition-all cursor-pointer shrink-0"
                    >
                      <span className="truncate block w-full">{getParticipantName(consulta)}</span>
                      <span className="text-[9px] opacity-90 mt-0.5 block">
                        {new Date(consulta.startsAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}h
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}