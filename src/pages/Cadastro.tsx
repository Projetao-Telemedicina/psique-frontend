import HeroSection from '../components/HeroSection.js';
import { ChevronLeft, User, Briefcase } from 'lucide-react';

function Cadastro() {
    return (
        <main className="login-page flex h-screen w-full overflow-hidden bg-snow">
            <HeroSection />

            <section className="form-section flex flex-col w-full lg:w-[73%] items-center justify-center p-6 md:p-12 relative">
                <a
                    href="/login"
                    className="absolute top-4 left-4 md:top-8 md:left-12 flex items-center gap-2 text-rich-black hover:text-rich-black/80 transition-colors group"
                >
                    <ChevronLeft size={48} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-lg font-medium">Voltar</span>
                </a>

                <div className="w-full max-w-[816px] h-full max-h-[900px] flex flex-col justify-center relative">
                    <header className="form-header text-center w-full mb-[6vh] shrink-0">
                        <h1 className="text-navy font-bold text-[clamp(2rem,5vh,3rem)] leading-tight">
                            Cadastre-se na plataforma
                        </h1>
                        <p className="text-rich-black text-[clamp(1rem,2vh,1.25rem)] mt-2">
                            Escolha o tipo de conta que melhor atende às suas necessidades.
                        </p>
                    </header>

                    <div className="flex flex-col md:flex-row gap-6 w-full mb-8">

                        <a
                            href="/cadastro/profissional"
                            className="flex-1 group relative flex flex-col items-center justify-center p-8 aspect-square md:aspect-auto md:h-64 bg-sky rounded-[2rem] shadow-xl hover:scale-[1.02] hover:brightness-105 transition-all duration-300 no-underline"
                        >
                            <Briefcase size={40} className="text-white mb-4 opacity-80" />
                            <h2 className="text-white font-bold text-2xl md:text-3xl text-center leading-tight">
                                Conta de<br />Profissional
                            </h2>
                        </a>

                        <a
                            href="/cadastro/cliente"
                            className="flex-1 group relative flex flex-col items-center justify-center p-8 aspect-square md:aspect-auto md:h-64 bg-sky rounded-[2rem] shadow-xl hover:scale-[1.02] hover:brightness-110 transition-all duration-300 no-underline"
                        >
                            <User size={40} className="text-white mb-4 opacity-80" />
                            <h2 className="text-white font-bold text-2xl md:text-3xl text-center leading-tight">
                                Conta de<br />Cliente
                            </h2>
                        </a>

                    </div>

                    <footer className="form-actions flex flex-col items-center shrink-0">
                        <p className="signup-text text-rich-black text-[clamp(0.875rem,1.8vh,1rem)]">
                            Já possui uma conta?{' '}
                            <a href="/login" className="text-navy font-bold hover:underline">
                                Faça o login
                            </a>
                        </p>
                    </footer>
                </div>
            </section>
        </main>
    );
}

export default Cadastro;