import { useState } from 'react';
import HeroSection from '../components/HeroSection.js';
import { ChevronLeft, EyeOff, Eye, CloudUpload, FileCheck } from 'lucide-react';

function CadastroProfissional() {
    const [etapa, setEtapa] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [documentFile, setDocumentFile] = useState<File | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        birthDate: '',
        email: '',
        cpf: '',
        phone: '',
        cep: '',
        state: '',
        city: '',
        neighborhood: '',
        street: '',
        number: '',
        gender: '',
        crp: '',
        password: '',
        confirmPassword: '',
        role: 'PROFESSIONAL'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (etapa < 3) {
            setEtapa(etapa + 1);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert("As senhas não coincidem!");
            return;
        }

        if (!documentFile) {
            alert("Por favor, anexe o seu documento de validação.");
            return;
        }

        setLoading(true);

        const { crp, confirmPassword: _confirmPassword, ...userData } = formData;

        const payload = {
            ...userData,
            cpf: userData.cpf.replace(/[^\d]+/g, ''),
            street: "Não informado",
            number: "SN",
            professionalProfile: {
                crp: crp, 
                specialty: "Geral",
                availableForEmergency: false,
                gapBetweenAppointmentsMinutes: 15
            }
        };

        try {
            // 1. Registro (com payload limpo)
            const regRes = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!regRes.ok) {
                const err = await regRes.json();
                throw new Error(err.message || "Erro ao criar conta.");
            }

            // 2. Login (usa o email e password do formData original)
            const logRes = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, password: formData.password })
            });

            if (!logRes.ok) throw new Error("Erro na autenticação automática.");
            const { accessToken } = await logRes.json();

            // 3. Upload do Documento
            const docData = new FormData();
            docData.append('document', documentFile);

            const valRes = await fetch('/api/professionals/me/validation-request', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${accessToken}` },
                body: docData
            });

            if (!valRes.ok) throw new Error("Documento não enviado. Tente via painel.");

            alert("Cadastro concluído com sucesso!");
            window.location.href = '/login';

        } catch (error: any) {
            const message = error instanceof Error ? error.message : "Erro desconhecido";
            alert(message);
        } finally {
            setLoading(false);
        }
    };


    const handleVoltar = () => {
        if (etapa > 1) {
            setEtapa(etapa - 1);
        } else {
            window.location.href = "/cadastro";
        }
    };

    return (
        <main className="login-page flex h-screen w-full overflow-hidden bg-snow">
            <HeroSection subtitle="Profissional" currentStep={etapa} totalSteps={3} />

            <section className="form-section flex flex-col w-full lg:w-[73%] items-center justify-center p-6 md:p-12 relative overflow-y-auto">
                <button
                    onClick={handleVoltar}
                    className="absolute top-4 left-4 md:top-8 md:left-12 flex items-center gap-2 text-rich-black hover:text-rich-black/80 transition-colors group cursor-pointer"
                >
                    <ChevronLeft
                        size={48}
                        className="group-hover:-translate-x-1 transition-transform duration-300"
                    />
                    <span className="text-lg font-medium">Voltar</span>
                </button>

                <div className="w-full max-w-[816px] flex flex-col justify-center py-10">
                    <header className="form-header text-center w-full mb-[4vh] shrink-0">
                        <h1 className="text-navy font-bold text-[clamp(1.75rem,4vh,2.5rem)] leading-tight">
                            {etapa === 1 && "Seus dados profissionais"}
                            {etapa === 2 && "Endereço de atendimento"}
                            {etapa === 3 && "Segurança e Registro"}
                        </h1>
                    </header>

                    <form onSubmit={handleSubmit} className="flex flex-col w-full gap-[3vh]" noValidate>

                        {/* ETAPA 1: Dados Pessoais (Idêntico ao Paciente) */}
                        {etapa === 1 && (
                            <div className="flex flex-col gap-[2.5vh] animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-1 flex flex-col items-start">
                                        <label className="text-navy font-semibold mb-1">Nome completo</label>
                                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="bg-input-bg rounded-xl w-full px-4 py-3 border border-transparent focus:border-navy outline-none" placeholder="Seu nome" required />
                                    </div>
                                    <div className="flex-1 flex flex-col items-start">
                                        <label className="text-navy font-semibold mb-1">Data de nascimento</label>
                                        <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className="bg-input-bg rounded-xl w-full px-4 py-3 border border-transparent focus:border-navy outline-none" required />
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-1 flex flex-col items-start">
                                        <label className="text-navy font-semibold mb-1">E-mail</label>
                                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="bg-input-bg rounded-xl w-full px-4 py-3 border border-transparent focus:border-navy outline-none" placeholder="email@exemplo.com" required />
                                    </div>
                                    <div className="flex-1 flex flex-col items-start">
                                        <label className="text-navy font-semibold mb-1">Gênero</label>
                                        <select name="gender" value={formData.gender} onChange={handleChange} className="bg-input-bg rounded-xl w-full px-4 py-3 border border-transparent focus:border-navy outline-none appearance-none" required>
                                            <option value="">Selecione</option>
                                            <option value="Feminino">Feminino</option>
                                            <option value="Masculino">Masculino</option>
                                            <option value="Outro">Outro</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-1 flex flex-col items-start">
                                        <label className="text-navy font-semibold mb-1">CPF</label>
                                        <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} className="bg-input-bg rounded-xl w-full px-4 py-3 border border-transparent focus:border-navy outline-none" placeholder="000.000.000-00" required />
                                    </div>
                                    <div className="flex-1 flex flex-col items-start">
                                        <label className="text-navy font-semibold mb-1">Telefone</label>
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="bg-input-bg rounded-xl w-full px-4 py-3 border border-transparent focus:border-navy outline-none" placeholder="(00) 00000-0000" required />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ETAPA 2: Endereço (Completo e Idêntico ao Paciente) */}
                        {etapa === 2 && (
                            <div className="flex flex-col gap-[2.5vh] animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-1 flex flex-col items-start">
                                        <label className="text-navy font-semibold mb-1">CEP</label>
                                        <input type="text" name="cep" value={formData.cep} onChange={handleChange} className="bg-input-bg rounded-xl w-full px-4 py-3 border border-transparent focus:border-navy outline-none" placeholder="00000-000" required />
                                    </div>
                                    <div className="w-full md:w-1/3 flex flex-col items-start">
                                        <label className="text-navy font-semibold mb-1">Estado (UF)</label>
                                        <input type="text" name="state" value={formData.state} onChange={handleChange} className="bg-input-bg rounded-xl w-full px-4 py-3 border border-transparent focus:border-navy outline-none" placeholder="Ex: PI" required />
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-1 flex flex-col items-start">
                                        <label className="text-navy font-semibold mb-1">Cidade</label>
                                        <input type="text" name="city" value={formData.city} onChange={handleChange} className="bg-input-bg rounded-xl w-full px-4 py-3 border border-transparent focus:border-navy outline-none" required />
                                    </div>
                                    <div className="flex-1 flex flex-col items-start">
                                        <label className="text-navy font-semibold mb-1">Bairro</label>
                                        <input type="text" name="neighborhood" value={formData.neighborhood} onChange={handleChange} className="bg-input-bg rounded-xl w-full px-4 py-3 border border-transparent focus:border-navy outline-none" required />
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-[2] flex flex-col items-start">
                                        <label className="text-navy font-semibold mb-1">Rua/Logradouro</label>
                                        <input type="text" name="street" value={formData.street} onChange={handleChange} className="bg-input-bg rounded-xl w-full px-4 py-3 border border-transparent focus:border-navy outline-none" required />
                                    </div>
                                    <div className="flex-1 flex flex-col items-start">
                                        <label className="text-navy font-semibold mb-1">Número</label>
                                        <input type="text" name="number" value={formData.number} onChange={handleChange} className="bg-input-bg rounded-xl w-full px-4 py-3 border border-transparent focus:border-navy outline-none" required />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ETAPA 3: Específico Profissional */}
                        {etapa === 3 && (
                            <div className="flex flex-col gap-[2.5vh] animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="flex flex-col items-start w-full">
                                    <label className="text-navy font-semibold mb-1">Número do CRP/CRM</label>
                                    <input type="text" name="crp" value={formData.crp} onChange={handleChange} className="bg-input-bg rounded-xl w-full px-4 py-3 border border-transparent focus:border-navy outline-none" placeholder="Digite seu registro" required />
                                </div>

                                <div className="flex flex-col items-start w-full">
                                    <label className="text-navy font-semibold mb-2">Comprovante de Habilitação</label>
                                    <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${documentFile ? 'border-green-500 bg-green-50' : 'border-navy/20 hover:border-navy/40 bg-input-bg'}`}>
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                                            {documentFile ? (
                                                <><FileCheck className="text-green-500 mb-2" size={32} /> <p className="text-sm text-green-600 font-medium truncate max-w-xs">{documentFile.name}</p></>
                                            ) : (
                                                <><CloudUpload className="text-navy/40 mb-2" size={32} /> <p className="text-sm text-navy/60">Clique para enviar seu documento (PDF ou Imagem)</p></>
                                            )}
                                        </div>
                                        <input type="file" className="hidden" accept=".pdf,image/*" onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) setDocumentFile(file);
                                        }} />
                                    </label>
                                </div>

                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-1 flex flex-col items-start">
                                        <label className="text-navy font-semibold mb-1">Senha</label>
                                        <div className="relative w-full">
                                            <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} className="bg-input-bg rounded-xl w-full px-4 py-3 border border-transparent focus:border-navy outline-none" required />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3 text-navy/50">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                                        </div>
                                    </div>
                                    <div className="flex-1 flex flex-col items-start">
                                        <label className="text-navy font-semibold mb-1">Confirmar Senha</label>
                                        <div className="relative w-full">
                                            <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="bg-input-bg rounded-xl w-full px-4 py-3 border border-transparent focus:border-navy outline-none" required />
                                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-3 text-navy/50">{showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <footer className="form-actions flex flex-col items-center gap-[2vh] pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary rounded-full bg-sky w-full md:w-[60%] h-[64px] text-snow font-bold text-lg hover:brightness-110 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <><div className="w-5 h-5 border-2 border-snow border-t-transparent rounded-full animate-spin" /> Processando...</>
                                ) : (etapa === 3 ? "Concluir Cadastro" : "Próximo Passo")}
                            </button>
                        </footer>
                    </form>
                </div>
            </section>
        </main>
    );
}

export default CadastroProfissional;