import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Pencil, Trash2, Wallet, Star, X, Save, Camera, Loader2, MapPin,
  Plus, History, CheckCircle, ArrowUpCircle, Settings
} from 'lucide-react';
import { toast } from 'react-hot-toast';

import Sidebar from '../components/Sidebar';
import EmergencyButton from '../components/EmergencyButton';
import { EmergencyModal } from "../components/EmergencyModal";
import ModalDeletarConta from '../components/ModalDeletarConta';
import { CampoPerfil } from '../components/CampoPerfil';
import { useAuth } from '../components/AuthContext';

interface UpdateUserPayload {
  name: string;
  phone: string;
  avatarUrl: string | null;
  city: string;
  state: string;
  street: string;
  number: string;
  patientProfile?: {
    emergencyContactName: string;
    emergencyContactPhone: string;
    shareDiaryWithProfessionals: boolean;
  };
}

interface UpdatePatientOnlyPayload {
  emergencyContactName: string;
  emergencyContactPhone: string;
  shareDiaryWithProfessionals: boolean;
  currentPassword?: string;
  newPassword?: string;
}

interface PerfilResponse {
  userId: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  shareDiaryWithProfessionals: boolean;
  user: {
    name: string;
    cpf: string;
    email: string;
    birthDate: string;
    gender: string;
    phone: string;
    avatarUrl: string | null;
    cep: string;
    state: string;
    city: string;
    neighborhood: string;
    street: string;
    number: string;
    complement: string;
  };
}

