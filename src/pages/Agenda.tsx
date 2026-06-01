import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import EmergencyButton from '../components/EmergencyButton';
import { EmergencyModal } from "../components/EmergencyModal";
import CancelAppointmentModal from '../components/CancelAppointmentModal';
import AppointmentRescheduleModal from '../components/AppointmentRescheduleModal';
import CalendarView from '../components/CalendarView';
import { useAuth } from '../components/AuthContext';
import AppointmentHistoryCard from '../components/AppointmentHistoryCard';
import AppointmentSidebarDetails from '../components/AppointmentSidebarDetails';
import ReviewModal from '../components/ReviewModal';

export interface Appointment {
  id: string;
  startsAt: string;
  endsAt: string;
  status: 'SCHEDULED' | 'RESCHEDULE_REQUESTED' | 'COMPLETED' | 'CANCELED' | 'NO_SHOW';
  patientId: string;
  professionalId: string;
  meetLink?: string;
  cancellationReason?: string;
  professional?: {
    specialty: string;
    user: { name: string; avatarUrl: string | null };
  };
  patient?: {
    user: { name: string; avatarUrl: string | null };
  };
}

export default function Agenda() {
  const { user } = useAuth();
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [historyAppointments, setHistoryAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const getSidebarRole = (): "paciente" | "profissional" | "administrador" => {
    if (user?.role === 'PROFESSIONAL') return 'profissional';
    if (user?.role === 'ADMIN') return 'administrador';
    return 'paciente';
  };

  const isProfissional = getSidebarRole() === 'profissional';

  const fetchUpcomingAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/appointments/me/upcoming', {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        setAppointments(await response.json());
      } else {
        toast.error("Erro ao carregar os compromissos da agenda.");
      }
    } catch {
      toast.error("Erro de conexão com o servidor.");
    }
  };

  const fetchAppointmentsHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/appointments/me/history', {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        setHistoryAppointments(await response.json());
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
      const appointmentId = (appointment as any).id || (appointment as any).appointment_id;

      const response = await fetch(`/api/appointments/${appointmentId}/can-join`, {
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

  const handleDownloadCertificate = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`/api/appointments/${id}/certificate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/pdf'
        }
      });

      if (!response.ok) {
        if (response.status === 401) toast.error("Sessão expirada. Faça login novamente.");
        throw new Error("Erro ao baixar o documento");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `comprovante-${id}.pdf`);
      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Não foi possível gerar ou baixar o comprovante.");
    }
  };

  const handleMarkAsCompleted = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/appointments/${id}/complete`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        toast.success("Consulta concluída com sucesso!");
        setSelectedAppointment(null);
        fetchUpcomingAppointments();
        fetchAppointmentsHistory();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Erro ao concluir a consulta.");
      }
    } catch {
      toast.error("Erro de conexão com o servidor.");
    }
  };

  const handleMarkAsNoShow = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/appointments/${id}/no-show`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        toast.success("Ausência registrada com sucesso!");
        setSelectedAppointment(null);
        fetchUpcomingAppointments();
        fetchAppointmentsHistory();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Erro ao registrar ausência.");
      }
    } catch {
      toast.error("Erro de conexão com o servidor.");
    }
  };

  const getParticipantName = (app: Appointment) => {
    if (app.professional?.user?.name) return app.professional.user.name;
    if (app.patient?.user?.name) return app.patient.user.name;
    return "Consulta Psique";
  };

  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#F8FAFC]">
      <Sidebar role={getSidebarRole()} itemAtivo="agenda" />

      <EmergencyModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
      />

      <section className="flex flex-col flex-1 overflow-hidden text-left">
        <header className="flex items-center justify-between px-8 py-6 bg-white border-b border-slate-100 shrink-0">
          <div>
            <h1 className="text-3xl font-bold text-[#1E293B]">Agenda</h1>
            <p className="text-slate-500 text-sm">Sincronizada com o seu Google Agenda</p>
          </div>
          {!isProfissional && (
            <EmergencyButton onClick={() => setShowEmergencyModal(true)} />
          )}
        </header>

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
            <CalendarView
              appointments={appointments}
              onSelectAppointment={setSelectedAppointment}
            />

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
                <div className="flex flex-wrap gap-4 w-full">
                  {historyAppointments.map((histApp) => (
                    <AppointmentHistoryCard
                      key={histApp.id}
                      histApp={histApp}
                      isProfissional={isProfissional}
                      getParticipantName={getParticipantName}
                      handleDownloadCertificate={handleDownloadCertificate}
                      handleMarkAsNoShow={handleMarkAsNoShow}
                      onOpenReview={() => {
                        setReviewingId(histApp.id);
                        setIsReviewOpen(true);
                      }}
                    />
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

          {selectedAppointment && (
            <AppointmentSidebarDetails
              appointment={selectedAppointment}
              isProfissional={isProfissional}
              getParticipantName={getParticipantName}
              onClose={() => setSelectedAppointment(null)}
              handleJoinCall={handleJoinCall}
              handleMarkAsCompleted={handleMarkAsCompleted}
              handleMarkAsNoShow={handleMarkAsNoShow}
              setIsRescheduleOpen={setIsRescheduleOpen}
              setIsCancelOpen={setIsCancelOpen}
            />
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

      {reviewingId && (
        <ReviewModal
          isOpen={isReviewOpen}
          onClose={() => {
            setIsReviewOpen(false);
            setReviewingId(null);
          }}
          appointmentId={reviewingId}
          onSuccess={() => {
            fetchAppointmentsHistory();
          }}
        />
      )}
    </main>
  );
}