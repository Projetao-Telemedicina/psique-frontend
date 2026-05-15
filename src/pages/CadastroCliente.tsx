import { useState } from 'react';
import HeroSection from '../components/HeroSection.js';

import { ChevronLeft, EyeOff, Eye, Phone } from 'lucide-react';

function CadastroPaciente() {
    const [etapa, setEtapa] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        birthDate: '',
        email: '',
        cpf: '',
        phone: '',
        gender: '',
        bio: '',
        cep: '',
        state: '',
        city: '',
        neighborhood: '',
        street: '',
        number: '',
        complement: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        shareDiaryWithProfessionals: true,
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
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

        setLoading(true);

        const payload = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            cpf: formData.cpf,
            phone: formData.phone,
            birthDate: formData.birthDate,
            gender: formData.gender,
            avatarUrl: 'https://cdn.psique.com/avatars/default.jpg', // Pode ser alterado no futuro para upload real
            bio: formData.bio || 'Perfil criado para acompanhamento psicológico.',
            cep: formData.cep,
            state: formData.state,
            city: formData.city,
            neighborhood: formData.neighborhood,
            street: formData.street,
            number: formData.number,
            complement: formData.complement,
            role: 'PATIENT',
            patientProfile: {
                emergencyContactName: formData.emergencyContactName,
                emergencyContactPhone: formData.emergencyContactPhone,
                shareDiaryWithProfessionals: formData.shareDiaryWithProfessionals
            }
        };

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert("Cadastro de paciente realizado com sucesso!");
                window.location.href = '/login';
            } else {
                const errorData = await response.json();
                alert(`Erro: ${errorData.message || 'Falha no cadastro'}`);
            }
        } catch (error) {
            alert("Erro ao conectar com o servidor.");
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
            <HeroSection subtitle="Paciente" currentStep={etapa} totalSteps={3} />

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
                            {etapa === 1 && "Seus dados pessoais"}
                            {etapa === 2 && "Onde você mora?"}
                            {etapa === 3 && "Segurança e Contato"}
                        </h1>
                    </header>

                    <form onSubmit={handleSubmit} className="flex flex-col w-full gap-[3vh]" noValidate>

                        {/* ETAPA 1: Dados Pessoais */}
                        {etapa === 1 && (
                            <div className="flex flex-col gap-[2.5vh] animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-1 flex flex-col items-start">
                                        <label className="text-navy font-semibold mb-1">Nome completo</label>
                                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="bg-input-bg rounded-xl w-full px-4 py-3 outline-none border border-transparent focus:border-navy" placeholder="Seu nome" required />
                                    </div>
                                    <div className="flex-1 flex flex-col items-start">
                                        <label className="text-navy font-semibold mb-1">Data de nascimento</label>
                                        <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className="bg-input-bg rounded-xl w-full px-4 py-3 outline-none border border-transparent focus:border-navy" required />
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-1 flex flex-col items-start">
                                        <label className="text-navy font-semibold mb-1">E-mail</label>
                                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="bg-input-bg rounded-xl w-full px-4 py-3 outline-none border border-transparent focus:border-navy" placeholder="email@exemplo.com" required />
                                    </div>
                                    <div className="flex-1 flex flex-col items-start">
                                        <label className="text-navy font-semibold mb-1">Gênero</label>
                                        <select name="gender" value={formData.gender} onChange={handleChange} className="bg-input-bg rounded-xl w-full px-4 py-3 outline-none border border-transparent focus:border-navy appearance-none" required>
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
                                        <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} className="bg-input-bg rounded-xl w-full px-4 py-3 outline-none border border-transparent focus:border-navy" placeholder="000.000.000-00" required />
                                    </div>
                                    <div className="flex-1 flex flex-col items-start">
                                        <label className="text-navy font-semibold mb-1">Telefone</label>
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="bg-input-bg rounded-xl w-full px-4 py-3 outline-none border border-transparent focus:border-navy" placeholder="(00) 00000-0000" required />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ETAPA 2: Endereço (Igual para ambos) */}
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

                        {/* ETAPA 3: Específico Paciente */}
                        {etapa === 3 && (
                            <div className="flex flex-col gap-[2.5vh] animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="p-5 bg-navy/5 rounded-xl flex flex-col gap-4 border border-navy/10">
                                    <h3 className="text-navy font-bold flex items-center gap-2"><Phone size={18} /> Contato de Emergência</h3>
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-1 flex flex-col items-start">
                                            <label className="text-navy font-semibold mb-1 text-sm">Nome do Contato</label>
                                            <input type="text" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} className="bg-white rounded-xl w-full px-4 py-2 border border-transparent focus:border-navy outline-none" required />
                                        </div>
                                        <div className="flex-1 flex flex-col items-start">
                                            <label className="text-navy font-semibold mb-1 text-sm">Telefone do Contato</label>
                                            <input type="tel" name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={handleChange} className="bg-white rounded-xl w-full px-4 py-2 border border-transparent focus:border-navy outline-none" required />
                                        </div>
                                    </div>
                                </div>

                                <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-navy/5 rounded-lg transition-colors">
                                    <input type="checkbox" name="shareDiaryWithProfessionals" checked={formData.shareDiaryWithProfessionals} onChange={handleChange} className="w-5 h-5 accent-navy cursor-pointer" />
                                    <span className="text-navy font-medium text-sm">Aceito compartilhar meu diário com profissionais que me acompanham</span>
                                </label>

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

export default CadastroPaciente;