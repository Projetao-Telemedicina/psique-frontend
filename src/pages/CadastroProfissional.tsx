import { useState } from 'react';
import HeroSection from '../components/HeroSection.js';
import { ChevronLeft, EyeOff, Eye, CloudUpload } from 'lucide-react';

function CadastroProfissional() {
    const [etapa, setEtapa] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleAvancar = (e) => {
        e.preventDefault();
        if (etapa < 3) setEtapa(etapa + 1);
        else {
            console.log("Formulário enviado com sucesso!");
        }
    };

    const handleVoltar = (e) => {
        if (etapa > 1) {
            e.preventDefault();
            setEtapa(etapa - 1);
        }
    };

    return (
        <main className="login-page flex h-screen w-full overflow-hidden bg-snow">
            <HeroSection
                subtitle="Cadastro"
                currentStep={etapa}
                totalSteps={3}
            />

            <section className="form-section flex flex-col w-full lg:w-[73%] items-center justify-center p-6 md:p-12 relative overflow-y-auto">
                <button
                    onClick={handleVoltar}
                    disabled={etapa === 1 && false}
                    className="absolute top-4 left-4 md:top-8 md:left-12 flex items-center gap-2 text-rich-black hover:text-navy transition-colors group"
                >
                    <a href={etapa === 1 ? "/cadastro" : undefined} className="flex items-center gap-2">
                        <ChevronLeft
                            size={32}
                            className="group-hover:-translate-x-1 transition-transform"
                        />
                        <span className="text-lg font-medium">Voltar</span>
                    </a>
                </button>

                <div className="w-full max-w-[816px] flex flex-col justify-center">
                    <header className="form-header text-center w-full mb-[4vh] shrink-0">
                        <h1 className="text-navy font-bold text-[clamp(1.75rem,4vh,2.5rem)] leading-tight">
                            Cadastre-se na plataforma
                        </h1>
                    </header>

                    <form onSubmit={handleAvancar} className="flex flex-col w-full gap-[3vh]">
                        
                        {etapa === 1 && (
                            <div className="flex flex-col gap-[3vh] animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-1 flex flex-col items-start">
                                        <label className="text-navy font-semibold text-[clamp(1rem,2.2vh,1.25rem)] mb-1">Nome completo</label>
                                        <input
                                            type="text"
                                            className="bg-input-bg rounded-xl w-full px-4 py-[min(1.5vh,1rem)] text-rich-black border border-transparent focus:border-navy outline-none transition-all"
                                            placeholder="Digite seu nome completo"
                                            required
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col items-start">
                                        <label className="text-navy font-semibold text-[clamp(1rem,2.2vh,1.25rem)] mb-1">Data de nascimento</label>
                                        <input
                                            type="date"
                                            className="bg-input-bg rounded-xl w-full px-4 py-[min(1.5vh,1rem)] text-rich-black border border-transparent focus:border-navy outline-none transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col items-start">
                                    <label className="text-navy font-semibold text-[clamp(1rem,2.2vh,1.25rem)] mb-1">E-mail</label>
                                    <input
                                        type="email"
                                        className="bg-input-bg rounded-xl w-full px-4 py-[min(1.5vh,1rem)] text-rich-black border border-transparent focus:border-navy outline-none transition-all"
                                        placeholder="Digite seu email"
                                        required
                                    />
                                    <p className="text-slate-500 text-xs mt-1">Informe um email que você utiliza, pois ele será sua forma de login na plataforma</p>
                                </div>

                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-1 flex flex-col items-start">
                                        <label className="text-navy font-semibold text-[clamp(1rem,2.2vh,1.25rem)] mb-1">CPF</label>
                                        <input
                                            type="text"
                                            className="bg-input-bg rounded-xl w-full px-4 py-[min(1.5vh,1rem)] text-rich-black border border-transparent focus:border-navy outline-none transition-all"
                                            placeholder="000.000.000-00"
                                            required
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col items-start">
                                        <label className="text-navy font-semibold text-[clamp(1rem,2.2vh,1.25rem)] mb-1">Telefone</label>
                                        <input
                                            type="tel"
                                            className="bg-input-bg rounded-xl w-full px-4 py-[min(1.5vh,1rem)] text-rich-black border border-transparent focus:border-navy outline-none transition-all"
                                            placeholder="(00) 00000-0000"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {etapa === 2 && (
                            <div className="flex flex-col gap-[3vh] animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-1 flex flex-col items-start">
                                        <label className="text-navy font-semibold text-[clamp(1rem,2.2vh,1.25rem)] mb-1">CEP</label>
                                        <input
                                            type="text"
                                            className="bg-input-bg rounded-xl w-full px-4 py-[min(1.5vh,1rem)] text-rich-black border border-transparent focus:border-navy outline-none transition-all"
                                            placeholder="00000-000"
                                            required
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col items-start">
                                        <label className="text-navy font-semibold text-[clamp(1rem,2.2vh,1.25rem)] mb-1">Estado</label>
                                        <input
                                            type="text"
                                            className="bg-input-bg rounded-xl w-full px-4 py-[min(1.5vh,1rem)] text-rich-black border border-transparent focus:border-navy outline-none transition-all"
                                            placeholder="Informe seu estado"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-1 flex flex-col items-start">
                                        <label className="text-navy font-semibold text-[clamp(1rem,2.2vh,1.25rem)] mb-1">Cidade</label>
                                        <input
                                            type="text"
                                            className="bg-input-bg rounded-xl w-full px-4 py-[min(1.5vh,1rem)] text-rich-black border border-transparent focus:border-navy outline-none transition-all"
                                            placeholder="Informe sua cidade"
                                            required
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col items-start">
                                        <label className="text-navy font-semibold text-[clamp(1rem,2.2vh,1.25rem)] mb-1">Bairro</label>
                                        <input
                                            type="text"
                                            className="bg-input-bg rounded-xl w-full px-4 py-[min(1.5vh,1rem)] text-rich-black border border-transparent focus:border-navy outline-none transition-all"
                                            placeholder="Informe seu bairro"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col items-start w-full">
                                    <label className="text-navy font-semibold text-[clamp(1rem,2.2vh,1.25rem)] mb-1">Gênero</label>
                                    <div className="relative w-full">
                                        <select
                                            className="bg-input-bg rounded-xl w-full px-4 py-[min(1.5vh,1rem)] text-rich-black border border-transparent focus:border-navy outline-none transition-all appearance-none cursor-pointer"
                                            defaultValue=""
                                            required
                                        >
                                            <option value="" disabled hidden>Selecione o gênero</option>
                                            <option value="mulher_cis">Mulher cis</option>
                                            <option value="mulher_trans">Mulher trans</option>
                                            <option value="homem_cis">Homem cis</option>
                                            <option value="homem_trans">Homem trans</option>
                                            <option value="outro">Outro</option>
                                            <option value="prefiro_nao_informar">Prefiro não informar</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-navy">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {etapa === 3 && (
                            <div className="flex flex-col gap-[3vh] animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="flex flex-col items-start w-full">
                                    <label className="text-navy font-semibold text-[clamp(1rem,2.2vh,1.25rem)] mb-1">Número do registro profissional</label>
                                    <input
                                        type="text"
                                        className="bg-input-bg rounded-xl w-full px-4 py-[min(1.5vh,1rem)] text-rich-black border border-transparent focus:border-navy outline-none transition-all"
                                        placeholder="Digite o número do registro profissional"
                                        required
                                    />
                                </div>

                                <div className="flex flex-col items-start w-full">
                                    <label className="text-navy font-semibold text-[clamp(1rem,2.2vh,1.25rem)] mb-1">Upload de documentos</label>
                                    <label className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center bg-white hover:bg-slate-50 transition-all cursor-pointer group">
                                        <div className="w-12 h-12 bg-sky/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <CloudUpload size={24} className="text-sky" />
                                        </div>
                                        <p className="text-rich-black font-medium text-center">Clique para fazer upload ou arraste o arquivo</p>
                                        <p className="text-slate-400 text-sm mt-1">PDF, JPG ou PNG (máx. 5MB)</p>
                                        <input type="file" className="hidden" accept=".pdf,.jpg,.png" />
                                    </label>
                                </div>

                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-1 flex flex-col items-start">
                                        <label className="text-navy font-semibold text-[clamp(1rem,2.2vh,1.25rem)] mb-1">Crie sua senha</label>
                                        <div className="relative w-full">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className="bg-input-bg rounded-xl w-full px-4 py-[min(1.5vh,1rem)] border border-transparent focus:border-navy outline-none transition-all"
                                                placeholder="Digite uma senha"
                                                required
                                            />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-navy/50 hover:text-navy">
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex-1 flex flex-col items-start">
                                        <label className="text-navy font-semibold text-[clamp(1rem,2.2vh,1.25rem)] mb-1">Confirme a senha</label>
                                        <div className="relative w-full">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                className="bg-input-bg rounded-xl w-full px-4 py-[min(1.5vh,1rem)] border border-transparent focus:border-navy outline-none transition-all"
                                                placeholder="Confirme a senha"
                                                required
                                            />
                                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-navy/50 hover:text-navy">
                                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <footer className="form-actions flex flex-col items-center gap-[2vh] pt-4 shrink-0 mt-4">
                            <button
                                type="submit"
                                className="btn-primary rounded-full bg-sky w-full md:w-[60%] h-[min(8vh,64px)] min-h-[48px] text-snow font-bold text-[clamp(1rem,2.2vh,1.25rem)] hover:brightness-110 transition-all shadow-lg active:scale-95"
                            >
                                {etapa === 3 ? "Concluir" : "Avançar"}
                            </button>

                            {etapa === 3 ? (
                                <p className="text-slate-500 text-xs text-center max-w-[80%] leading-relaxed">
                                    *Ao clicar em concluir, você está concordando com nossas{' '}
                                    <a href="/politicas" className="text-navy font-bold hover:underline">políticas de privacidade de dados</a>
                                </p>
                            ) : (
                                <p className="signup-text text-rich-black text-sm">
                                    Já possui uma conta?{' '}
                                    <a href="/login" className="text-navy font-bold hover:underline">Faça o login</a>
                                </p>
                            )}
                        </footer>
                    </form>
                </div>
            </section>
        </main>
    );
}

export default CadastroProfissional;