import { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection.js';
import { ChevronLeft } from 'lucide-react';

function RecuperarSenha() {
    const [etapa, setEtapa] = useState(1);

    const [segundos, setSegundos] = useState(600);

    const [email, setEmail] = useState('');

    const handleAvancar = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (etapa < 3) setEtapa(etapa + 1);
    };


    const handleVoltar = (e: React.MouseEvent<HTMLAnchorElement>) => {
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

    const formatarTempo = (totalSegundos: number): string => {
        const minutos = Math.floor(totalSegundos / 60);
        const segs = totalSegundos % 60;
        return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
    };

    const handleReenviar = () => {
        setSegundos(600);
    };

    return (
        <main className="login-page flex h-screen w-full overflow-hidden bg-snow">

            <HeroSection
                subtitle="Recuperar senha"
                currentStep={etapa}
                totalSteps={3}
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
                            {etapa === 1 && "Recuperação de senha"}
                            {etapa === 2 && "Recuperação de senha"}
                            {etapa === 3 && "Recuperação de senha"}
                        </h1>
                    </header>

                    <form onSubmit={handleAvancar} className="flex flex-col w-full gap-[3vh] min-h-0 relative">


                        <div className="form-group flex flex-col w-full items-start shrink relative">

                            {etapa === 1 && (
                                <>
                                    <label htmlFor="email" className="text-navy font-semibold text-[clamp(1rem,2.5vh,1.5rem)] mb-1">
                                        Informe o seu e-mail
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="bg-input-bg rounded-xl w-full px-4 py-[min(1.5vh,1rem)] text-placeholder border border-transparent focus:border-navy outline-none transition-all"
                                        placeholder="Digite o e-mail cadastrado na plataforma"
                                        required
                                    />
                                </>
                            )}

                            {etapa === 2 && (
                                <>
                                    <label className="text-navy font-semibold text-[clamp(1rem,2.5vh,1.5rem)] mb-2">
                                        Verificar código
                                    </label>

                                    <div className="flex flex-col gap-1 mb-4">
                                        <p className="text-slate-400 text-[clamp(0.75rem,1.5vh,0.875rem)] leading-relaxed text-left">
                                            Digite o código enviado para o seu e-mail: <span className="text-navy font-bold">{email || 'seu-email@exemplo.com'}</span>
                                        </p>
                                        <p className="text-slate-400 text-[clamp(0.75rem,1.5vh,0.875rem)] leading-relaxed">
                                            Verifique a caixa de spam e lixo eletrônico do seu e-mail antes de solicitar o reenvio do código.
                                        </p>
                                    </div>

                                    <input
                                        type="text"
                                        className="mb-3 bg-input-bg rounded-xl w-full px-4 py-[min(1.5vh,1rem)] text-placeholder border border-transparent focus:border-navy outline-none transition-all font-mono tracking-widest text-center text-xl"
                                        placeholder="000000"
                                        maxLength={6}
                                        required
                                    />

                                    <div className="flex flex-col lg:items-start gap-2 mt-2">
                                        <p className="text-rich-black text-[clamp(0.875rem,1.8vh,1rem)]">
                                            Reenvio do código em: <span className="text-navy font-bold">{formatarTempo(segundos)} min</span>
                                        </p>

                                        <p className={`text-[clamp(0.875rem,1.8vh,1rem)] transition-opacity ${segundos > 0 ? 'opacity-50' : 'opacity-100'}`}>
                                            Não recebeu o código?{' '}
                                            <button
                                                type="button"
                                                onClick={handleReenviar}
                                                disabled={segundos > 0}
                                                className={`font-bold ${segundos > 0 ? 'text-slate-400 cursor-not-allowed' : 'text-navy hover:underline cursor-pointer'}`}
                                            >
                                                Reenvie o código
                                            </button>
                                        </p>
                                    </div>
                                </>
                            )}

                            {etapa === 3 && (
                                <>
                                    <label className="text-navy font-semibold text-[clamp(1rem,2.5vh,1.5rem)] mb-1">
                                        Nova senha
                                    </label>
                                    <input
                                        type="password"
                                        className="bg-input-bg rounded-xl w-full px-4 py-[min(1.5vh,1rem)] text-placeholder border border-transparent focus:border-navy outline-none transition-all"
                                        placeholder="••••••••"
                                        required
                                    />
                                </>
                            )}
                        </div>

                        <footer className="form-actions flex flex-col items-center gap-[2vh] pt-4 shrink-0 relative">
                            <button
                                type="submit"
                                className="btn-primary rounded-full bg-sky w-full md:w-[60%] h-[min(8vh,64px)] min-h-[48px] text-snow font-bold text-[clamp(1rem,2.2vh,1.25rem)] hover:brightness-110 transition-all shadow-lg active:scale-95"
                            >
                                {etapa === 3 ? "Concluir" : "Avançar"}
                            </button>

                            <p className="signup-text text-rich-black text-[clamp(0.875rem,1.8vh,1rem)]">
                                Lembrou a senha?{' '}
                                <a href="/login" className="text-navy font-bold hover:underline">
                                    Faça o login
                                </a>
                            </p>
                        </footer>
                    </form>
                </div>
            </section>
        </main>
    );
}

export default RecuperarSenha;