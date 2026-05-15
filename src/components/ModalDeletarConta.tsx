import { useState } from 'react';
import { AlertTriangle, Lock, CheckCircle, X, Loader2 } from 'lucide-react';

interface ModalDeletarContaProps {
  isOpen: boolean;
  onClose: () => void;
  tipoUsuario: 'paciente' | 'profissional';
  temConsultasAbertas: boolean; 
}

type Passo = 'aviso' | 'senha' | 'sucesso';

export default function ModalDeletarConta({ 
  isOpen, 
  onClose, 
  tipoUsuario, 
  temConsultasAbertas 
}: ModalDeletarContaProps) {
  const [passo, setPasso] = useState<Passo>('aviso');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  if (!isOpen) return null;

  const handleConfirmarAviso = () => {
    if (temConsultasAbertas) {
      setErro('Não é possível excluir a conta com consultas em aberto. Cancele suas consultas futuras primeiro.');
      return;
    }
    setPasso('senha');
    setErro('');
  };

  const handleEnviarSenha = async () => {
    if (!senha) {
      setErro('Por favor, digite sua senha.');
      return;
    }

    setCarregando(true);
    
    setTimeout(() => {
      if (senha !== '123456') { 
        setErro('Senha incorreta. Tente novamente.');
        setCarregando(false);
      } else {
        setCarregando(false);
        setPasso('sucesso');
      }
    }, 1500);
  };

  const resetAndClose = () => {
    setPasso('aviso');
    setSenha('');
    setErro('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200">
        
        {/* Botão Fechar (X) - Escondido no sucesso para forçar o redirecionamento */}
        {passo !== 'sucesso' && (
          <button 
            onClick={resetAndClose}
            className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        )}

        <div className="p-8 text-center">
          
          {/* PASSO 1: AVISO */}
          {passo === 'aviso' && (
            <div className="space-y-6">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle size={40} className="text-red-500" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Excluir sua conta?</h2>
                <p className="text-slate-500 mt-2 text-sm">
                  Esta ação é <strong>permanente</strong>. Todos os seus dados como {tipoUsuario} serão removidos do Psique.
                </p>
              </div>

              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-left space-y-2">
                <p className="text-[11px] font-bold text-red-700 uppercase tracking-wider">Consequências:</p>
                <ul className="text-xs text-red-600 space-y-1">
                  <li className="flex gap-2">• Perfil removido das buscas</li>
                  <li className="flex gap-2">• Histórico de mensagens anonimizado</li>
                  <li className="flex gap-2">• Perda total de acesso ao aplicativo</li>
                </ul>
              </div>

              {erro && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-xs font-medium">
                  {erro}
                </div>
              )}

              <div className="flex flex-col gap-3 pt-2">
                <button 
                  onClick={handleConfirmarAviso}
                  className="w-full py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-200"
                >
                  Entendo, desejo excluir
                </button>
                <button 
                  onClick={resetAndClose}
                  className="w-full py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                >
                  Manter minha conta
                </button>
              </div>
            </div>
          )}

          {/* PASSO 2: SENHA */}
          {passo === 'senha' && (
            <div className="space-y-6">
              <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto">
                <Lock size={40} className="text-teal-600" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-800">Confirme sua senha</h2>
                <p className="text-slate-500 mt-2 text-sm">
                  Para sua segurança, confirme sua identidade para prosseguir.
                </p>
              </div>

              <div className="text-left space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Sua Senha Atual</label>
                <input 
                  type="password"
                  value={senha}
                  onChange={(e) => {setSenha(e.target.value); setErro('');}}
                  placeholder="••••••••"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-teal-500 transition-all"
                />
                {erro && <p className="text-xs text-red-500 font-medium ml-1">{erro}</p>}
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <button 
                  disabled={carregando}
                  onClick={handleEnviarSenha}
                  className="w-full py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  {carregando ? <Loader2 className="animate-spin" size={20} /> : "Finalizar Exclusão"}
                </button>
                <button 
                  disabled={carregando}
                  onClick={() => setPasso('aviso')}
                  className="w-full py-4 bg-transparent text-slate-400 font-bold rounded-2xl hover:text-slate-600 transition-all"
                >
                  Voltar
                </button>
              </div>
            </div>
          )}

          {/* PASSO 3: SUCESSO */}
          {passo === 'sucesso' && (
            <div className="space-y-6 py-4">
              <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={48} className="text-emerald-500" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-800">Conta Excluída</h2>
                <p className="text-slate-500 mt-2 text-sm px-4">
                  Sentiremos sua falta! Seus dados foram removidos e você será deslogado agora.
                </p>
              </div>

              <button 
                onClick={() => window.location.href = '/login'}
                className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all"
              >
                Sair do Aplicativo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}