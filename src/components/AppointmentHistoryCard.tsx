import { Calendar as CalendarIcon, Clock, FileText, XCircle, CheckCircle, AlertCircle } from 'lucide-react';
import type { Appointment } from '../pages/Agenda';

interface HistoryCardProps {
  histApp: Appointment;
  isProfissional: boolean;
  getParticipantName: (app: Appointment) => string;
  handleDownloadCertificate: (id: string) => void;
  handleMarkAsNoShow: (id: string) => Promise<void>;
  onOpenReview: () => void;
}

export default function AppointmentHistoryCard({
  histApp,
  isProfissional,
  getParticipantName,
  handleDownloadCertificate,
  onOpenReview,
}: HistoryCardProps) {

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md"><CheckCircle size={10} /> Concluída</span>;
      case 'CANCELED':
        return <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md"><XCircle size={10} /> Cancelada</span>;
      case 'NO_SHOW':
        return <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md"><AlertCircle size={10} /> Ausência</span>;
      default:
        return <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md"><Clock size={10} /> Pendente</span>;
    }
  };

  return (
    <div className="flex-1 min-w-[260px] p-4 bg-slate-50/50 border border-slate-100 rounded-2xl flex flex-col justify-between gap-3 hover:border-slate-200 transition-all">
      <div className="flex justify-between items-start gap-3">
        <div className="min-w-0 flex-1 text-left">
          <h4 className="text-sm font-bold text-slate-800 truncate">{getParticipantName(histApp)}</h4>
          <p className="text-xs text-slate-400 mt-0.5 truncate">{histApp.professional?.specialty || "Psicologia"}</p>

          {histApp.status === 'CANCELED' && histApp.cancellationReason && (
            <div className="mt-2 p-2 bg-red-50/70 border border-red-100 rounded-xl text-left">
              <p className="text-[11px] font-bold text-red-700">Motivo do cancelamento:</p>
              <p className="text-xs text-red-600 italic">"{histApp.cancellationReason}"</p>
            </div>
          )}
        </div>
        <div className="shrink-0">{getStatusBadge(histApp.status)}</div>
      </div>

      <div className="flex items-center justify-between pt-2.5 border-t border-slate-200/60 text-xs text-slate-500 font-medium gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1">
            <CalendarIcon size={13} className="text-slate-400" />
            <span>{new Date(histApp.startsAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={13} className="text-slate-400 ml-1" />
            <span>{new Date(histApp.startsAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        {histApp.status === 'COMPLETED' && (
          <div className="flex gap-2">
            {!isProfissional && (
              <button 
                onClick={onOpenReview}
                className="flex items-center gap-1 text-amber-600 hover:text-amber-700 font-bold transition-all bg-white shadow-xs border border-slate-100 px-2 py-1 rounded-lg text-[11px] cursor-pointer shrink-0"
              >
                Avaliar
              </button>
            )}
            <button 
              onClick={() => handleDownloadCertificate(histApp.id)}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-bold transition-all bg-white shadow-xs border border-slate-100 px-2 py-1 rounded-lg text-[11px] cursor-pointer shrink-0"
            >
              <FileText size={12} /> Comprovante
            </button>
          </div>
        )}
      </div>
    </div>
  );
}