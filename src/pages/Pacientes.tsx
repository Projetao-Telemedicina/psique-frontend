import { useState, useMemo, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../components/AuthContext';
import { Loader2, Search, Lock, Calendar, BarChart2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const feelingLabels: Record<string, { label: string, emoji: string }> = {
  HAPPY: { label: "Feliz", emoji: "😊" },
  SCARED: { label: "Amedrontado", emoji: "😨" },
  CALM: { label: "Calmo/Tranquilo", emoji: "😌" },
  SAD: { label: "Triste", emoji: "😞" },
  ANXIOUS: { label: "Ansioso", emoji: "😵‍💫" },
  HOPEFUL: { label: "Esperançoso", emoji: "☺️" },
  ANGRY: { label: "Raivoso", emoji: "😡" },
  EXHAUSTED: { label: "Cansado", emoji: "😴" }
};

const sleepLabels: Record<string, string> = {
  EIGHT_OR_MORE: "Dormi 8 horas ou mais",
  SIX_TO_EIGHT: "Dormi entre 6 a 8 horas",
  FOUR_TO_FIVE: "Dormi entre 4 a 5 horas",
  LESS_THAN_FOUR: "Dormi menos que 4 horas"
};

interface Paciente {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatarUrl: string | null;
}

interface DiaryEntry {
  id: string;
  createdAt: string;
  content: string;
  feeling: string;
  sleepQuality: string;
  symptom: string;
}

export default function Pacientes() {
  const { user, token } = useAuth();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedDiarioId, setSelectedDiarioId] = useState<string | null>(null);
  const [busca, setBusca] = useState("");

  const activeToken = token || localStorage.getItem('token');

  // Sempre que mudar o paciente selecionado, limpamos o diário ativo anterior
  useEffect(() => {
    setSelectedDiarioId(null);
  }, [selectedId]);

  // --- QUERY: LISTA DE TODOS OS PACIENTES ---
  const { data: pacientes = [], isLoading: isLoadingPacientes } = useQuery({
    queryKey: ['myPatientsList', user?.id],
    queryFn: async () => {
      const response = await fetch('/api/appointments/me/history?limit=100', {
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      if (!response.ok) throw new Error("Erro ao obter histórico");
      const data = await response.json();
      
      const map = new Map();
      data.forEach((app: any) => {
        if (app.patient && !map.has(app.patientId)) {
          map.set(app.patientId, {
            id: app.patientId,
            name: app.patient.user.name,
            phone: app.patient.user.phone || 'Não informado',
            email: app.patient.user.email,
            avatarUrl: app.patient.user.avatarUrl
          });
        }
      });
      return Array.from(map.values()) as Paciente[];
    },
    enabled: !!activeToken,
  });

  // --- QUERY: PERFIL DETALHADO DO PACIENTE SELECIONADO ---
  const { data: selectedPacienteCompleto } = useQuery({
    queryKey: ['patientProfile', selectedId],
    queryFn: async () => {
      const resPerfil = await fetch(`/api/patient/${selectedId}/profile`, {
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      if (!resPerfil.ok) throw new Error("Erro ao carregar perfil completo");
      return resPerfil.json();
    },
    enabled: !!selectedId && !!activeToken,
  });

  // --- QUERY: DIÁRIOS EMOCIONAIS DO PACIENTE SELECIONADO ---
  const { data: diarios = [], error: diariesError, isLoading: isLoadingDiaries } = useQuery({
    queryKey: ['patientDiaries', selectedId],
    queryFn: async () => {
      const resDiarios = await fetch(`/api/diaries/patient/${selectedId}`, {
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      if (resDiarios.status === 403) throw new Error("Acesso restrito.");
      if (!resDiarios.ok) throw new Error("Erro ao carregar registros.");
      return resDiarios.json() as Promise<DiaryEntry[]>;
    },
    enabled: !!selectedId && !!activeToken,
    retry: false, // Evita disparar retentativas automáticas caso caia no 403 (privacidade)
  });

  // --- ESTADOS DERIVADOS E FILTROS ---
  const filteredPacientes = useMemo(() => {
    return pacientes.filter(p => 
      p.name?.toLowerCase().includes(busca.toLowerCase()) || 
      p.email?.toLowerCase().includes(busca.toLowerCase()) ||
      p.phone?.includes(busca)
    );
  }, [pacientes, busca]);

  const basePaciente = pacientes.find(p => p.id === selectedId);

  // Deriva dinamicamente qual diário exibir com base no ID selecionado ou pega o primeiro da lista por padrão
  const diarioSelecionado = useMemo(() => {
    if (!diarios.length) return null;
    if (selectedDiarioId) {
      return diarios.find(d => d.id === selectedDiarioId) || diarios[0];
    }
    return diarios[0];
  }, [diarios, selectedDiarioId]);

  const errorMsg = diariesError instanceof Error ? diariesError.message : null;

  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#F8FAFC]">
      <Sidebar role={user?.role === 'PROFESSIONAL' ? 'profissional' : 'administrador'} itemAtivo="pacientes" />

      <section className="flex flex-1 overflow-hidden">
        {/* Barra Lateral de Pacientes */}
        <aside className="w-96 border-r border-slate-200 bg-white flex flex-col p-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-6">Meus Pacientes</h1>
          
          <div className="relative w-full mb-6">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-400 transition-colors text-sm text-slate-600"
              placeholder="Buscar por nome, email..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              autoComplete="off"
            />
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {isLoadingPacientes ? (
              <div className="flex justify-center py-8"><Loader2 className="animate-spin text-slate-400" /></div>
            ) : filteredPacientes.length > 0 ? (
              filteredPacientes.map(p => (
                <button 
                  key={p.id} 
                  onClick={() => setSelectedId(p.id)} 
                  className={`w-full flex items-center gap-3 p-4 rounded-xl transition ${selectedId === p.id ? 'bg-blue-50 border border-blue-100' : 'hover:bg-slate-50 border border-transparent'}`}
                >
                  <img src={p.avatarUrl || '/default-avatar.png'} className="w-12 h-12 rounded-full object-cover shrink-0" alt="Avatar" />
                  <div className="text-left overflow-hidden">
                    <p className="font-semibold text-slate-800 truncate text-sm">{p.name}</p>
                    <p className="text-xs text-slate-500 truncate">{p.email}</p>
                  </div>
                </button>
              ))
            ) : (
              <p className="text-center text-slate-400 text-sm py-8">Nenhum paciente encontrado.</p>
            )}
          </div>
        </aside>

        {/* Painel Principal */}
        <main className="flex-1 h-full overflow-y-auto p-8">
          {basePaciente ? (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="flex items-start justify-start gap-4">
                <img src={basePaciente.avatarUrl || '/default-avatar.png'} className="w-16 h-16 rounded-full object-cover border border-slate-100" alt="Avatar" />
                <div className="text-left">
                  <h2 className="text-3xl font-bold text-slate-800">{basePaciente.name}</h2>
                  <div className="flex gap-4 text-sm text-slate-500 mt-1">
                    <p>📞 {selectedPacienteCompleto?.user.phone || basePaciente.phone}</p>
                    <p>📧 {selectedPacienteCompleto?.user.email || basePaciente.email}</p>
                  </div>
                </div>
              </div>

              {/* Cards Informativos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[#EFEFEF] rounded-[32px] p-8 shadow-sm flex items-center gap-6 text-left">
                  <div className="bg-white p-4 rounded-full border border-gray-200 text-slate-600"><BarChart2 size={24} /></div>
                  <div>
                    <p className="text-4xl font-black text-[#2D3748] tracking-tight">{isLoadingDiaries ? '...' : diarios.length}</p>
                    <p className="text-xs font-bold text-[#5A6A85] tracking-wide uppercase mt-0.5">Registros realizados</p>
                  </div>
                </div>

                <div className="bg-[#EFEFEF] rounded-[32px] p-8 shadow-sm flex items-center gap-6 text-left">
                  <div className="bg-white p-4 rounded-full border border-gray-200 text-slate-600"><Calendar size={24} /></div>
                  <div>
                    <p className="text-2xl font-bold text-[#2D3748] tracking-tight">
                      {diarios[0] ? new Date(diarios[0].createdAt).toLocaleDateString('pt-BR') : '--/--/----'}
                    </p>
                    <p className="text-xs font-bold text-[#5A6A85] tracking-wide uppercase mt-0.5">Último registro</p>
                  </div>
                </div>
              </div>

              {/* Tratamento de Erros de Privacidade / Bloqueios */}
              {errorMsg ? (
                <div className="flex flex-col items-center justify-center h-64 bg-white rounded-3xl border border-red-100 p-8 text-center shadow-sm">
                  <Lock className="text-red-400 mb-3" size={36} />
                  <h3 className="text-lg font-bold text-slate-800">Acesso Restrito</h3>
                  <p className="text-slate-500 max-w-sm mt-2 text-sm">{errorMsg}</p>
                </div>
              ) : (
                <div className="flex flex-col lg:flex-row gap-8 min-w-0">
                  {/* Navegação Histórica à Esquerda */}
                  <div className="w-full lg:w-72 space-y-2 flex-shrink-0 text-left">
                    <p className="font-bold text-slate-700 mb-4 text-sm">Histórico</p>
                    <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2">
                      {isLoadingDiaries ? (
                        <div className="flex justify-center py-4"><Loader2 className="animate-spin text-slate-400" /></div>
                      ) : diarios.map(d => (
                        <button 
                          key={d.id} 
                          onClick={() => setSelectedDiarioId(d.id)} 
                          className={`block w-full p-3 rounded-2xl text-left text-sm transition ${diarioSelecionado?.id === d.id ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200' : 'bg-white hover:bg-slate-50 border border-slate-100'}`}
                        >
                          {new Date(d.createdAt).toLocaleDateString('pt-BR')}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Detalhamento do Registro Selecionado à Direita */}
                  <div className="flex-1 min-w-0 bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm text-left">
                    {diarioSelecionado ? (
                      <div className="space-y-6">
                        <h3 className="text-xl font-bold text-slate-800">Registro de {new Date(diarioSelecionado.createdAt).toLocaleDateString('pt-BR')}</h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Humor</p>
                            <div className="flex items-center gap-3">
                              <span className="text-3xl">{feelingLabels[diarioSelecionado.feeling]?.emoji || '😐'}</span>
                              <span className="font-medium text-slate-700 text-sm truncate">{feelingLabels[diarioSelecionado.feeling]?.label || "Não informado"}</span>
                            </div>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Qualidade do Sono</p>
                            <div className="flex items-center gap-3">
                              <span className="font-medium text-slate-700 text-sm whitespace-normal leading-tight">{sleepLabels[diarioSelecionado.sleepQuality] || "Não informado"}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Relato do dia</p>
                          <div className="text-slate-700 bg-slate-50 p-5 rounded-2xl border border-slate-100 min-h-[120px] text-sm leading-relaxed break-words whitespace-pre-wrap">
                            {diarioSelecionado.content || "Nenhum relato fornecido."}
                          </div>
                        </div>
                      </div>
                    ) : <p className="text-slate-400 italic">Selecione uma data no histórico.</p>}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              <p className="text-lg">Selecione um paciente na lista ao lado.</p>
            </div>
          )}
        </main>
      </section>
    </main>
  );
}