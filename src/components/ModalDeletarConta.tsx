import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { AlertTriangle, Lock, CheckCircle, X, Loader2 } from 'lucide-react';

interface ModalDeletarContaProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>; 
  tipoUsuario: 'paciente' | 'profissional';
  temConsultasAbertas: boolean; 
}

type Passo = 'aviso' | 'senha' | 'sucesso';

export default function ModalDeletarConta({ 
  isOpen, 
  onClose, 
  onConfirm, 
  tipoUsuario, 
  temConsultasAbertas 
}: ModalDeletarContaProps) {
  const navigate = useNavigate(); // Inicializado aqui
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
      setErro('Por favor, digite sua senha para confirmar.');
      return;
    }

    setCarregando(true);
    setErro('');

    try {
      // Executa a função de delete enviada pelo componente pai (VisualizarPerfil)
      await onConfirm(); 
      
      setCarregando(false);
      setPasso('sucesso');
    } catch (err) {
      console.error("Erro ao deletar conta:", err);
      setCarregando(false);
      setErro('Ocorreu um erro ao excluir sua conta. Verifique sua senha ou conexão.');
    }
  };

  const resetAndClose = () => {
    setPasso('aviso');
    setSenha('');
    setErro('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200 text-left">
        
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
                <p className="text-slate-500 mt-2 text-sm text-center leading-relaxed">
                  Esta ação é <strong>permanente</strong>. Todos os seus dados como {tipoUsuario} serão removidos do Psique.
                </p>
              </div>

              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-center">
                <p className="text-[11px] font-bold text-red-700 uppercase tracking-wider mb-2">Consequências imediatas:</p>
                <ul className="text-xs text-red-600 space-y-1 inline-block text-left">
                  <li>• Perfil removido instantaneamente</li>
                  <li>• Histórico de mensagens anonimizado</li>
                  <li>• Perda total de acesso à plataforma</li>
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

          {/* PASSO 2: CONFIRMAÇÃO DE SENHA */}
          {passo === 'senha' && (
            <div className="space-y-6">
              <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto">
                <Lock size={40} className="text-teal-600" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-800">Confirme sua senha</h2>
                <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                  Para sua segurança, precisamos confirmar que é você mesmo solicitando a exclusão.
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
                  className="w-full py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {carregando ? <Loader2 className="animate-spin" size={20} /> : "Finalizar Exclusão"}
                </button>
                <button 
                  disabled={carregando}
                  onClick={() => setPasso('aviso')}
                  className="w-full py-4 bg-transparent text-slate-400 font-bold rounded-2xl hover:text-slate-600 transition-all disabled:opacity-50"
                >
                  Voltar
                </button>
              </div>
            </div>
          )}

          {/* PASSO 3: SUCESSO E REDIRECIONAMENTO */}
          {passo === 'sucesso' && (
            <div className="space-y-6 py-4">
              <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={48} className="text-emerald-500" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-800 text-center">Conta Excluída</h2>
                <p className="text-slate-500 mt-2 text-sm px-4 text-center leading-relaxed">
                  Sua conta foi removida com sucesso. Esperamos ver você novamente no futuro!
                </p>
              </div>

              <button 
                onClick={() => navigate('/login')} 
                className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-lg"
              >
                Voltar para o Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}