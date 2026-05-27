import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../components/AuthContext';

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
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedPacienteCompleto, setSelectedPacienteCompleto] = useState<any>(null);
  const [diarios, setDiarios] = useState<DiaryEntry[]>([]);
  const [diarioSelecionado, setDiarioSelecionado] = useState<DiaryEntry | null>(null);
  const [busca, setBusca] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchPacientes = async () => {
    try {
      const activeToken = token || localStorage.getItem('token');
      const response = await fetch('/api/appointments/me/history?limit=100', {
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      if (!response.ok) throw new Error();
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
      setPacientes(Array.from(map.values()));
    } catch {
      toast.error("Erro ao carregar lista de pacientes.");
    }
  };

  useEffect(() => {
    if (selectedId) {
      const fetchData = async () => {
        const activeToken = token || localStorage.getItem('token');
        setErrorMsg(null);
        try {
          const resPerfil = await fetch(`/api/patient/${selectedId}/profile`, {
            headers: { 'Authorization': `Bearer ${activeToken}` }
          });
          if (resPerfil.ok) {
            const dataPerfil = await resPerfil.json();
            setSelectedPacienteCompleto(dataPerfil);
          }

          const resDiarios = await fetch(`/api/diaries/patient/${selectedId}`, {
            headers: { 'Authorization': `Bearer ${activeToken}` }
          });
          if (resDiarios.status === 403) throw new Error("Acesso restrito.");
          if (!resDiarios.ok) throw new Error("Erro ao carregar registros.");
          
          const dataDiarios = await resDiarios.json();
          setDiarios(dataDiarios);
          setDiarioSelecionado(dataDiarios[0] || null);
        } catch (e: any) {
          setErrorMsg(e.message);
          setDiarios([]);
          setDiarioSelecionado(null);
        }
      };
      fetchData();
    }
  }, [selectedId, token]);

  useEffect(() => { fetchPacientes(); }, []);

  const filteredPacientes = useMemo(() => {
    return pacientes.filter(p => 
      p.name?.toLowerCase().includes(busca.toLowerCase()) || 
      p.email?.toLowerCase().includes(busca.toLowerCase()) ||
      p.phone?.includes(busca)
    );
  }, [pacientes, busca]);

  const basePaciente = pacientes.find(p => p.id === selectedId);

  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#F8FAFC]">
      <Sidebar role={user?.role === 'PROFESSIONAL' ? 'profissional' : 'administrador'} itemAtivo="pacientes" />

      <section className="flex flex-1 overflow-hidden">
        <aside className="w-96 border-r border-slate-200 bg-white flex flex-col p-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-6">Meus Pacientes</h1>
          
          <input 
            type="text"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl mb-6 outline-none focus:border-blue-400 transition-colors"
            placeholder="Buscar por nome, email ou telefone..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            autoComplete="off"
          />

          
          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {filteredPacientes.length > 0 ? (
              filteredPacientes.map(p => (
                <button key={p.id} onClick={() => setSelectedId(p.id)} className={`w-full flex items-center gap-3 p-4 rounded-xl transition ${selectedId === p.id ? 'bg-blue-50' : 'hover:bg-slate-50'}`}>
                  <img src={p.avatarUrl || '/default-avatar.png'} className="w-12 h-12 rounded-full object-cover" alt="Avatar" />
                  <div className="text-left overflow-hidden">
                    <p className="font-semibold text-slate-800 truncate">{p.name}</p>
                    <p className="text-xs text-slate-500 truncate">{p.email}</p>
                  </div>
                </button>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-slate-400 text-sm">
                <p>Nenhum paciente encontrado.</p>
              </div>
            )}
          </div>
        </aside>

        <main className="flex-1 h-full overflow-y-auto p-8">
          {basePaciente ? (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="flex items-start justify-start gap-4">
                <img src={basePaciente.avatarUrl || '/default-avatar.png'} className="w-16 h-16 rounded-full object-cover" alt="Avatar" />
                <div className="text-left">
                  <h2 className="text-3xl font-bold text-slate-800">{basePaciente.name}</h2>
                  <div className="flex gap-4 text-sm text-slate-500 mt-1">
                    <p>📞 {selectedPacienteCompleto?.user.phone || basePaciente.phone}</p>
                    <p>📧 {selectedPacienteCompleto?.user.email || basePaciente.email}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[#EFEFEF] rounded-[32px] p-8 shadow-xl border border-gray-100/50 flex items-center gap-6">
                  <div className="bg-white p-5 rounded-full shadow-md border border-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-4xl font-black text-[#2D3748] tracking-tight">{diarios.length}</p>
                    <p className="text-sm font-semibold text-[#5A6A85] tracking-wide uppercase">Registros realizados</p>
                  </div>
                </div>

                <div className="bg-[#EFEFEF] rounded-[32px] p-8 shadow-xl border border-gray-100/50 flex items-center gap-6">
                  <div className="bg-white p-5 rounded-full shadow-md border border-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#2D3748] tracking-tight">
                      {diarioSelecionado ? new Date(diarioSelecionado.createdAt).toLocaleDateString('pt-BR') : '--/--/----'}
                    </p>
                    <p className="text-sm font-semibold text-[#5A6A85] tracking-wide uppercase">Último registro</p>
                  </div>
                </div>
              </div>

              {errorMsg ? (
                <div className="flex flex-col items-center justify-center h-64 bg-white rounded-3xl border border-red-100 p-8 text-center shadow-sm">
                  <div className="text-4xl mb-4">🔒</div>
                  <h3 className="text-lg font-bold text-slate-800">Acesso Restrito</h3>
                  <p className="text-slate-500 max-w-sm mt-2">{errorMsg}</p>
                </div>
              ) : (
                <div className="flex flex-col lg:flex-row gap-8 min-w-0">
                  <div className="w-full lg:w-72 space-y-2 flex-shrink-0">
                    <p className="font-bold text-slate-700 mb-4">Histórico</p>
                    <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2">
                      {diarios.map(d => (
                        <button key={d.id} onClick={() => setDiarioSelecionado(d)} className={`block w-full p-3 rounded-2xl text-left text-sm transition ${diarioSelecionado?.id === d.id ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200' : 'bg-white hover:bg-slate-50 border border-slate-100'}`}>
                          {new Date(d.createdAt).toLocaleDateString('pt-BR')}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0 bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
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