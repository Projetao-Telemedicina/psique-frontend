import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Eye, Check, X, FileText, Loader2, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Sidebar from '../components/Sidebar.tsx';

interface ValidationRequest {
    id: string;
    createdAt: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    professional: {
        crp: string;
        user: {
            name: string;
            email: string;
            status: string;
        };
    };
}

function ValidacaoCadastro() {
    const navigate = useNavigate();
    const [solicitacoes, setSolicitacoes] = useState<ValidationRequest[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null); 
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    
    const selectedRequest = solicitacoes.find(r => r.id === selectedId) || solicitacoes[0] || null;

    const loadRequests = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/professionals/validation-requests', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data: ValidationRequest[] = await response.json();
                const pendentes = data.filter(req => req.status === 'PENDING');

                setSolicitacoes(pendentes);
            } else if (response.status === 401 || response.status === 403) {
                toast.error("Sessão expirada. Faça login novamente.");
                navigate('/login');
            }
        } catch (error) {
            console.error("Erro ao carregar validações", error);
            toast.error("Erro ao carregar solicitações pendentes.");
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        Promise.resolve().then(loadRequests);
    }, [loadRequests]);

    const handleApprove = async (id: string) => {
        if (!confirm("Deseja aprovar este profissional?")) return;
        
        try {
            setActionLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/admin/professionals/validation-requests/${id}/approve`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });

            if (response.ok) {
                toast.success("Profissional aprovado com sucesso!");
                setSolicitacoes(prev => prev.filter(req => req.id !== id));
                setSelectedId(null); 
            } else {
                const error = await response.json();
                toast.error(`Erro ao aprovar: ${error.message || 'Erro desconhecido'}`);
            }
        } catch (error) {
            console.error("Erro ao aprovar:", error);
            toast.error("Erro de conexão com o servidor.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async (id: string) => {
        const reason = prompt("Motivo da rejeição:");
        if (!reason) return;

        try {
            setActionLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/admin/professionals/validation-requests/${id}/reject`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ rejectionReason: reason })
            });

            if (response.ok) {
                toast.success("Cadastro rejeitado.");
                setSolicitacoes(prev => prev.filter(req => req.id !== id));
                setSelectedId(null);
            } else {
                toast.error("Erro ao processar rejeição.");
            }
        } catch (error) {
            console.error("Erro ao rejeitar:", error);
            toast.error("Erro de conexão ao rejeitar.");
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <main className="flex h-screen w-full overflow-hidden bg-[#F8FAFC]">
            <Sidebar role="administrador" itemAtivo="validacoes" />

            <section className="flex flex-col flex-1 overflow-hidden">
                <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100">
                    <div>
                        <h1 className="text-2xl font-bold text-[#1E293B]">Validação de Cadastros</h1>
                        <p className="text-sm text-slate-500">Analise os documentos dos novos profissionais.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input type="text" placeholder="Buscar..." className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm w-64" />
                        </div>
                        <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </header>

                <div className="flex flex-1 overflow-hidden p-6 gap-6">
                    <aside className="w-80 flex flex-col h-full">
                        <div className="flex items-center justify-between px-2 mb-4 shrink-0">
                            <h2 className="font-bold text-slate-700">Pendentes de Análise</h2>
                            <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {solicitacoes.length}
                            </span>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3 custom-scrollbar">
                            {loading ? (
                                <div className="flex justify-center p-10"><Loader2 className="animate-spin text-teal-600" /></div>
                            ) : (
                                solicitacoes.map((s) => {
                                    const isSelected = selectedRequest?.id === s.id;
                                    return (
                                        <div
                                            key={s.id}
                                            onClick={() => setSelectedId(s.id)}
                                            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${isSelected ? 'bg-white border-teal-600 shadow-md' : 'bg-white border-transparent opacity-70 hover:opacity-100'
                                                }`}
                                        >
                                            <div className="flex gap-3 items-center mb-3">
                                                <div className="w-12 h-12 rounded-lg bg-slate-200 flex items-center justify-center text-slate-400">
                                                    <User size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-800 text-sm">{s.professional.user.name}</h3>
                                                    <p className="text-xs text-slate-500">CRP {s.professional.crp}</p>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center border-t pt-3 border-slate-50">
                                                <span className="text-[10px] text-slate-400 font-medium uppercase">Pendente</span>
                                                <span className="text-[10px] bg-orange-100 text-orange-600 font-bold px-2 py-1 rounded-md">EM ANÁLISE</span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </aside>

                    <article className="flex-1 bg-white rounded-[2rem] shadow-sm border border-slate-100 flex flex-col overflow-hidden">
                        {selectedRequest ? (
                            <>
                                <div className="p-6 border-b border-slate-50 flex justify-between items-start">
                                    <div className="flex gap-5 items-center">
                                        <div className="w-16 h-20 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400 shadow-inner">
                                            <User size={32} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-800 leading-tight">{selectedRequest.professional.user.name}</h2>
                                            <p className="text-teal-600 font-medium text-sm">Candidato a Psicólogo Clínico</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-slate-700 text-sm">Solicitação #{selectedRequest.id.slice(0, 5)}</p>
                                        <p className="text-[10px] text-slate-400 font-medium">Enviado em: {new Date(selectedRequest.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-6">
                                    <section className="mb-8">
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Dados Cadastrais</h3>
                                        <div className="grid grid-cols-2 gap-y-5 gap-x-8">
                                            <DataField label="Nome Completo" value={selectedRequest.professional.user.name} />
                                            <DataField label="E-mail Pessoal" value={selectedRequest.professional.user.email} />
                                            <DataField label="CRP (Registro Profissional)" value={selectedRequest.professional.crp} />
                                            <DataField label="Status da Conta" value={selectedRequest.professional.user.status} />
                                        </div>
                                    </section>

                                    <section>
                                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Documentos Anexados</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            <DocCard title="Comprovante_CRP.jpg" size="1.1 MB" type="Obrigatório" icon={<FileText className="text-blue-500" />} />
                                            <DocCard title="Doc_Identidade.pdf" size="1.8 MB" type="Obrigatório" icon={<FileText className="text-red-500" />} />
                                        </div>
                                    </section>
                                </div>

                                <footer className="p-4 bg-slate-50/50 border-t border-slate-100 flex justify-between gap-4 items-center">
                                    <button
                                        onClick={() => handleReject(selectedRequest.id)}
                                        disabled={actionLoading}
                                        className="flex-1 max-w-[180px] py-2 border-2 border-red-500 text-red-500 font-bold text-xs rounded-full hover:bg-red-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        <X size={14} /> Rejeitar Cadastro
                                    </button>

                                    <div className="flex gap-2 flex-1 justify-end">
                                        <button className="px-5 py-2 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-full hover:bg-slate-100 transition-colors">
                                            Solicitar Ajustes
                                        </button>
                                        <button
                                            onClick={() => handleApprove(selectedRequest.id)}
                                            disabled={actionLoading}
                                            className="px-5 py-2 bg-[#34D399] text-white font-bold text-xs rounded-full hover:bg-emerald-500 shadow-sm flex items-center gap-2 disabled:opacity-50"
                                        >
                                            {actionLoading ? <Loader2 className="animate-spin" size={14} /> : <Check size={14} />}
                                            Aprovar Profissional
                                        </button>
                                    </div>
                                </footer>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2">
                                <User size={48} className="opacity-20" />
                                <p>Selecione um profissional para validar</p>
                            </div>
                        )}
                    </article>
                </div>
            </section>
        </main>
    );
}

const DataField = ({ label, value }: { label: string, value: string }) => (
    <div className="flex flex-col gap-0.5">
        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-tight">{label}</label>
        <p className="text-slate-700 font-semibold text-sm leading-snug">{value}</p>
    </div>
);

const DocCard = ({ title, size, type, icon }: { title: string, size: string, type: string, icon: React.ReactNode }) => (
    <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-teal-600/30 transition-colors group">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">{icon}</div>
            <div>
                <h4 className="text-sm font-bold text-slate-700">{title}</h4>
                <p className="text-[10px] text-slate-400 font-medium">{size} • {type}</p>
            </div>
        </div>
        <button className="p-2 text-slate-400 hover:text-teal-600 transition-colors">
            <Eye size={18} />
        </button>
    </div>
);

export default ValidacaoCadastro;