import React, { useState, useRef } from 'react';
import { 
  Pencil, Trash2, Star, X, Save, 
  Camera, FileText, Plus, Trash
} from 'lucide-react';

import Sidebar from '../components/Sidebar';
import ModalDeletarConta from '../components/ModalDeletarConta';
import { CampoPerfil } from '../components/CampoPerfil';

// --- Interfaces ---
interface Documento {
  id: number;
  nome: string;
  tamanho: string;
}

interface DadosProfissional {
  nome: string;
  tipoConta: string;
  especialidade: string;
  descricao: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  cpf: string;
  registroProfissional: string;
  genero: string;
  endereco: string;
  senha: string;
  foto: string | null;
  score: number;
  totalAvaliacoes: number;
  documentos: Documento[];
}

export default function VisualizarPerfilProfissional() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [dados, setDados] = useState<DadosProfissional>({
    nome: 'João Silva',
    tipoConta: 'Conta de Profissional',
    especialidade: 'Psicólogo Clínico',
    descricao: 'Psicólogo clínico com mais de 5 anos de experiência em terapia cognitivo-comportamental.',
    email: 'joao@email.com',
    telefone: '(11) 98765-4321',
    dataNascimento: '1998-04-15',
    cpf: '155.558.344-55',
    registroProfissional: 'CRP 07/000000',
    genero: 'homem_cis',
    endereco: 'Boa Viagem, Recife - PE',
    senha: 'minhasenha123',
    foto: null,
    score: 3.6,
    totalAvaliacoes: 25,
    documentos: [{ id: 1, nome: 'Doc_Identidade.pdf', tamanho: '1.6 MB' }]
  });

  // --- Máscaras ---
  const maskCPF = (v: string = "") => 
    v.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4").substring(0, 14);

  const maskPhone = (v: string = "") => {
    const r = v.replace(/\D/g, ""); 
    if (r.length > 10) return r.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3").substring(0, 15);
    return r.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, "($1) $2-$3").substring(0, 14);
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setDados({ ...dados, foto: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleAddDocumento = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const novoDoc: Documento = {
        id: Date.now(),
        nome: file.name,
        tamanho: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      };
      setDados({ ...dados, documentos: [...dados.documentos, novoDoc] });
    }
  };

  const removerDocumento = (id: number) => {
    setDados({ ...dados, documentos: dados.documentos.filter(d => d.id !== id) });
  };

  const opcoesGenero = [
    { label: 'Mulher cis', value: 'mulher_cis' },
    { label: 'Mulher trans', value: 'mulher_trans' },
    { label: 'Homem cis', value: 'homem_cis' },
    { label: 'Homem trans', value: 'homem_trans' },
    { label: 'Outro', value: 'outro' },
    { label: 'Prefiro não informar', value: 'prefiro_nao_informar' },
  ];

  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#F8FAFC]">
      <Sidebar role="profissional" itemAtivo="perfil" />

      <section className="flex flex-col flex-1 overflow-hidden text-left">
        <header className="flex items-center justify-between px-8 py-6 bg-white border-b border-slate-100">
          <div>
            <h1 className="text-3xl font-bold text-[#1E293B]">
              {isEditing ? "Editar Perfil" : "Meu Perfil"}
            </h1>
            <p className="text-slate-500 text-sm">
              Gerencie suas informações profissionais e plano.
            </p>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="flex gap-8 items-start">
            
            <article className="flex-1 bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-8">
                
                {/* Header Perfil */}
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
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map(i => (
                          <Star key={i} size={14} fill={i <= Math.floor(dados.score) ? "#FACC15" : "none"} color={i <= Math.floor(dados.score) ? "#FACC15" : "#CBD5E1"} />
                        ))}
                        <span className="text-xs text-slate-400 font-medium ml-1">{dados.score} ({dados.totalAvaliacoes} avaliações)</span>
                      </div>
                    </div>
                  </div>

                  {!isEditing && (
                    <div className="flex flex-col items-center gap-2 text-center w-[240px]">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest w-full">
                        Pacientes fora da sua especialidade?
                      </span>
                      <button className="w-full text-xs bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-bold shadow-md transition-all active:scale-95">
                        Refazer questionário de match
                      </button>
                    </div>
                  )}
                </div>
                <div className="border-t border-slate-50 pt-8">
                  <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                    <div className="col-span-2">
                        <CampoPerfil 
                          label="Descrição Profissional" 
                          valor={dados.descricao} 
                          isEditing={isEditing} 
                          type="textarea" 
                          onChange={(v) => setDados({...dados, descricao: v})} 
                        />
                    </div>
                    
                    <CampoPerfil label="Nome Completo" valor={dados.nome} isEditing={isEditing} onChange={(v) => setDados({...dados, nome: v})} />
                    <CampoPerfil label="E-mail" valor={dados.email} isEditing={isEditing} onChange={(v) => setDados({...dados, email: v})} />
                    <CampoPerfil label="Telefone" valor={dados.telefone} isEditing={isEditing} onChange={(v) => setDados({...dados, telefone: maskPhone(v)})} />
                    <CampoPerfil label="Data de Nascimento" valor={dados.dataNascimento} isEditing={isEditing} type="date" onChange={(v) => setDados({...dados, dataNascimento: v})} />
                    <CampoPerfil label="CPF" valor={dados.cpf} isEditing={isEditing} onChange={(v) => setDados({...dados, cpf: maskCPF(v)})} />
                    <CampoPerfil label="Registro Profissional" valor={dados.registroProfissional} isEditing={isEditing} onChange={(v) => setDados({...dados, registroProfissional: v})} />
                    <CampoPerfil label="Gênero" valor={dados.genero} isEditing={isEditing} type="select" options={opcoesGenero} onChange={(v) => setDados({...dados, genero: v})} />
                    <CampoPerfil label="Endereço" valor={dados.endereco} isEditing={isEditing} onChange={(v) => setDados({...dados, endereco: v})} />
                    <CampoPerfil label="Senha" valor={dados.senha} isEditing={isEditing} type="password" onChange={(v) => setDados({...dados, senha: v})} />

                    {/* Documentos */}
                    <div className="col-span-2 space-y-3 pt-4 text-left">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Documentos Anexados</label>
                        {isEditing && (
                          <>
                            <button onClick={() => docInputRef.current?.click()} className="text-[10px] text-teal-600 font-bold flex items-center gap-1 hover:text-teal-700 transition-colors">
                              <Plus size={14} /> ADICIONAR NOVO
                            </button>
                            <input type="file" ref={docInputRef} hidden onChange={handleAddDocumento} accept=".pdf,.doc,.docx" />
                          </>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {dados.documentos.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                            <div className="flex items-center gap-3 text-left">
                              <div className="p-2 bg-white rounded-lg shadow-sm text-slate-400"><FileText size={18} /></div>
                              <div>
                                <p className="text-xs font-bold text-slate-700">{doc.nome}</p>
                                <p className="text-[10px] text-slate-400 font-medium">{doc.tamanho}</p>
                              </div>
                            </div>
                            {isEditing && (
                              <button onClick={() => removerDocumento(doc.id)} className="p-2 text-red-400 hover:text-red-600 transition-colors"><Trash size={16} /></button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex gap-4 mt-10 border-t border-slate-50 pt-8">
                  {isEditing ? (
                    <>
                      <button onClick={() => setIsEditing(false)} className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 font-bold text-sm rounded-full hover:bg-slate-50 transition-all flex items-center justify-center gap-2"><X size={16} /> Cancelar</button>
                      <button onClick={() => setIsEditing(false)} className="flex-1 py-3 bg-teal-600 text-white font-bold text-sm rounded-full hover:bg-teal-700 transition-all shadow-md flex items-center justify-center gap-2"><Save size={16} /> Salvar Alterações</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setIsDeleteModalOpen(true)} className="flex-1 py-3 bg-red-600 text-white font-bold text-sm rounded-full hover:bg-red-700 transition-all flex items-center justify-center gap-2"><Trash2 size={16} /> Deletar Conta</button>
                      <button onClick={() => setIsEditing(true)} className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold text-sm rounded-full hover:bg-slate-50 transition-all flex items-center justify-center gap-2"><Pencil size={16} /> Editar Informações</button>
                    </>
                  )}
                </div>
              </div>
            </article>

            {/* Impulsionamento */}
            <aside className={`w-[400px] flex flex-col gap-6 transition-opacity ${isEditing ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              <SideCard title="Plano de impulsionamento" icon={<Star className="text-emerald-500" />}>
                <p className="text-sm text-slate-500 mb-4 leading-relaxed">Aumente sua visibilidade e seja destaque nos resultados de busca.</p>
                <div className="bg-gradient-to-br from-teal-500 to-emerald-400 rounded-3xl p-6 text-white mb-4 text-left">
                  <p className="text-xl font-bold mb-1">Plano Impulso profissional</p>
                  <p className="text-3xl font-black">R$ 29<span className="text-sm font-normal">/mês</span></p>
                  <button className="w-full mt-4 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg">Ativar impulsionamento</button>
                </div>
                <button className="w-full py-3 bg-white border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors">Gerenciar Assinatura</button>
              </SideCard>
            </aside>
          </div>
        </div>
      </section>

      <ModalDeletarConta 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        tipoUsuario="profissional"
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