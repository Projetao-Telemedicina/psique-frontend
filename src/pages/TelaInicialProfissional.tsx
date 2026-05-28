import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import Sidebar from '../components/Sidebar';
import { 
  Play, 
  Users, 
  Calendar, 
  Video, 
  ChevronRight,
  User as UserIcon,
  Loader2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface PatientUser {
  name: string;
  avatarUrl: string | null;
}

interface Patient {
  userId: string;
  user: PatientUser;
}

interface Appointment {
  id: string;
  patientId: string;
  professionalId: string;
  status: 'SCHEDULED' | 'CANCELED' | 'COMPLETED';
  startsAt: string;
  endsAt: string;
  priceCents: number;
  confirmedAt: string | null;
  canceledBy: string | null;
  cancellationReason: string | null;
  canceledAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  patient?: Patient;
}

interface ProfessionalProfile {
  name: string;
  avatarUrl: string | null;
}

export default function TelaInicialProfissional() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  const [currentDate, setCurrentDate] = useState("");
  const [profile, setProfile] = useState<ProfessionalProfile | null>(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [activePatientsCount, setActivePatientsCount] = useState(0);
  const [weeklySessionsCount, setWeeklySessionsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.toLocaleDateString('pt-BR', { weekday: 'long' });
    const day = today.getDate();
    const month = today.toLocaleDateString('pt-BR', { month: 'long' });
    
    const formatted = `Hoje é ${dayOfWeek}, ${day} de ${month.charAt(0).toUpperCase() + month.slice(1)}.`;
    setCurrentDate(formatted);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) return;

      try {
        const headers = { 
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        };

        const profileRes = await fetch('/users/me', { headers });
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile({
            name: profileData.name || '',
            avatarUrl: profileData.avatarUrl || null
          });
        }

        // 2. Busca consultas futuras agendadas
        const res = await fetch('/appointments/me/upcoming', { headers });
        if (res.ok) {
          const data: Appointment[] = await res.json();
          setUpcomingAppointments(data);

          // Pacientes Ativos
          const uniquePatients = new Set(data.map(app => app.patientId));
          setActivePatientsCount(uniquePatients.size);

          // Sessões na Semana
          const now = new Date();
          const currentDay = now.getDay(); 
          const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;
          
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - distanceToMonday);
          startOfWeek.setHours(0, 0, 0, 0);
          
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          endOfWeek.setHours(23, 59, 59, 999);

          const weeklyApps = data.filter(app => {
            const appDate = new Date(app.startsAt);
            return appDate >= startOfWeek && appDate <= endOfWeek;
          });
          setWeeklySessionsCount(weeklyApps.length);
        }
      } catch (error) {
        console.error("Erro ao carregar dados reais do painel:", error);
        toast.error("Não foi possível sincronizar todos os dados reais.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };


  const nextSession = upcomingAppointments.length > 0 ? upcomingAppointments[0] : null;

  const messagesMock = [
    { id: 1, name: 'Aisha Rahman', text: 'Dra, podemos mudar o horário de amanhã?', time: '10:42', unread: true, avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: 2, name: 'Lucas Mendes', text: 'Muito obrigado pela sessão de hoje.', time: 'Ontem', unread: false, avatar: 'https://randomuser.me/api/portraits/men/81.jpg' },
    { id: 3, name: 'Juliana Costa', text: 'Enviei os documentos que pediu.', time: 'Ontem', unread: false, avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
  ];

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#F8FAFC]">
        <div className="text-center flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-[#52A796]" />
          <p className="text-sm text-slate-500 font-medium">Carregando painel real...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex h-screen w-full bg-[#F8FAFC] overflow-hidden text-left font-sans antialiased">
      <Sidebar role="profissional" itemAtivo="home"  />

      <section className="flex flex-col flex-1 p-6 md:p-8 overflow-y-auto gap-8">
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex justify-between items-center shrink-0">
          <div>
            <h1 className="text-[22px] font-bold text-slate-800">Visão Geral</h1>
            <p className="text-slate-400 text-sm mt-0.5">{currentDate}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800">{profile?.name || user?.email || 'Profissional'}</p>
              <p className="text-xs text-slate-400">Profissional</p>
            </div>
            {profile?.avatarUrl ? (
              <img 
                src={profile.avatarUrl} 
                alt={profile.name} 
                className="w-12 h-12 rounded-full object-cover shrink-0 border border-slate-100"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-400">
                <UserIcon size={24} />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 shrink-0">
          <div className="lg:w-2/3 bg-[#52A796] rounded-[2rem] p-8 text-white relative overflow-hidden flex flex-col justify-center shadow-sm min-h-[220px]">
            <div className="absolute -right-10 -top-10 text-white/10 pointer-events-none">
              <svg width="250" height="250" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 22h20L12 2z" opacity="0.15"/>
              </svg>
            </div>

            {nextSession ? (
              <>
                <div className="relative z-10">
                  <p className="text-xs font-bold uppercase tracking-widest mb-2 text-white/80">Próxima Sessão</p>
                  <h2 className="text-4xl font-bold mb-4 leading-tight">
                    {nextSession.patient?.user?.name || 'Paciente'}
                  </h2>
                  <div className="flex items-center gap-5 text-sm font-medium">
                    <span className="flex items-center gap-2">
                      <Calendar size={18} className="opacity-80"/> 
                      {formatTime(nextSession.startsAt)}
                    </span>
                    <span className="flex items-center gap-2">
                      <Video size={18} className="opacity-80"/> Online
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => toast.success("Iniciando sala de teleconsulta...")}
                  className="absolute right-8 bottom-8 bg-white text-[#52A796] px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-slate-50 transition shadow-sm z-10"
                >
                  <Play size={14} fill="currentColor" /> Iniciar Sessão
                </button>
              </>
            ) : (
              <div className="relative z-10">
                <p className="text-xs font-bold uppercase tracking-widest mb-2 text-white/80">Próxima Sessão</p>
                <h2 className="text-3xl font-bold mb-2 leading-tight">Nenhuma sessão agendada</h2>
                <p className="text-sm text-white/70">Sua agenda de atendimentos futuros está livre no momento.</p>
              </div>
            )}
          </div>

          <div className="lg:w-1/3 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between flex-1 cursor-pointer hover:shadow-md transition" onClick={() => navigate('/profissional/pacientes')}>
              <div className="flex items-center gap-5">
                <div className="bg-blue-50/60 p-4 rounded-xl text-[#6B9EFA]">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Pacientes Ativos</p>
                  <p className="text-3xl font-bold text-slate-800">{activePatientsCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between flex-1 cursor-pointer hover:shadow-md transition" onClick={() => navigate('/profissional/agenda')}>
              <div className="flex items-center gap-5">
                <div className="bg-[#EAF5F2] p-4 rounded-xl text-[#52A796]">
                  <Calendar size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Sessões na Semana</p>
                  <p className="text-3xl font-bold text-slate-800">{weeklySessionsCount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 pb-8">
          
          <div className="lg:w-2/3 flex flex-col">
            <div className="flex justify-between items-center mb-4 px-1">
              <h3 className="font-bold text-lg text-slate-800">Minha Agenda</h3>
              <button 
                onClick={() => navigate('/profissional/agenda')}
                className="text-[#52A796] text-sm font-semibold hover:underline"
              >
                Ver agenda completa
              </button>
            </div>
            
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden min-h-[200px] justify-center">
              {upcomingAppointments.length === 0 ? (
                <div className="text-center p-8 text-slate-400 flex flex-col items-center gap-2">
                  <Calendar size={32} className="opacity-40" />
                  <p className="text-sm font-medium">Nenhum atendimento programado na agenda.</p>
                </div>
              ) : (
                upcomingAppointments.slice(0, 4).map((item, index) => {
                  const isFirst = index === 0;
                  return (
                    <div 
                      key={item.id} 
                      className={`flex items-center justify-between p-5 cursor-pointer hover:bg-slate-50 transition ${index !== upcomingAppointments.slice(0, 4).length - 1 ? 'border-b border-slate-100' : ''}`}
                    >
                      <div className="flex items-center gap-5">
                        <div className={`w-16 h-11 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${isFirst ? 'bg-[#52A796] text-white' : 'bg-slate-100 text-slate-500'}`}>
                          {formatTime(item.startsAt)}
                        </div>
                        <div className="flex items-center gap-4">
                          {item.patient?.user?.avatarUrl ? (
                            <img src={item.patient.user.avatarUrl} alt="Paciente" className="w-10 h-10 rounded-full object-cover shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                              <UserIcon size={18} />
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{item.patient?.user?.name || 'Paciente'}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className={`w-1.5 h-1.5 rounded-full ${isFirst ? 'bg-[#52A796]' : 'bg-slate-300'}`}></span>
                              <p className="text-xs font-medium text-slate-400">{isFirst ? 'A seguir' : 'Agendado'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-slate-300 mr-2" />
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="lg:w-1/3 flex flex-col">
            <div className="flex justify-between items-center mb-4 px-1">
              <h3 className="font-bold text-lg text-slate-800">Últimas Mensagens</h3>
              <button 
                onClick={() => navigate('/profissional/chat')}
                className="text-[#52A796] text-sm font-semibold hover:underline"
              >
                Abrir chat
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
              {messagesMock.map((msg, index) => (
                <div 
                  key={msg.id} 
                  className={`flex items-start gap-4 p-5 cursor-pointer hover:bg-slate-50 transition ${index !== messagesMock.length - 1 ? 'border-b border-slate-100' : ''}`}
                >
                  <div className="relative shrink-0 mt-1">
                    <img src={msg.avatar} alt={msg.name} className="w-10 h-10 rounded-full object-cover" />
                    {msg.unread && (
                      <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <p className={`text-sm truncate ${msg.unread ? 'font-bold text-slate-800' : 'font-semibold text-slate-700'}`}>
                        {msg.name}
                      </p>
                      <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap ml-2">
                        {msg.time}
                      </span>
                    </div>
                    <p className={`text-xs truncate ${msg.unread ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
                      {msg.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}