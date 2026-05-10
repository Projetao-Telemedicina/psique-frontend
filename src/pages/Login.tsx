import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'; 

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="login-page flex h-screen w-full overflow-hidden bg-snow">
      
      <section className="hero-section hidden lg:flex flex-col lg:w-[27%] items-center justify-center bg-logo-gradient p-4 shrink-0">
        <div className="logo-container w-full flex justify-center max-h-[40%]">
          <img src="/psique-logo-white.svg" alt="Logo Psique" className="w-[78%] max-w-[280px] object-contain" />
        </div>
      </section>
      
      <section className="form-section flex flex-col w-full lg:w-[73%] items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-[816px] h-full max-h-[900px] flex flex-col justify-center relative">
          
          <header className="form-header text-center w-full mb-[4vh] shrink-0 relative">
            <h1 className="text-navy font-bold text-[clamp(2rem,5vh,3rem)] leading-tight">Entre na Plataforma</h1>
            <p className="text-rich-black text-[clamp(1rem,2vh,1.25rem)] mt-2">Bem-vindo de volta!</p>
          </header>

          <form className="flex flex-col w-full gap-[3vh] min-h-0 relative">
            
            <div className="form-group flex flex-col w-full items-start shrink relative">
              <label htmlFor="email" className="text-navy font-semibold text-[clamp(1rem,2.5vh,1.5rem)] mb-1">E-mail</label>
              <div className="relative w-full">
                <Mail 
                  size={20} 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/50" 
                  aria-hidden="true"
                />
                <input 
                  type="email" 
                  id="email" 
                  className="bg-input-bg rounded-xl w-full pl-12 pr-4 py-[min(1.5vh,1rem)] text-placeholder border border-transparent focus:border-navy outline-none transition-all" 
                  placeholder="Digite seu e-mail" 
                  required 
                />
              </div>
            </div>
            
            <div className="form-group flex flex-col w-full items-start shrink relative">
              <label htmlFor="password" className="text-navy font-semibold text-[clamp(1rem,2.5vh,1.5rem)] mb-1">Senha</label>
              <div className="relative w-full">
                <Lock 
                  size={20} 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/50" 
                  aria-hidden="true"
                />
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password" 
                  className="bg-input-bg rounded-xl w-full pl-12 pr-12 py-[min(1.5vh,1rem)] text-placeholder border border-transparent focus:border-navy outline-none transition-all" 
                  placeholder="Digite sua senha" 
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-navy/50 hover:text-navy transition-colors"
                  aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <div className="form-options flex flex-wrap justify-between items-center gap-2 text-[clamp(0.875rem,1.8vh,1rem)] relative">
              <label className="checkbox-container flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="h-[2.5vh] w-[2.5vh] min-h-[18px] min-w-[18px] appearance-none bg-snow border-2 border-navy rounded-md cursor-pointer checked:bg-navy relative after:content-[''] after:absolute after:hidden checked:after:block after:left-[30%] after:top-[10%] after:w-[35%] after:h-[60%] after:border-r-2 after:border-b-2 after:border-white after:rotate-45"
                />
                <span className="text-rich-black select-none">Mantenha-me conectado</span>
              </label>
              <a href="/reset-password" className="text-navy hover:underline font-medium">Esqueci minha senha</a>
            </div>

            <footer className="form-actions flex flex-col items-center gap-[2vh] pt-4 shrink-0 relative">
              <button 
                type="submit" 
                className="btn-primary rounded-full bg-sky w-full md:w-[60%] h-[min(8vh,64px)] min-h-[48px] text-snow font-bold text-[clamp(1rem,2.2vh,1.25rem)] hover:brightness-110 transition-all shadow-lg active:scale-95"
              >
                Entrar
              </button>
              <p className="signup-text text-rich-black text-[clamp(0.875rem,1.8vh,1rem)]">
                Não possui conta? <a href="/register" className="text-navy font-bold hover:underline">Cadastre-se</a>
              </p>
            </footer>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Login;