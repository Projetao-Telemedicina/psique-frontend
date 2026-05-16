import React, { useState } from 'react';

interface Option { 
  value: string; 
  label: string; 
  hasInput?: boolean; 
  inputPlaceholder?: string;
}

interface Question { 
  id: string; 
  title: string; 
  type: 'radio' | 'checkbox'; 
  options: Option[]; 
}

const professionalQuestions: Question[] = [
  {
    id: 'themes',
    title: 'Em quais destes temas você possui maior experiência ou foco de atendimento clínico?',
    type: 'checkbox',
    options: [
      { value: 'EMOTIONAL', label: 'Saúde Emocional (Ansiedade, depressão, oscilações de humor)' },
      { value: 'RELATIONSHIPS', label: 'Relacionamentos (Conflitos familiares, amorosos, socialização)' },
      { value: 'PROFESSIONAL', label: 'Vida Profissional/Acadêmica (Burnout, estresse, carreira)' },
      { value: 'SELF_KNOWLEDGE', label: 'Autoconhecimento (História pessoal, autoestima)' },
      { value: 'CRISIS', label: 'Crises e Perdas (Luto, traumas, mudanças drásticas)' }
    ]
  },
  {
    id: 'mainApproach',
    title: 'Qual a sua principal abordagem teórica?',
    type: 'radio',
    options: [
      { value: 'TCC', label: 'Terapia Cognitivo-Comportamental (TCC)' },
      { value: 'PSYCHANALYSIS', label: 'Psicanálise / Psicodinâmica' },
      { value: 'HUMANIST', label: 'Humanista / Fenomenológica' },
      { value: 'CORPORAL', label: 'Corporal / Bioenergética' },
      { value: 'SYSTEMIC', label: 'Sistêmica / Familiar' },
      { value: 'OTHER', label: 'Outra:', hasInput: true, inputPlaceholder: 'Digite a sua abordagem...' }
    ]
  },
  {
    id: 'postureStyle',
    title: 'Como você descreveria sua postura e interação predominante durante as sessões?',
    type: 'radio',
    options: [
      { value: 'ACTIVE', label: 'Ativo e Direto: Intervenho com frequência, aponto contradições e foco em soluções' },
      { value: 'REFLEXIVE', label: 'Reflexivo e Analítico: Priorizo a escuta profunda e intervenho para ajudar na reflexão' },
      { value: 'SUPPORTIVE', label: 'Acolhedor e Suporte: Foco na validação emocional e na construção de um espaço seguro' },
      { value: 'BALANCED', label: 'Flexível / Equilibrado: Alterno entre escuta e direcionamento conforme a necessidade' }
    ]
  },
  {
    id: 'sessionTimeUsage',
    title: 'Como você costuma aproveitar o tempo das sessões com seus pacientes?',
    type: 'radio',
    options: [
      { value: 'GUIDED', label: 'Sessões Guiadas: Proponho exercícios práticos, ferramentas e sigo um direcionamento claro' },
      { value: 'FREE', label: 'Sessões de Fala Livre: Foco na livre associação, intervindo para conectar pensamentos' },
      { value: 'MIXED', label: 'Sessões Mistas: Equilibro momentos de desabafo livre com intervenções e técnicas' }
    ]
  },
  {
    id: 'patientGoalPriority',
    title: 'No seu trabalho, você prioriza que o paciente alcance:',
    type: 'radio',
    options: [
      { value: 'CLARITY', label: 'Clareza e Profundidade: Entendimento das origens emocionais a longo prazo' },
      { value: 'PRACTICALITY', label: 'Resolução e Praticidade: Mudanças comportamentais e alívio de sintomas atuais' },
      { value: 'BOTH', label: 'Ambos: Um equilíbrio entre autoconhecimento e estratégias práticas' }
    ]
  },
  {
    id: 'specialContexts',
    title: 'Você possui lugar de fala ou especialização em algum destes contextos?',
    type: 'checkbox',
    options: [
      { value: 'LGBTQIA', label: 'Diversidade e Identidade de Gênero (LGBTQIA+)' },
      { value: 'RACIAL', label: 'Relações Étnico-Raciais' },
      { value: 'NEURODIVERSITY', label: 'Neurodiversidade (TDAH, Autismo, etc.)' },
      { value: 'FEMINISM', label: 'Feminismo e Pautas de Mulheres' },
      { value: 'SPIRITUALITY', label: 'Espiritualidade e Valores Religiosos' },
      { value: 'PREFER_NOT_TO_SAY', label: 'Prefiro não responder' }
    ]
  },
  {
    id: 'experienceTime',
    title: 'Há quantos anos você atua na área clínica?',
    type: 'radio',
    options: [
      { value: 'UP_TO_5', label: 'Até 5 anos: Perfil conectado a novas tendências e linguagens atuais' },
      { value: 'FROM_5_TO_15', label: 'De 5 a 15 anos: Perfil intermediário com equilíbrio entre teoria e prática' },
      { value: 'OVER_15', label: 'Mais de 15 anos: Trajetória consolidada com ampla bagagem clínica' }
    ]
  },
  {
    id: 'specialization',
    title: 'Possui Especialização/Pós-graduação?',
    type: 'radio',
    options: [
      { value: 'YES', label: 'Sim. Qual?', hasInput: true, inputPlaceholder: 'Digite a especialização...' },
      { value: 'NO', label: 'Não' }
    ]
  },
  {
    id: 'outsideSupport',
    title: 'Você oferece acompanhamento fora das sessões?',
    type: 'radio',
    options: [
      { value: 'PUNCTUAL', label: 'Ofereço suporte pontual por mensagens' },
      { value: 'LIMITED', label: 'Limitado' },
      { value: 'NONE', label: 'Não ofereço suporte fora da sessão' }
    ]
  },
  {
    id: 'availabilityPeriod',
    title: 'Você atende atualmente em período:',
    type: 'radio',
    options: [
      { value: 'FULL_TIME', label: 'Integral: Possuo disponibilidade em diversos turnos e horários ao longo da semana' },
      { value: 'PART_TIME', label: 'Parcial: Atendo apenas em turnos ou dias específicos da semana' },
      { value: 'PUNCTUAL', label: 'Pontual: Possuo poucos horários residuais ou foco em atendimentos de urgência/curta duração' }
    ]
  }
];

