import React, { useState, useRef } from 'react';
import { 
  Pencil, Trash2, Wallet, Star, Plus, History, 
  CheckCircle, AlertTriangle, Settings, ArrowUpCircle, X, Save, Camera
} from 'lucide-react';

import Sidebar from '../components/Sidebar';
import EmergencyButton from '../components/EmergencyButton'; 
import ModalDeletarConta from '../components/ModalDeletarConta';
import { CampoPerfil } from '../components/CampoPerfil';

const TIPO_USUARIO = 'paciente'; 
const PROFISSIONAL_TEM_VINCULO = true;

interface PerfilPaciente {
  nome: string;
  tipoConta: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  cpf: string;
  endereco: string;
  senha: string;
  foto: string | null; // <-- Aqui está a permissão para virar string
}

const dadosIniciais: PerfilPaciente = {
  nome: 'Luana Silva',
  tipoConta: 'Conta de Cliente',
  email: 'luana@email.com',
  telefone: '(81) 98765-4321',
  dataNascimento: '1995-04-15',
  cpf: '155.558.344-77',
  endereco: 'Boa Viagem, Recife - PE',
  senha: 'senhaPaciente123',
  foto: null,
};

export default function VisualizarPerfilPaciente() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [dados, setDados] = useState(dadosIniciais);
  
  const ehProprioPaciente = TIPO_USUARIO === 'paciente';

  // --- Máscara ---
  const maskCPF = (v: string = "") => 
    v.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4").substring(0, 14);

  const maskPhone = (v: string = "") => {
    const r = v.replace(/\D/g, "");
    if (r.length > 10) return r.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3").substring(0, 15);
    return r.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, "($1) $2-$3").substring(0, 14);
  };

  const handleSalvar = () => {
    setIsEditing(false);
  };

  const handleCancelar = () => {
    setDados(dadosIniciais);
    setIsEditing(false);
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setDados({ ...dados, foto: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#F8FAFC]">
      <Sidebar role={TIPO_USUARIO} itemAtivo="perfil" />

      <section className="flex flex-col flex-1 overflow-hidden text-left">
        <header className="flex items-center justify-between px-8 py-6 bg-white border-b border-slate-100">
          <div>
            <h1 className="text-3xl font-bold text-[#1E293B]">
                {isEditing ? "Editar Perfil" : "Meu Perfil"}
            </h1>
            <p className="text-slate-500">
                {isEditing ? "Altere os campos necessários abaixo." : "Gerencie suas informações pessoais e plano."}
            </p>
          </div>
          <EmergencyButton onClick={() => { /* Lógica de emergência futura */ }} />
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="flex gap-8 items-start">
            
            <article className="flex-1 bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-8">
                
                {/* Header do Perfil (Avatar e Nome) */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-6">
                    <div 
                      onClick={() => isEditing && fileInputRef.current?.click()}
                      className={`w-32 h-32 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white shrink-0 relative overflow-hidden transition-all ${isEditing ? 'cursor-pointer hover:opacity-90' : ''} bg-teal-600`}
                    >
                      {dados.foto ? (
                        <img src={dados.foto} alt="Perfil" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-4xl font-bold">{dados.nome[0]}</span>
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
                      <h2 className="text-2xl font-bold text-slate-800">{dados.nome}</h2>
                      <p className="text-teal-600 font-medium">{dados.tipoConta}</p>
                    </div>
                  </div>

                  {ehProprioPaciente && !isEditing && (
                    <div className="flex flex-col items-center gap-2 mt-4 text-center w-[240px]">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest w-full">
                        Não gostou das recomendações?
                      </span>
                      <button className="w-full text-xs bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-bold shadow-md transition-all active:scale-95">
                        Refazer questionário de match
                      </button>
                    </div>
                  )}
                </div>
                <div className="border-t border-slate-50 pt-8">
                   {ehProprioPaciente ? (
                      <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                        <CampoPerfil label="Nome Completo" valor={dados.nome} isEditing={isEditing} onChange={(val) => setDados({...dados, nome: val})} />
                        <CampoPerfil label="E-mail" valor={dados.email} isEditing={isEditing} onChange={(val) => setDados({...dados, email: val})} />
                        <CampoPerfil label="Telefone" valor={dados.telefone} isEditing={isEditing} onChange={(val) => setDados({...dados, telefone: maskPhone(val)})} />
                        <CampoPerfil label="Data de Nascimento" valor={dados.dataNascimento} isEditing={isEditing} type="date" onChange={(val) => setDados({...dados, dataNascimento: val})} />
                        <CampoPerfil label="CPF" valor={dados.cpf} isEditing={isEditing} onChange={(val) => setDados({...dados, cpf: maskCPF(val)})} />
                        <CampoPerfil label="Endereço" valor={dados.endereco} isEditing={isEditing} onChange={(val) => setDados({...dados, endereco: val})} />
                        <CampoPerfil label="Senha" valor={dados.senha} isEditing={isEditing} type="password" onChange={(val) => setDados({...dados, senha: val})} />
                      </div>
                   ) : (
                      <div className="space-y-6 text-left">
                        {PROFISSIONAL_TEM_VINCULO ? (
                          <>
                            <div className="bg-amber-50 border border-amber-100 text-amber-800 p-4 rounded-xl text-sm flex items-center gap-3">
                              <AlertTriangle size={18} />
                              Você vê apenas dados autorizados devido ao vínculo ativo.
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                              <CampoPerfil label="Nome Completo" valor={dados.nome} isEditing={false} />
                              <CampoPerfil label="Telefone de Contato" valor={dados.telefone} isEditing={false} />
                              <CampoPerfil label="Data de Nascimento" valor={dados.dataNascimento} isEditing={false} type="date" />
                              <CampoPerfil label="Endereço" valor={dados.endereco} isEditing={false} />
                            </div>
                          </>
                        ) : (
                          <div className="py-12 text-center flex flex-col items-center gap-4">
                            <div className="p-4 bg-slate-50 rounded-full text-slate-300">
                              <Settings size={40} />
                            </div>
                            <p className="text-slate-400 font-medium">Você não tem permissão para ver dados deste paciente.</p>
                          </div>
                        )}
                      </div>
                   )}
                </div>

                {/* OUTRAS ACOES */}
                {ehProprioPaciente && (
                  <div className="flex gap-4 mt-10 border-t border-slate-50 pt-6">
                    {isEditing ? (
                        <>
                            <button onClick={handleCancelar} className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 font-bold text-sm rounded-full hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                                <X size={16} /> Cancelar
                            </button>
                            <button onClick={handleSalvar} className="flex-1 py-3 bg-teal-600 text-white font-bold text-sm rounded-full hover:bg-teal-700 transition-all shadow-md flex items-center justify-center gap-2">
                                <Save size={16} /> Salvar Alterações
                            </button>
                        </>
                    ) : (
                        <>
                            <button 
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="flex-1 py-3 bg-red-600 text-white font-bold text-sm rounded-full hover:bg-red-700 transition-all shadow-sm flex items-center justify-center gap-2"
                            >
                                <Trash2 size={16} /> Deletar Conta
                            </button>
                            <button onClick={() => setIsEditing(true)} className="flex-1 py-3 bg-transparent border border-slate-200 text-slate-600 font-bold text-sm rounded-full hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                                <Pencil size={16} /> Editar Informações
                            </button>
                        </>
                    )}
                  </div>
                )}
              </div>
            </article>

            {/* COLUNA LATERAL (CARTEIRA E PLANOS) */}
            {ehProprioPaciente && (
              <aside className={`w-[400px] flex flex-col gap-6 transition-opacity ${isEditing ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
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
                  <div className="bg-gradient-to-br from-teal-500 to-emerald-400 rounded-3xl p-6 text-white mb-4 text-left">
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
                      <ArrowUpCircle size={16} /> Fazer Upgrade de Plano
                    </button>
                    <button className="w-full py-3 bg-white border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                      <Settings size={16} /> Gerenciar Assinatura
                    </button>
                  </div>
                </SideCard>
              </aside>
            )}
          </div>
        </div>
      </section>

      <ModalDeletarConta 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        tipoUsuario="paciente"
        temConsultasAbertas={false}
      />
    </main>
  );
}

// --- Componentes Auxiliares Locais ---

const SideCard = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm text-left">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      <div className="p-2 bg-slate-50 rounded-xl">{icon}</div>
    </div>
    {children}
  </div>
);