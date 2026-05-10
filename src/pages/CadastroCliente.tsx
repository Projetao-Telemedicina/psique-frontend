import { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection.js';
import { ChevronLeft, EyeOff, Eye } from 'lucide-react';

function CadastroCliente() {
    const [etapa, setEtapa] = useState(1);

    const [segundos, setSegundos] = useState(600);

    const [showPassword, setShowPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleAvancar = (e) => {
        e.preventDefault();
        if (etapa < 3) setEtapa(etapa + 1);
    };


    const handleVoltar = (e) => {
        if (etapa > 1) {
            e.preventDefault();
            setEtapa(etapa - 1);
        }
    };

    useEffect(() => {
        if (etapa === 2 && segundos > 0) {
            const timer = setInterval(() => {
                setSegundos((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [etapa, segundos]);


    return (
        <main className="login-page flex h-screen w-full overflow-hidden bg-snow">

            <HeroSection
                subtitle="Cadastro"
                currentStep={etapa}
                totalSteps={2}
            />

            <section className="form-section flex flex-col w-full lg:w-[73%] items-center justify-center p-6 md:p-12 relative">
                <a
                    href={etapa === 1 ? "/login" : "#"}
                    onClick={handleVoltar}
                    className="absolute top-4 left-4 md:top-8 md:left-12 flex items-center gap-2 text-rich-black hover:text-rich-black/80 transition-colors group"
                >
                    <ChevronLeft
                        size={48}
                        className="group-hover:-translate-x-1 transition-transform"
                    />
                    <span className="text-lg font-medium">Voltar</span>
                </a>

                <div className="w-full max-w-[816px] h-full max-h-[900px] flex flex-col justify-center relative">
                    <header className="form-header text-center w-full mb-[4vh] shrink-0 relative">
                        <h1 className="text-navy font-bold text-[clamp(2rem,5vh,3rem)] leading-tight">
                            {etapa === 1 && "Cadastre-se na plataforma"}
                            {etapa === 2 && "Cadastre-se na plataforma"}
                        </h1>
                    </header>

                    <form onSubmit={handleAvancar} className="flex flex-col w-full gap-[3vh] min-h-0 relative">


                        <div className="form-group flex flex-col w-full items-center shrink relative">

                            {etapa === 1 && (
                                <div className="flex flex-col gap-[3vh]">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-1 flex flex-col items-start">
                                            <label className="text-navy font-semibold text-[clamp(1rem,2.5vh,1.5rem)] mb-1">
                                                Nome completo
                                            </label>
                                            <input
                                                type="text"
                                                className="bg-input-bg rounded-xl w-full px-4 py-[min(1.5vh,1rem)] text-placeholder border border-transparent focus:border-navy outline-none transition-all"
                                                placeholder="Digite seu nome completo"
                                                required
                                            />
                                        </div>

                                        <div className="flex-1 flex flex-col items-start">
                                            <label className="text-navy font-semibold text-[clamp(1rem,2.5vh,1.5rem)] mb-1">
                                                Data de nascimento
                                            </label>
                                            <div className="relative w-full">
                                                <input
                                                    type="date"
                                                    className="bg-input-bg rounded-xl w-full px-4 py-[min(1.5vh,1rem)] text-placeholder border border-transparent focus:border-navy outline-none transition-all appearance-none"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-start">
                                        <label className="text-navy font-semibold text-[clamp(1rem,2.5vh,1.5rem)] mb-1">
                                            E-mail
                                        </label>
                                        <input
                                            type="email"
                                            className="bg-input-bg rounded-xl w-full px-4 py-[min(1.5vh,1rem)] text-placeholder border border-transparent focus:border-navy outline-none transition-all"
                                            placeholder="Digite seu email"
                                            required
                                        />
                                        <p className="text-slate-500 text-xs mt-1">
                                            Informe um email que você utiliza, pois ele será sua forma de login na plataforma
                                        </p>
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-1 flex flex-col items-start">
                                            <label className="text-navy font-semibold text-[clamp(1rem,2.5vh,1.5rem)] mb-1">
                                                CPF
                                            </label>
                                            <input
                                                type="text"
                                                className="bg-input-bg rounded-xl w-full px-4 py-[min(1.5vh,1rem)] text-placeholder border border-transparent focus:border-navy outline-none transition-all"
                                                placeholder="000.000.000-00"
                                                required
                                            />
                                        </div>

                                        <div className="flex-1 flex flex-col items-start">
                                            <label className="text-navy font-semibold text-[clamp(1rem,2.5vh,1.5rem)] mb-1">
                                                Telefone
                                            </label>
                                            <input
                                                type="tel"
                                                className="bg-input-bg rounded-xl w-full px-4 py-[min(1.5vh,1rem)] text-placeholder border border-transparent focus:border-navy outline-none transition-all"
                                                placeholder="(00) 00000-0000"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {etapa === 2 && (
                                <div className="flex flex-col gap-[3vh]">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-1 flex flex-col items-start">
                                            <label className="text-navy font-semibold text-[clamp(1rem,2.5vh,1.5rem)] mb-1">
                                                CEP
                                            </label>
                                            <input
                                                type="text"
                                                className="bg-input-bg rounded-xl w-full px-4 py-[min(1.5vh,1rem)] text-placeholder border border-transparent focus:border-navy outline-none transition-all"
                                                placeholder="00000-000"
                                                required
                                            />
                                        </div>

                                        <div className="flex-1 flex flex-col items-start">
                                            <label className="text-navy font-semibold text-[clamp(1rem,2.5vh,1.5rem)] mb-1">
                                                Estado
                                            </label>
                                            <input
                                                type="text"
                                                className="bg-input-bg rounded-xl w-full px-4 py-[min(1.5vh,1rem)] text-placeholder border border-transparent focus:border-navy outline-none transition-all"
                                                placeholder="Informe seu estado"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-1 flex flex-col items-start">
                                            <label className="text-navy font-semibold text-[clamp(1rem,2.5vh,1.5rem)] mb-1">
                                                Cidade
                                            </label>
                                            <input
                                                type="text"
                                                className="bg-input-bg rounded-xl w-full px-4 py-[min(1.5vh,1rem)] text-placeholder border border-transparent focus:border-navy outline-none transition-all"
                                                placeholder="Informe sua cidade"
                                                required
                                            />
                                        </div>

                                        <div className="flex-1 flex flex-col items-start">
                                            <label className="text-navy font-semibold text-[clamp(1rem,2.5vh,1.5rem)] mb-1">
                                                Bairro
                                            </label>
                                            <input
                                                type="text"
                                                className="bg-input-bg rounded-xl w-full px-4 py-[min(1.5vh,1rem)] text-placeholder border border-transparent focus:border-navy outline-none transition-all"
                                                placeholder="Informe seu bairro"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-1 flex flex-col items-start">
                                            <label className="text-navy font-semibold text-[clamp(1rem,2.5vh,1.5rem)] mb-1">
                                                Crie sua senha
                                            </label>
                                            <div className="relative w-full">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    className="bg-input-bg rounded-xl w-full px-4 py-[min(1.5vh,1rem)] text-placeholder border border-transparent focus:border-navy outline-none transition-all"
                                                    placeholder="Digite uma senha"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-navy/50 hover:text-navy"
                                                >
                                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex-1 flex flex-col items-start">
                                            <label className="text-navy font-semibold text-[clamp(1rem,2.5vh,1.5rem)] mb-1">
                                                Confirme a senha
                                            </label>
                                            <div className="relative w-full">
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    className="bg-input-bg rounded-xl w-full px-4 py-[min(1.5vh,1rem)] text-placeholder border border-transparent focus:border-navy outline-none transition-all"
                                                    placeholder="Confirme a senha"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-navy/50 hover:text-navy"
                                                >
                                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>

                        <footer className="form-actions flex flex-col items-center gap-[2vh] pt-4 shrink-0 relative">
                            <button
                                type="submit"
                                className="btn-primary rounded-full bg-sky w-full md:w-[60%] h-[min(8vh,64px)] min-h-[48px] text-snow font-bold text-[clamp(1rem,2.2vh,1.25rem)] hover:brightness-110 transition-all shadow-lg active:scale-95"
                            >
                                {etapa === 2 ? "Concluir" : "Avançar"}
                            </button>

                            {etapa === 2 ? (
                                <p className="text-slate-500 text-[clamp(0.75rem,1.6vh,0.875rem)] text-center max-w-[80%] leading-relaxed">
                                    *Ao clicar em concluir, você está concordando com nossas{' '}
                                    <a href="/politicas" className="text-navy font-bold hover:underline">
                                        políticas de privacidade de dados
                                    </a>
                                </p>
                            ) : (
                                <p className="signup-text text-rich-black text-[clamp(0.875rem,1.8vh,1rem)]">
                                    Já possui uma conta?{' '}
                                    <a href="/login" className="text-navy font-bold hover:underline">
                                        Faça o login
                                    </a>
                                </p>
                            )}
                        </footer>
                    </form>
                </div>
            </section>
        </main>
    );
}

export default CadastroCliente;