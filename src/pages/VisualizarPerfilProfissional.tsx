import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Star, Loader2, ClipboardList
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import ModalDeletarConta from '../components/ModalDeletarConta';
import { useAuth } from '../components/AuthContext';
import {ProfissionalProfileForm} from '../components/ProfissionalProfileForm';

interface UpdateUserPayload {
  name: string;
  phone: string;
  avatarUrl: string | null;
  bio: string;
  cep: string;
  city: string;
  state: string;
  street: string;
  number: string;
}

interface UpdateProfessionalOnlyPayload {
  specialty: string;
  currentPassword?: string;
  newPassword?: string;
}

interface DadosProfissional {
  userId: string;
  crp: string;
  specialty: string;
  approvalStatus: string;
  scoreAvg: string;
  reviewCount: number;
  isPromoted: boolean;
  promotionEndsAt: string | null;
  user: {
    id: string;
    name: string;
    cpf: string;
    email: string;
    birthDate: string;
    gender: string;
    phone: string;
    bio: string;
    avatarUrl: string | null;
    cep: string;
    state: string;
    city: string;
    neighborhood: string;
    street: string;
    number: string;
    complement?: string;
  };
}

export default function VisualizarPerfilProfissional() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dados, setDados] = useState<DadosProfissional | null>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const TIPO_USUARIO = 'profissional';

  useEffect(() => {
    const carregarDadosProfissional = async () => {
      const userId = user?.id || localStorage.getItem('userId');
      const activeToken = token || localStorage.getItem('token');
      
      if (!activeToken || !userId) {
        console.error("Token de autenticação ou ID do usuário não encontrados.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/professionals/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${activeToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setDados(data);
        } else {
          console.error(`Erro ao buscar dados do profissional (${response.status})`);
          toast.error("Erro ao carregar dados do perfil.");
          if (response.status === 401 || response.status === 403) {
            navigate('/login');
          }
        }
      } catch (err) {
        console.error("Erro de rede ao conectar com a API:", err);
        toast.error("Erro de conexão ao carregar as informações.");
      } finally {
        setLoading(false);
      }
    };

    carregarDadosProfissional();
  }, [token, user, navigate]);

  const validarCampos = (): boolean => {
    if (!dados) return false;
    const { cep, city, state, number } = dados.user;

    const cepLimpo = String(cep || "").replace(/\D/g, "");
    if (cepLimpo.length !== 8) {
      toast.error("O campo CEP deve conter exatamente 8 números válidos.");
      return false;
    }

    const regexCidade = /^[A-Za-zÀ-ÿçÇ__]+$/;
    if (!regexCidade.test(city.trim())) {
      toast.error("O campo Cidade deve conter apenas caracteres alfabéticos.");
      return false;
    }

    const stateTrimmed = state.trim();
    const regexEstado = /^[A-Za-zÀ-ÿ\s]{2,}$/;
    if (!regexEstado.test(stateTrimmed)) {
      toast.error("O campo Estado inválido. Use apenas caracteres alfabéticos (Ex: PE ou Pernambuco).");
      return false;
    }

    const numberTrimmed = number.trim();
    const regexNumero = /^[0-9]+[A-Za-z]?$|^[sS]\/[nN]$|^[sS]em\s[nN]úmero$/;
    if (!regexNumero.test(numberTrimmed)) {
      toast.error("O campo Número deve ser um valor numérico válido (ex: 123, 123B) ou 'S/N'.");
      return false;
    }

    return true;
  };

  const handleSalvar = async () => {
    if (!dados) return;
    if (!validarCampos()) return;
    setSaving(true);
    const activeToken = token || localStorage.getItem('token');
    const targetUserId = dados.user.id || user?.id || localStorage.getItem('userId');
    
    try {
      const userPayload: UpdateUserPayload = {
        name: dados.user.name,
        phone: String(dados.user.phone || "").replace(/\D/g, ""),
        avatarUrl: dados.user.avatarUrl,
        bio: dados.user.bio,
        cep: dados.user.cep,
        city: dados.user.city,
        state: dados.user.state,
        street: dados.user.street,
        number: dados.user.number
      };

      const professionalPayload: UpdateProfessionalOnlyPayload = {
        specialty: dados.specialty
      };

      if (newPassword.trim() !== '') {
        professionalPayload.currentPassword = currentPassword;
        professionalPayload.newPassword = newPassword;
      }

      const requisicoes = [
        fetch(`/api/users/${targetUserId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${activeToken}`
          },
          body: JSON.stringify(userPayload)
        }),
        fetch(`/api/professionals/me`, {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${activeToken}`
          },
          body: JSON.stringify(professionalPayload)
        })
      ];

      const [resUser, resProfessional] = await Promise.all(requisicoes);

      if (resUser.ok && resProfessional.ok) {
        setIsEditing(false);
        setCurrentPassword('');
        setNewPassword('');
        toast.success("Perfil profissional atualizado com sucesso!");
      } else {
        const errorText = !resUser.ok ? "Erro ao atualizar dados cadastrais." : "Erro ao atualizar registro profissional.";
        toast.error(errorText);
      }
    } catch (err) {
      console.error("Erro ao salvar:", err);
      toast.error("Erro de conexão ao salvar.");
    } finally {
      setSaving(false);
    }
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && dados) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDados({ 
          ...dados, 
          user: { ...dados.user, avatarUrl: reader.result as string } 
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteConfirm = async (senha: string) => {
    const activeToken = token || localStorage.getItem('token');
    const targetUserId = dados?.user.id || user?.id || localStorage.getItem('userId');
    const response = await fetch(`/api/users/${targetUserId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${activeToken}`
      },
      body: JSON.stringify({ password: senha })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao tentar remover a conta do sistema.");
    }

    localStorage.clear();
    toast.success("Sua conta foi removida com sucesso.");
    setIsDeleteModalOpen(false);
    navigate('/login');
  };

  const maskCPF = (v: string = "") => v.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4").substring(0, 14);
  const maskPhone = (v: string = "") => v.replace(/\D/g, "").replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3").substring(0, 15);

  const opcoesGenero = [
    { label: 'Mulher cis', value: 'mulher_cis' },
    { label: 'Mulher trans', value: 'mulher_trans' },
    { label: 'Homem cis', value: 'homem_cis' },
    { label: 'Homem trans', value: 'homem_trans' },
    { label: 'Outro', value: 'outro' },
    { label: 'Prefiro não informar', value: 'prefiro_nao_informar' },
  ];

  const estrelasCalculadas = Math.round(Number(dados?.scoreAvg || 0));

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-teal-600" size={40} />
    </div>
  );

  if (!dados) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#F8FAFC] p-10">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Perfil profissional não encontrado.</h2>
      <button onClick={() => navigate('/login')} className="px-6 py-2 bg-teal-600 text-white rounded-full font-bold shadow-md active:scale-95">
        Voltar para Login
      </button>
    </div>
  );

  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#F8FAFC]">
      <Sidebar role={TIPO_USUARIO} itemAtivo="perfil" />

      <section className="flex flex-col flex-1 overflow-hidden text-left">
        <header className="flex items-center justify-between px-8 py-6 bg-white border-b border-slate-100">
          <div>
            <h1 className="text-3xl font-bold text-[#1E293B]">
              {isEditing ? "Editar Perfil" : "Meu Perfil"}
            </h1>
            <p className="text-slate-500 text-sm">Gerencie suas informações profissionais e plano.</p>
          </div>
          {!isEditing && (
            <button
              onClick={() => navigate('/match')}
              className="px-6 py-3 bg-teal-600 text-white font-bold text-sm rounded-full hover:bg-teal-700 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <ClipboardList size={16} /> Responder Questionário
            </button>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="flex gap-8 items-start max-w-[1400px] mx-auto">
            
            <ProfissionalProfileForm
              dados={dados}
              setDados={setDados}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              setIsDeleteModalOpen={setIsDeleteModalOpen}
              isSaving={saving}
              onSave={handleSalvar}
              onCancel={() => { setIsEditing(false); setCurrentPassword(''); setNewPassword(''); }}
              currentPassword={currentPassword}
              setCurrentPassword={setCurrentPassword}
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              fileInputRef={fileInputRef}
              onFotoChange={handleFotoChange}
              maskCPF={maskCPF}
              maskPhone={maskPhone}
              opcoesGenero={opcoesGenero}
              estrelasCalculadas={estrelasCalculadas}
            />

            <aside className={`w-[400px] flex flex-col gap-6 sticky top-0 transition-opacity ${isEditing ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              <SideCard title="Plano de Impulsionamento" icon={<Star className="text-emerald-500" />}>
                {dados.isPromoted ? (
                  <div className="bg-emerald-600 rounded-3xl p-6 text-white text-left shadow-lg">
                    <p className="text-sm font-bold">Impulso Ativo</p>
                    <p className="text-xs opacity-90 mb-4">Seu perfil está em destaque até:</p>
                    <p className="text-lg font-black">
                      {dados.promotionEndsAt ? new Date(dados.promotionEndsAt).toLocaleDateString('pt-BR') : '—'}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="bg-gradient-to-br from-teal-500 to-emerald-400 rounded-3xl p-6 text-white mb-4 text-left shadow-lg">
                      <p className="text-xl font-bold mb-1">Impulso Profissional</p>
                      <p className="text-xs opacity-90 mb-4">Apareça no topo das buscas dos pacientes.</p>
                      <p className="text-3xl font-black">R$ 29<span className="text-sm font-normal">/mês</span></p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => navigate('/impulsionamento')}
                        className="w-full py-3 bg-emerald-500 text-white font-bold text-xs rounded-xl hover:bg-emerald-600 transition-colors"
                      >
                        Ativar Destaque
                      </button>
                    </div>
                  </>
                )}
              </SideCard>
            </aside>
          </div>
        </div>
      </section>

      <ModalDeletarConta 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={handleDeleteConfirm} 
        tipoUsuario={TIPO_USUARIO} 
        temConsultasAbertas={false} 
      />
    </main>
  );
}

const SideCard = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
  <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm text-left">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      <div className="p-2 bg-slate-50 rounded-xl">{icon}</div>
    </div>
    {children}
  </div>
);