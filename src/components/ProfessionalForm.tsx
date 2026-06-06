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
  userGender: number;
}

export const ProfessionalForm: React.FC<ProfessionalFormProps> = ({ onStepChange, onFinish, userGender }) => {
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

  const handleNext = () => {
    if (currentStep < professionalQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const mapApproach: Record<string, number> = { 'TCC': 0, 'PSYCHANALYSIS': 1, 'HUMANIST': 2, 'CORPORAL': 3, 'SYSTEMIC': 4, 'OTHER': 5 };
      const mapStyle: Record<string, number> = { 'ACTIVE': 0, 'REFLEXIVE': 1, 'SUPPORTIVE': 2, 'BALANCED': 3 };
      const mapGoal: Record<string, number> = { 'CLARITY': 0, 'PRACTICALITY': 1, 'BOTH': 2 };
      const mapExp: Record<string, number> = { 'UP_TO_5': 0, 'FROM_5_TO_15': 1, 'OVER_15': 2 };
      const mapSupport: Record<string, number> = { 'PUNCTUAL': 0, 'LIMITED': 1, 'NONE': 2 };
      const mapAvailability: Record<string, number> = { 'FULL_TIME': 0, 'PART_TIME': 1, 'PUNCTUAL': 2 };

      const payload = {
        motivosTerapia: [
          answers.themes?.includes('EMOTIONAL') ? 1 : 0,
          answers.themes?.includes('RELATIONSHIPS') ? 1 : 0,
          answers.themes?.includes('PROFESSIONAL') ? 1 : 0,
          answers.themes?.includes('SELF_KNOWLEDGE') ? 1 : 0,
          answers.themes?.includes('CRISIS') ? 1 : 0,
        ],
        abordagem: mapApproach[answers.mainApproach] ?? 5,
        estiloTerapeutico: mapStyle[answers.postureStyle],
        objetivo: mapGoal[answers.patientGoalPriority],
        genero: userGender,
        experiencia: mapExp[answers.experienceTime],
        contextos: [
          answers.specialContexts?.includes('LGBTQIA') ? 1 : 0,
          answers.specialContexts?.includes('RACIAL') ? 1 : 0,
          answers.specialContexts?.includes('NEURODIVERSITY') ? 1 : 0,
          answers.specialContexts?.includes('FEMINISM') ? 1 : 0,
          answers.specialContexts?.includes('SPIRITUALITY') ? 1 : 0,
        ],
        suporteFora: mapSupport[answers.outsideSupport],
        periodoAtendimento: mapAvailability[answers.availabilityPeriod],
      };
      onFinish(payload);
    }
  };

  const isAnswered = () => {
    const selected = answers[question.id];
    if (!selected || (question.type === 'checkbox' && selected.length === 0)) return false;
    if (question.type === 'radio') {
      const opt = question.options.find(o => o.value === selected);
      if (opt?.hasInput) return !!textInputs[question.id]?.trim();
    }
    return true;
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50">
      <div className="flex-1 flex flex-col px-8 md:px-16 pt-8 overflow-hidden">
        <div className="max-w-4xl w-full mx-auto flex flex-col h-full">
          
          <div className="shrink-0 mb-6">
            <span className="text-[10px] font-bold text-[#2E93D1] tracking-[0.2em] uppercase block mb-3">
              Questão {currentStep + 1} de {professionalQuestions.length}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
              {question.title}
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {question.options.map((opt) => {
                const isSelected = question.type === 'radio' ? answers[question.id] === opt.value : (answers[question.id] || []).includes(opt.value);
                return (
                  <div key={opt.value} className="flex flex-col gap-2">
                    <button 
                      onClick={() => handleSelect(opt.value)} 
                      className={`w-full text-left p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${isSelected ? 'border-[#2E93D1] bg-sky-50/50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                    >
                      <span className={`text-sm md:text-base ${isSelected ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>{opt.label}</span>
                      <div className={`w-5 h-5 rounded-${question.type === 'radio' ? 'full' : 'lg'} border-2 ${isSelected ? 'border-[#2E93D1] bg-[#2E93D1]' : 'border-slate-300'}`} />
                    </button>
                    {isSelected && opt.hasInput && (
                      <input 
                        type="text" 
                        placeholder={opt.inputPlaceholder} 
                        value={textInputs[question.id] || ''} 
                        onChange={(e) => setTextInputs({ ...textInputs, [question.id]: e.target.value })} 
                        className="w-full p-4 rounded-xl border-2 border-[#2E93D1] focus:outline-none focus:ring-2 focus:ring-sky-200" 
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <footer className="w-full bg-white border-t border-slate-200 p-6 flex justify-between items-center shrink-0">
        <button 
          onClick={() => setCurrentStep(currentStep - 1)} 
          className={`px-8 py-3 rounded-xl font-bold text-sm text-slate-500 hover:bg-slate-100 transition-all ${currentStep === 0 ? 'invisible' : ''}`}
        >
          Voltar
        </button>
        <button 
          onClick={handleNext} 
          disabled={!isAnswered()} 
          className={`px-12 py-3 rounded-xl font-bold text-sm text-white shadow-lg transition-all ${isAnswered() ? 'bg-[#2E93D1] hover:bg-[#206E9F]' : 'bg-slate-300 cursor-not-allowed'}`}
        >
          {currentStep === professionalQuestions.length - 1 ? 'Concluir' : 'Próxima'}
        </button>
      </footer>
    </div>
  );
};