import { useState } from 'react';
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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ListaDeDisponibilidades } from '../components/ListaDeDisponibilidades';

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
  const queryClient = useQueryClient(); // Instância para gerenciar o cache global

  // Estados locais apenas para controle de UI (Modais e Seleções)
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isGerenciarAgendaOpen, setIsGerenciarAgendaOpen] = useState(false); 

  const getSidebarRole = (): "paciente" | "profissional" | "administrador" => {
    if (user?.role === 'PROFESSIONAL') return 'profissional';
    if (user?.role === 'ADMIN') return 'administrador';
    return 'paciente';
  };

  const isProfissional = getSidebarRole() === 'profissional';
  const token = localStorage.getItem('token');

  // --- LEITURA DE DADOS (QUERIES) ---

  // 1. Buscar consultas futuras
  const { data: appointments = [] } = useQuery({
    queryKey: ['appointments', 'upcoming'],
    queryFn: async () => {
      const response = await fetch('/api/appointments/me/upcoming', {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error("Erro ao carregar os compromissos da agenda.");
      return response.json() as Promise<Appointment[]>;
    },
    enabled: !!token,
  });

  // 2. Buscar histórico de consultas
  const { data: historyAppointments = [] } = useQuery({
    queryKey: ['appointments', 'history'],
    queryFn: async () => {
      const response = await fetch('/api/appointments/me/history', {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error("Erro ao carregar histórico de consultas do servidor.");
      return response.json() as Promise<Appointment[]>;
    },
    enabled: !!token,
  });

  // Helper centralizado para invalidar os dados da agenda e forçar a atualização da tela
  const invalidarAgendaCompleta = () => {
    queryClient.invalidateQueries({ queryKey: ['appointments'] });
  };


  // --- AÇÕES DO USUÁRIO (MUTATIONS) ---

  // 1. Entrar na chamada de vídeo
  const joinCallMutation = useMutation({
    mutationFn: async (appointment: Appointment) => {
      const appointmentId = (appointment as any).id || (appointment as any).appointment_id;
      const response = await fetch(`/api/appointments/${appointmentId}/can-join`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok || !data.canJoin) {
        throw new Error(data.message || "Acesso à sala indisponível no momento.");
      }
      return data.meetLink;
    },
    onSuccess: (meetLink) => {
      window.open(meetLink, '_blank', 'noopener,noreferrer');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  // 2. Baixar comprovante/certificado
  const downloadCertificateMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!token) throw new Error("Sessão expirada. Faça login novamente.");
      const response = await fetch(`/api/appointments/${id}/certificate`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/pdf' }
      });
      if (!response.ok) throw new Error("Não foi possível gerar ou baixar o comprovante.");
      return response.blob();
    },
    onSuccess: (blob, id) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `comprovante-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  // 3. Concluir consulta realizada
  const completeAppointmentMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/appointments/${id}/complete`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao concluir a consulta.");
      }
    },
    onSuccess: () => {
      toast.success("Consulta concluída com sucesso!");
      setSelectedAppointment(null);
      invalidarAgendaCompleta();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  // 4. Registrar ausência (No-Show)
  const noShowAppointmentMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/appointments/${id}/no-show`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao registrar ausência.");
      }
    },
    onSuccess: () => {
      toast.success("Ausência registrada com sucesso!");
      setSelectedAppointment(null);
      invalidarAgendaCompleta();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

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

          <div className="flex gap-3">
            {isProfissional && (
              <button 
                onClick={() => setIsGerenciarAgendaOpen(true)}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-900 transition-colors"
              >
                Gerenciar Agenda
              </button>
            )}

            {!isProfissional && (
              <EmergencyButton onClick={() => setShowEmergencyModal(true)} />
            )}
          </div>
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
                      handleDownloadCertificate={(id) => downloadCertificateMutation.mutate(id)}
                      handleMarkAsNoShow={(id) => noShowAppointmentMutation.mutate(id)}
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
              handleJoinCall={(app) => joinCallMutation.mutate(app)}
              handleMarkAsCompleted={(id) => completeAppointmentMutation.mutate(id)}
              handleMarkAsNoShow={(id) => noShowAppointmentMutation.mutate(id)}
              setIsRescheduleOpen={setIsRescheduleOpen}
              setIsCancelOpen={setIsCancelOpen}
            />
          )}
        </div>
      </section>


      {/* Modal de Gerenciamento de Agenda */}
      <ListaDeDisponibilidades
        isOpen={isGerenciarAgendaOpen}
        onClose={() => setIsGerenciarAgendaOpen(false)}
      />

      {selectedAppointment && (
        <>
          <CancelAppointmentModal
            isOpen={isCancelOpen}
            onClose={() => setIsCancelOpen(false)}
            appointment={selectedAppointment}
            onSuccess={() => {
              setSelectedAppointment(null);
              invalidarAgendaCompleta(); // Atualiza a lista após cancelar
            }}
          />
          <AppointmentRescheduleModal
            isOpen={isRescheduleOpen}
            onClose={() => setIsRescheduleOpen(false)}
            appointment={selectedAppointment}
            onSuccess={() => {
              setSelectedAppointment(null);
              invalidarAgendaCompleta(); // Atualiza a lista após remarcar
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
            invalidarAgendaCompleta(); // Sincroniza dados pós-avaliação
          }}
        />
      )}
    </main>
  );
}