import React from 'react';
import { Search, Bell, Eye, Check, X, FileText, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.tsx';

function ValidacaoCadastro() {
    const navigate = useNavigate();

    const solicitacoes = [
        { id: 1, nome: "Luana Silva", crp: "06/123456", tempo: "2 dias", ativo: true },
        { id: 2, nome: "Carlos Almeida", crp: "04/654321", tempo: "3 dias", ativo: false },
        { id: 3, nome: "Aisha Rahman", crp: "05/987654", tempo: "5 dias", ativo: false },
    ];

    return (
        <main className="flex h-screen w-full overflow-hidden bg-[#F8FAFC]">
            <Sidebar role="administrador" navigate={navigate} itemAtivo="validacoes" />

            <section className="flex flex-col flex-1 overflow-hidden">
                <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100">
                    <div>
                        <h1 className="text-2xl font-bold text-[#1E293B]">Validação de Cadastros</h1>
                        <p className="text-sm text-slate-500">Analise as informações e documentos dos novos profissionais.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar solicitações..."
                                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                            />
                        </div>
                        <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </header>

                <div className="flex flex-1 overflow-hidden p-6 gap-6">
                    <aside className="w-80 flex flex-col gap-4 overflow-y-auto">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="font-bold text-slate-700">Pendentes de Análise</h2>
                            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">3</span>
                        </div>

                        {solicitacoes.map((s) => (
                            <div
                                key={s.id}
                                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${s.ativo ? 'bg-white border-sky shadow-md' : 'bg-white border-transparent opacity-70 hover:opacity-100'
                                    }`}
                            >
                                <div className="flex gap-3 items-center mb-3">
                                    <div className="w-12 h-12 rounded-lg bg-slate-200 overflow-hidden">
                                        <img src={`https://i.pravatar.cc/150?u=${s.id}`} alt="Avatar" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-sm">{s.nome}</h3>
                                        <p className="text-xs text-slate-500">CRP {s.crp}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center border-t pt-3 border-slate-50">
                                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Enviado há {s.tempo}</span>
                                    <span className="text-[10px] bg-orange-100 text-orange-600 font-bold px-2 py-1 rounded-md">EM ANÁLISE</span>
                                </div>
                            </div>
                        ))}
                    </aside>

                    <article className="flex-1 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col overflow-hidden">
                        {/* Banner do Perfil */}
                        <div className="p-8 border-b border-slate-50 flex justify-between items-start">
                            <div className="flex gap-6 items-center">
                                <div className="w-20 h-24 rounded-xl bg-slate-200 overflow-hidden shadow-inner">
                                    <img src="https://i.pravatar.cc/150?u=1" alt="Luana" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-slate-800">Luana Silva</h2>
                                    <p className="text-sky font-medium">Candidata a Psicóloga Clínica</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-slate-700">Solicitação #1042</p>
                                <p className="text-xs text-slate-400">12 de Nov, 2023 - 14:30</p>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8">
                            <section className="mb-10">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Dados Cadastrais</h3>
                                <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                                    <DataField label="Nome Completo" value="Luana de Fátima Silva" />
                                    <DataField label="E-mail Pessoal" value="luana.silva@email.com" />
                                    <DataField label="CRP (Registro Profissional)" value="06/123456" />
                                    <DataField label="Telefone / WhatsApp" value="(11) 98765-4321" />
                                    <DataField label="Especialidades Principais" value="Ansiedade, Terapia de Casal, TCC" />
                                    <DataField label="Abordagem Clínica" value="Terapia Cognitivo-Comportamental" />
                                </div>
                            </section>

                            <section>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Documentos Anexados para Verificação</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <DocCard title="Comprovante_CRP.jpg" size="1.1 MB" type="Verificação Obrigatória" icon={<FileText className="text-blue-500" />} />
                                    <DocCard title="Diploma_Mestrado.pdf" size="2.4 MB" type="Opcional" icon={<FileText className="text-red-500" />} />
                                    <DocCard title="Doc_Identidade.pdf" size="1.8 MB" type="Verificação Obrigatória" icon={<FileText className="text-red-500" />} />
                                </div>
                            </section>
                        </div>

                        <footer className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-between gap-4">
                            <button className="flex-1 max-w-xs py-3 border-2 border-red-500 text-red-500 font-bold rounded-full hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
                                <X size={18} /> Rejeitar Cadastro
                            </button>
                            <div className="flex gap-4 flex-1 justify-end">
                                <button className="px-8 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-full hover:bg-slate-100 transition-colors">
                                    Solicitar Ajustes
                                </button>
                                <button className="px-8 py-3 bg-[#34D399] text-white font-bold rounded-full hover:bg-emerald-500 transition-shadow shadow-lg shadow-emerald-200 flex items-center gap-2">
                                    <Check size={18} /> Aprovar Profissional
                                </button>
                            </div>
                        </footer>
                    </article>
                </div>
            </section>
        </main>
    );
}


const DataField = ({ label, value }: { label: string, value: string }) => (
    <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">{label}</label>
        <p className="text-slate-700 font-medium">{value}</p>
    </div>
);

const DocCard = ({ title, size, type, icon }: { title: string, size: string, type: string, icon: React.ReactNode }) => (
    <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-sky/30 transition-colors group">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">{icon}</div>
            <div>
                <h4 className="text-sm font-bold text-slate-700">{title}</h4>
                <p className="text-[10px] text-slate-400 font-medium">{size} • {type}</p>
            </div>
        </div>
        <button className="p-2 text-slate-400 hover:text-sky transition-colors">
            <Eye size={18} />
        </button>
    </div>
);

export default ValidacaoCadastro;