export default function VisualizarPerfilPaciente() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dados, setDados] = useState<PerfilResponse | null>(null);

  // Estados para Senhas
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const TIPO_USUARIO = 'paciente';

  const handleDeleteConfirm = async (senha: string) => {
    const activeToken = token || localStorage.getItem('token');
    const response = await fetch(`/api/users/${dados?.userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${activeToken}`
      },
      body: JSON.stringify({ password: senha })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao deletar conta.");
    }

    localStorage.clear();
    toast.success("Sua conta foi excluída com sucesso.");
    setIsDeleteModalOpen(false);
    navigate('/login');
  };

  useEffect(() => {
    const fetchPerfil = async () => {
      const userId = user?.id || localStorage.getItem('userId');
      const activeToken = token || localStorage.getItem('token');
      if (!activeToken || !userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/patient/${userId}/profile`, {
          headers: {
            'Authorization': `Bearer ${activeToken}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          setDados(data);
        }
        setLoading(false);
      } catch (err) {
        console.error("Erro conexão:", err);
        toast.error("Erro ao carregar os dados do perfil.");
        setLoading(false);
      }
    };
    fetchPerfil();
  }, [user, token]);

  const validarCampos = (): boolean => {
    if (!dados) return false;
    const { city, state, number, name } = dados.user;
    const { emergencyContactName, emergencyContactPhone } = dados;

    // RegEx padrões
    const regexAlfabeticoComAcentos = /^[A-Za-zÀ-ÿçÇ\s\-]+$/;
    const regexEstado = /^[A-Za-zÀ-ÿ\s]{2,}$/;
    const regexNumeroEndereco = /^[0-9]+[A-Za-z]?$|^[sS]\/[nN]$|^[sS]em\s[nN]úmero$/;

    // 1. Validação do Nome do Paciente
    if (!name || !regexAlfabeticoComAcentos.test(name.trim())) {
      toast.error("O campo Nome Completo deve conter apenas caracteres alfabéticos.");
      return false;
    }

    // 2. Validação da Cidade
    if (!city || !regexAlfabeticoComAcentos.test(city.trim())) {
      toast.error("O campo Cidade deve conter apenas caracteres alfabéticos.");
      return false;
    }

    // 3. Validação do Estado
    const stateTrimmed = state ? state.trim() : "";
    if (!regexEstado.test(stateTrimmed)) {
      toast.error("O campo Estado é inválido. Use apenas caracteres alfabéticos (Ex: PE ou Pernambuco).");
      return false;
    }

    // 4. Validação do Número do Endereço
    const numberTrimmed = number ? number.trim() : "";
    if (!regexNumeroEndereco.test(numberTrimmed)) {
      toast.error("O campo Número deve ser um valor numérico válido (ex: 123, 123B) ou 'S/N'.");
      return false;
    }

    // 5. Validação do Nome do Contato de Emergência
    if (!emergencyContactName || !regexAlfabeticoComAcentos.test(emergencyContactName.trim())) {
      toast.error("O Nome do Contato de Emergência deve conter apenas caracteres alfabéticos.");
      return false;
    }

    // 6. Validação do Telefone de Emergência (Verifica se contém dígitos mínimos)
    const phoneLimpo = emergencyContactPhone.replace(/\D/g, "");
    if (phoneLimpo.length < 10 || phoneLimpo.length > 11) {
      toast.error("O Telefone do Contato de Emergência deve ser um número válido com DDD.");
      return false;
    }

    return true;
  };

  const handleSalvar = async () => {
    if (!dados) return;
    if (!validarCampos()) return;
    setSaving(true);
    const activeToken = token || localStorage.getItem('token');

    try {
      // 1. Payload de atualização do Usuário Geral
      const userPayload: UpdateUserPayload = {
        name: dados.user.name,
        phone: dados.user.phone.replace(/\D/g, ""),
        avatarUrl: dados.user.avatarUrl,
        city: dados.user.city,
        state: dados.user.state,
        street: dados.user.street,
        number: dados.user.number,
        patientProfile: {
          emergencyContactName: dados.emergencyContactName,
          emergencyContactPhone: dados.emergencyContactPhone.replace(/\D/g, ""),
          shareDiaryWithProfessionals: dados.shareDiaryWithProfessionals
        }
      };

      // 2. Payload específico do paciente (com as senhas)
      const patientPayload: UpdatePatientOnlyPayload = {
        emergencyContactName: dados.emergencyContactName,
        emergencyContactPhone: dados.emergencyContactPhone.replace(/\D/g, ""),
        shareDiaryWithProfessionals: dados.shareDiaryWithProfessionals,
      };

      if (newPassword.trim() !== '') {
        patientPayload.currentPassword = currentPassword;
        patientPayload.newPassword = newPassword;
      }

      // Executa as chamadas concorrentes para as duas APIs
      const requisicoes = [
        fetch(`/api/users/${dados.userId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${activeToken}`
          },
          body: JSON.stringify(userPayload)
        }),
        fetch(`/api/patient/me/profile`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${activeToken}`
          },
          body: JSON.stringify(patientPayload)
        })
      ];

      const [resUser, resPatient] = await Promise.all(requisicoes);

      if (resUser.ok && resPatient.ok) {
        setIsEditing(false);
        setCurrentPassword('');
        setNewPassword('');
        toast.success("Perfil atualizado com sucesso!");
      } else {
        const errorText = !resUser.ok ? "Erro ao atualizar dados cadastrais." : "Erro ao atualizar dados clínicos.";
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
        setDados({ ...dados, user: { ...dados.user, avatarUrl: reader.result as string } });
      };
      reader.readAsDataURL(file);
    }
  };

  const maskPhone = (v: string = "") => v.replace(/\D/g, "").replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3").substring(0, 15);

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-teal-600" size={40} />
    </div>
  );

  if (!dados) return null;

  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#F8FAFC]">
      <Sidebar role={TIPO_USUARIO} itemAtivo="perfil" />

      <EmergencyModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
      />

      <section className="flex flex-col flex-1 overflow-hidden text-left">
        <header className="flex items-center justify-between px-8 py-6 bg-white border-b border-slate-100">
          <div>
            <h1 className="text-3xl font-bold text-[#1E293B]">
              {isEditing ? "Editar Perfil" : "Meu Perfil"}
            </h1>
            <p className="text-slate-500">Gerencie suas informações pessoais e plano.</p>
          </div>
          <EmergencyButton onClick={() => setShowEmergencyModal(true)} />
        </header>

        <div className="flex-1 overflow-y-auto p-8 text-left">
          <div className="flex gap-8 items-start">
            <article className="flex-1 bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-6">
                    <div
                      onClick={() => isEditing && fileInputRef.current?.click()}
                      className={`w-32 h-32 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white shrink-0 relative overflow-hidden transition-all bg-teal-600 ${isEditing ? 'cursor-pointer hover:opacity-90' : ''}`}
                    >
                      {dados.user.avatarUrl ? (
                        <img src={dados.user.avatarUrl} alt="Perfil" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-4xl font-bold">{dados.user.name?.[0]}</span>
                      )}
                      {isEditing && (
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center backdrop-blur-[1px]">
                          <Camera size={20} />
                          <span className="text-[10px] font-bold mt-1 tracking-widest uppercase">Alterar</span>
                        </div>
                      )}
                      <input type="file" ref={fileInputRef} hidden onChange={handleFotoChange} accept="image/*" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800">{dados.user.name}</h2>
                      <p className="text-teal-600 font-medium tracking-tight italic">Paciente Psique</p>
                    </div>
                  </div>

                  {!isEditing && (
                    <div className="flex flex-col items-center gap-2 text-center w-[240px]">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest w-full">
                        Não gostou das recomendações?
                      </span>
                      <button
                        type="button"
                        onClick={() => navigate('/match')}
                        className="w-full text-xs bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-bold shadow-md transition-all active:scale-95"
                      >
                        Refazer questionário de match
                      </button>
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-50 pt-8 text-left">
                  <div className="grid grid-cols-2 gap-y-6 gap-x-12">

                    <CampoPerfil
                      label="Nome Completo"
                      valor={dados.user.name}
                      isEditing={isEditing}
                      onChange={(val) => setDados({ ...dados, user: { ...dados.user, name: val } })}
                    />
                    <CampoPerfil
                      label="E-mail"
                      valor={dados.user.email}
                      isEditing={isEditing}
                      onChange={(val) => setDados({ ...dados, user: { ...dados.user, email: val } })}
                    />
                    <CampoPerfil
                      label="Telefone"
                      valor={maskPhone(dados.user.phone)}
                      isEditing={isEditing}
                      onChange={(val) => setDados({ ...dados, user: { ...dados.user, phone: maskPhone(val) } })}
                    />
                    <CampoPerfil
                      label="CPF"
                      valor={dados.user.cpf}
                      isEditing={false}
                    />

                    <div className="col-span-2 mt-4 flex items-center gap-2">
                      <MapPin size={14} className="text-slate-400" />
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Localização</h3>
                    </div>

                    <CampoPerfil
                      label="Cidade"
                      valor={dados.user.city}
                      isEditing={isEditing}
                      onChange={(val) => setDados({ ...dados, user: { ...dados.user, city: val } })}
                    />
                    <CampoPerfil
                      label="Estado"
                      valor={dados.user.state}
                      isEditing={isEditing}
                      onChange={(val) => setDados({ ...dados, user: { ...dados.user, state: val } })}
                    />
                    <CampoPerfil
                      label="Rua"
                      valor={dados.user.street}
                      isEditing={isEditing}
                      onChange={(val) => setDados({ ...dados, user: { ...dados.user, street: val } })}
                    />
                    <CampoPerfil
                      label="Número"
                      valor={dados.user.number}
                      isEditing={isEditing}
                      onChange={(val) => setDados({ ...dados, user: { ...dados.user, number: val } })}
                    />

                    <div className="col-span-2 mt-4">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Segurança e Emergência</h3>
                    </div>

                    <CampoPerfil
                      label="Contato de Emergência"
                      valor={dados.emergencyContactName}
                      isEditing={isEditing}
                      onChange={(val) => setDados({ ...dados, emergencyContactName: val })}
                    />
                    <CampoPerfil
                      label="Telefone do Contato"
                      valor={dados.emergencyContactPhone}
                      isEditing={isEditing}
                      onChange={(val) => setDados({ ...dados, emergencyContactPhone: maskPhone(val) })}
                    />

                    {isEditing && (
                      <>
                        <CampoPerfil
                          label="Senha Atual"
                          valor={currentPassword}
                          isEditing={isEditing}
                          type="password"
                          onChange={(val) => setCurrentPassword(val)}
                        />
                        <CampoPerfil
                          label="Nova Senha"
                          valor={newPassword}
                          isEditing={isEditing}
                          type="password"
                          onChange={(val) => setNewPassword(val)}
                        />
                      </>
                    )}

                    <div className="col-span-2 flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <input
                        type="checkbox"
                        disabled={!isEditing}
                        checked={dados.shareDiaryWithProfessionals}
                        onChange={(e) => setDados({ ...dados, shareDiaryWithProfessionals: e.target.checked })}
                        className="w-5 h-5 accent-teal-600 cursor-pointer"
                      />
                      <span className="text-sm text-slate-600 font-semibold italic">Permitir que meu psicólogo veja meu diário de saúde</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-10 border-t border-slate-50 pt-6">
                  {isEditing ? (
                    <>
                      <button onClick={() => { setIsEditing(false); setNewPassword(''); setCurrentPassword(''); }} className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 font-bold text-sm rounded-full hover:bg-slate-50 flex items-center justify-center gap-2">
                        <X size={16} /> Cancelar
                      </button>
                      <button onClick={handleSalvar} className="flex-1 py-3 bg-teal-600 text-white font-bold text-sm rounded-full hover:bg-teal-700 shadow-md flex items-center justify-center gap-2">
                        {saving ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16} /> Salvar Alterações</>}
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setIsDeleteModalOpen(true)} className="flex-1 py-3 bg-red-600 text-white font-bold text-sm rounded-full hover:bg-red-700 shadow-sm flex items-center justify-center gap-2">
                        <Trash2 size={16} /> Deletar Conta
                      </button>
                      <button onClick={() => setIsEditing(true)} className="flex-1 py-3 bg-transparent border border-slate-200 text-slate-600 font-bold text-sm rounded-full hover:bg-slate-50 flex items-center justify-center gap-2">
                        <Pencil size={16} /> Editar Informações
                      </button>
                    </>
                  )}
                </div>
              </div>
            </article>

            <aside className={`w-[400px] flex flex-col gap-6 sticky top-0 transition-opacity ${isEditing ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              <SideCard title="Carteira Virtual" icon={<Wallet className="text-blue-500" />}>
                <div className="bg-slate-50 rounded-2xl p-5 mb-4 text-left">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Saldo Disponível</p>
                  <p className="text-3xl font-black text-slate-800">R$ 150,00</p>
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
                    <Plus size={14} /> Adicionar
                  </button>
                  <button className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-full flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                    <History size={14} /> Histórico
                  </button>
                </div>
              </SideCard>

              <SideCard title="Assinatura e Planos" icon={<Star className="text-emerald-500" />}>
                <div className="bg-gradient-to-br from-teal-500 to-emerald-400 rounded-3xl p-6 text-white mb-4 text-left shadow-lg">
                  <p className="text-xl font-bold mb-1">Plano Conexão</p>
                  <p className="text-xs opacity-90 mb-4">12 sessões válidas por 180 dias</p>
                  <p className="text-3xl font-black">R$ 200<span className="text-sm font-normal">/mês</span></p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 px-2 mb-6">
                  <CheckCircle size={14} className="text-emerald-500" />
                  <span>Próxima cobrança: 15/11/2026</span>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="w-full py-3 bg-emerald-500 text-white font-bold text-xs rounded-xl hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2">
                    <ArrowUpCircle size={16} /> Fazer Upgrade
                  </button>
                  <button className="w-full py-3 bg-white border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                    <Settings size={16} /> Gerenciar Assinatura
                  </button>
                </div>
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

const SideCard = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm text-left">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      <div className="p-2 bg-slate-50 rounded-xl">{icon}</div>
    </div>
    {children}
  </div>
);