interface ProfessionalFormProps {
  onStepChange: (current: number, total: number) => void;
  onFinish: (answers: Record<string, any>) => void;
}

export const ProfessionalForm: React.FC<ProfessionalFormProps> = ({ onStepChange, onFinish }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [textInputs, setTextInputs] = useState<Record<string, string>>({});

  const question = professionalQuestions[currentStep];

  React.useEffect(() => {
    onStepChange(currentStep + 1, professionalQuestions.length);
  }, [currentStep, onStepChange]);

  const handleSelect = (value: string) => {
    if (question.type === 'radio') {
      setAnswers({ ...answers, [question.id]: value });
    } else {
      const currentSelection = answers[question.id] || [];
      const nextSelection = currentSelection.includes(value)
        ? currentSelection.filter((v: string) => v !== value)
        : [...currentSelection, value];
      setAnswers({ ...answers, [question.id]: nextSelection });
    }
  };

  const handleTextInputChange = (value: string) => {
    const activeSelection = answers[question.id];
    setTextInputs({ ...textInputs, [question.id + '_' + activeSelection]: value });
  };

  const handleNext = () => {
    if (currentStep < professionalQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const finalSubmission = { ...answers, ...textInputs };
      onFinish(finalSubmission);
    }
  };

  const isAnswered = () => {
    const selectedValue = answers[question.id];
    if (!selectedValue || (question.type === 'checkbox' && selectedValue.length === 0)) {
      return false;
    }

    // Se o tipo for rádio e a opção ativa exigir texto livre, valida se o input não está em branco
    if (question.type === 'radio') {
      const currentActiveOption = question.options.find(opt => opt.value === selectedValue);
      if (currentActiveOption?.hasInput) {
        const textVal = textInputs[question.id + '_' + selectedValue];
        return !!textVal && textVal.trim().length > 0;
      }
    }
    return true;
  };

  return (
    <div className="flex-1 flex flex-col p-8 md:p-16 justify-between bg-slate-50 overflow-y-auto h-screen">
      
      {/* Bloco Central do Formulário */}
      <div className="max-w-3xl w-full mx-auto my-auto py-8">
        <span className="text-xs font-bold text-[#2E93D1] tracking-wide uppercase block mb-2">
          Questão {currentStep + 1}
        </span>
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 leading-snug mb-3">
          {question.title}
        </h2>
        {question.type === 'checkbox' && (
          <p className="text-xs text-slate-400 font-semibold mb-6 italic">*Você pode selecionar mais de uma opção</p>
        )}

        <div className="grid grid-cols-1 gap-3 mt-4">
          {question.options.map((opt) => {
            const isSelected = question.type === 'radio' 
              ? answers[question.id] === opt.value 
              : (answers[question.id] || []).includes(opt.value);
              
            return (
              <div key={opt.value} className="flex flex-col gap-2 w-full">
                <button
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full text-left p-5 rounded-2xl border-2 flex items-center justify-between transition-all group ${
                    isSelected 
                      ? 'border-[#2E93D1] bg-sky-50/50 text-slate-900 shadow-sm' 
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span className={`text-sm md:text-base pr-4 leading-relaxed ${isSelected ? 'font-semibold text-slate-900' : ''}`}>
                    {opt.label}
                  </span>
                  
                  {/* Seletor Customizado */}
                  {question.type === 'radio' ? (
                    <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                      isSelected ? 'border-[#2E93D1] bg-[#2E93D1]' : 'border-slate-300 group-hover:border-slate-400'
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                  ) : (
                    <div className={`w-5 h-5 rounded-lg border-2 shrink-0 flex items-center justify-center transition-all ${
                      isSelected ? 'border-[#2E93D1] bg-[#2E93D1]' : 'border-slate-300 group-hover:border-slate-400'
                    }`}>
                      {isSelected && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  )}
                </button>

                {/* Input Dinâmico de Texto Livre quando selecionado */}
                {question.type === 'radio' && isSelected && opt.hasInput && (
                  <input
                    type="text"
                    placeholder={opt.inputPlaceholder}
                    value={textInputs[question.id + '_' + opt.value] || ''}
                    onChange={(e) => handleTextInputChange(e.target.value)}
                    className="w-full mt-1 p-4 rounded-xl border-2 border-[#2E93D1] bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-200 shadow-inner font-medium transition-all"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Rodapé de Navegação */}
      <div className="max-w-3xl w-full mx-auto border-t border-slate-200/60 pt-6 flex justify-between items-center">
        <button
          onClick={() => setCurrentStep(currentStep - 1)}
          className={`px-8 py-3.5 rounded-2xl font-bold text-sm border-2 border-slate-200 text-slate-500 hover:bg-slate-100 transition-all ${
            currentStep === 0 ? 'opacity-0 pointer-events-none' : ''
          }`}
        >
          Voltar
        </button>
        
        <button
          onClick={handleNext}
          disabled={!isAnswered()}
          className={`px-14 py-4 rounded-2xl font-bold text-sm text-white shadow-lg transition-all ${
            isAnswered() 
              ? 'bg-[#2E93D1] hover:bg-[#206E9F] transform hover:-translate-y-0.5' 
              : 'bg-slate-300 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          {currentStep === professionalQuestions.length - 1 ? 'Concluir' : 'Avançar'}
        </button>
      </div>
    </div>
  );
};