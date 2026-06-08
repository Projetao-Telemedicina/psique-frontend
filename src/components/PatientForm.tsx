import React, { useState } from 'react';

interface Option { value: string; label: string; }
interface Question { id: string; title: string; type: 'radio' | 'checkbox'; options: Option[]; }

const patientQuestions: Question[] = [
  {
    id: 'reason',
    title: 'Qual o principal motivo que te levou a buscar terapia neste momento?',
    type: 'radio', 
    options: [
      { value: 'EMOTIONAL', label: 'Saúde Emocional: Lidar com ansiedade, depressão ou oscilações de humor' },
      { value: 'RELATIONSHIPS', label: 'Relacionamentos: Conflitos familiares, amorosos ou dificuldades de socialização' },
      { value: 'PROFESSIONAL', label: 'Vida Profissional/Acadêmica: Esgotamento (Burnout), estresse, foco ou transição de carreira' },
      { value: 'SELF_KNOWLEDGE', label: 'Autoconhecimento: Entender melhor a própria história e fortalecer a autoestima' },
      { value: 'CRISIS', label: 'Crises e Perdas: Luto, traumas ou mudanças drásticas de vida' },
      { value: 'NOT_SURE', label: 'Não tenho certeza' }
    ]
  },
  {
    id: 'timeNeeded',
    title: 'Há quanto tempo você sente a necessidade de buscar terapia?',
    type: 'radio',
    options: [
      { value: 'RECENT', label: 'Recentemente (algumas semanas)' },
      { value: 'MONTHS', label: 'Há alguns meses' },
      { value: 'YEARS', label: 'Há um ano ou mais' },
      { value: 'NOT_SURE', label: 'Não sei dizer ao certo' }
    ]
  },
  {
    id: 'history',
    title: 'Você já fez terapia antes?',
    type: 'radio',
    options: [
      { value: 'NEVER', label: 'Nunca fiz terapia, será minha primeira vez' },
      { value: 'GOOD_EXP', label: 'Já fiz e tive boas experiências' },
      { value: 'BAD_EXP', label: 'Já fiz, mas senti dificuldade de adaptação' }
    ]
  },
  {
    id: 'approaches',
    title: 'Busco profissionais na área de:',
    type: 'radio',
    options: [
      { value: 'TCC', label: 'Terapia Cognitivo-Comportamental (TCC): Focada em metas, mudança de hábitos e pensamentos práticos' },
      { value: 'PSICANALISE', label: 'Psicanálise / Psicodinâmica: Focada no inconsciente, sonhos e na origem profunda dos traumas' },
      { value: 'HUMANISTA', label: 'Humanista / Fenomenológica: Focada no acolhimento, na liberdade de escolha e no momento presente' },
      { value: 'CORPORAL', label: 'Corporal / Bioenergética: Focada na relação entre mente e corpo, trabalhando tensões físicas e energia.' },
      { value: 'SISTEMICA', label: 'Sistêmica / Familiar: Focada nos padrões de repetição da família e nas relações sociais.' },
      { value: 'DONT_KNOW', label: 'Não conheço as abordagens / Quero a indicação do sistema' }
    ]
  },
  {
    id: 'interactionStyle',
    title: 'Como você espera que o profissional interaja com você durante as sessões?',
    type: 'radio',
    options: [
      { value: 'ACTIVE', label: 'Ativo e Direto: Prefiro um terapeuta que fale mais, proponha exercícios, aponte contradições e ajude em soluções práticas' },
      { value: 'REFLEXIVE', label: 'Reflexivo e Analítico: Prefiro um espaço de escuta profunda, onde o terapeuta intervenha pontualmente para me ajudar a refletir' },
      { value: 'SUPPORTIVE', label: 'Acolhedor e Suporte: Busco alguém que priorize o suporte emocional e a validação dos meus sentimentos em um espaço seguro' },
      { value: 'BALANCED', label: 'Mix / Equilibrado: Gostaria de um equilíbrio: alguém que saiba ouvir nos momentos de desabafo, mas que também traga direcionamentos práticos quando necessário.' },
      { value: 'NOT_SURE', label: 'Não sei, gostaria de descobrir durante o processo' }
    ]
  },
  {
    id: 'genderPreference',
    title: 'Para que você se sinta mais à vontade nas sessões, você possui preferência em relação ao gênero do profissional?',
    type: 'radio',
    options: [
      { value: 'FEMALE', label: 'Sinto-me mais confortável sendo atendido(a) por uma mulher' },
      { value: 'MALE', label: 'Sinto-me mais confortável sendo atendido(a) por um homem' },
      { value: 'NON_BINARY', label: 'Sinto-me mais confortável sendo atendido(a) por uma pessoa não-binária' },
      { value: 'NO_PREFERENCE', label: 'O gênero do profissional não interfere no meu conforto' },
      { value: 'NOT_SURE', label: 'Não sei / Gostaria de ver perfis de diferentes gêneros' }
    ]
  },
  {
    id: 'specialContexts',
    title: 'Você busca um profissional que tenha conhecimento aprofundado ou experiência prática em algum destes contextos?',
    type: 'checkbox',
    options: [
      { value: 'LGBTQIA', label: 'Diversidade e Identidade de Gênero: Focado em questões LGBTQIA+ e transição de gênero' },
      { value: 'RACIAL', label: 'Relações Étnico-Raciais: Focado em vivências da negritude, povos indígenas e superação de preconceitos' },
      { value: 'NEURODIVERSITY', label: 'Neurodiversidade: Focado em TDAH, Autismo e formas diferentes de processar o mundo' },
      { value: 'FEMINISM', label: 'Feminismo e Pautas de Mulheres: Focado em empoderamento, maternidade e desafios da mulher atual' },
      { value: 'SPIRITUALITY', label: 'Espiritualidade e Valores: Focado em pessoas que desejam que sua crença ou filosofia de vida seja respeitada no processo' },
      { value: 'NOT_PRIORITY', label: 'Não é prioridade: Para mim, o foco é apenas a técnica clínica, independente do contexto social' },
      { value: 'NOT_SURE', label: 'Não sei / Prefiro não responder' }
    ]
  },
  {
    id: 'professionalTrajectory',
    title: 'Em relação à trajetória do profissional, qual perfil você acredita que melhor se adapta à sua necessidade hoje?',
    type: 'radio',
    options: [
      { value: 'TRENDS', label: 'Conectado às novas tendências: Profissionais que acompanham de perto as linguagens atuais, cultura digital e os desafios das novas gerações' },
      { value: 'BALANCED', label: 'Equilíbrio entre teoria e prática: Profissionais que unem as novas metodologias a uma base de experiência já consolidada no mercado' },
      { value: 'CONSOLIDATED', label: 'Trajetória consolidada: Profissionais com ampla bagagem clínica, que trazem uma perspectiva baseada em muitos anos de atendimento e maturidade' },
      { value: 'NO_PREFERENCE', label: 'Sem preferência: O tempo de formação ou a idade não são fatores decisivos para a minha escolha' },
      { value: 'NOT_SURE', label: 'Não sei / Gostaria de ver perfis variados' }
    ]
  },
  {
    id: 'mainGoal',
    title: 'O que você espera alcançar como principal resultado das suas sessões?',
    type: 'radio',
    options: [
      { value: 'CLARITY', label: 'Clareza e Profundidade: Quero entender a origem das minhas emoções e comportamentos para me conhecer melhor a longo prazo' },
      { value: 'PRACTICALITY', label: 'Resolução e Praticidade: Preciso de ferramentas e estratégias diretas para resolver problemas e sintomas que me afetam hoje' },
      { value: 'BOTH', label: 'Ambos: Gostaria de equilibrar o entendimento profundo com ações práticas no meu dia a dia' },
      { value: 'NOT_SURE', label: 'Não tenho certeza: Gostaria que o profissional me ajudasse a definir esse objetivo durante o processo' }
    ]
  }
];

interface PatientFormProps {
  onStepChange: (current: number, total: number) => void;
  onFinish: (answers: Record<string, any>) => void;
}

export const PatientForm: React.FC<PatientFormProps> = ({ onStepChange, onFinish }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const question = patientQuestions[currentStep];

  React.useEffect(() => {
    onStepChange(currentStep + 1, patientQuestions.length);
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
    if (currentStep < patientQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const mapReason: Record<string, number> = { 'EMOTIONAL': 0, 'RELATIONSHIPS': 1, 'PROFESSIONAL': 2, 'SELF_KNOWLEDGE': 3, 'CRISIS': 4, 'NOT_SURE': 5 };
      const mapTime: Record<string, number> = { 'RECENT': 0, 'MONTHS': 1, 'YEARS': 2, 'NOT_SURE': 3 };
      const mapHistory: Record<string, number> = { 'NEVER': 0, 'GOOD_EXP': 1, 'BAD_EXP': 2 };
      const mapApproach: Record<string, number> = { 'TCC': 0, 'PSICANALISE': 1, 'HUMANISTA': 2, 'CORPORAL': 3, 'SISTEMICA': 4, 'DONT_KNOW': 5 };
      const mapStyle: Record<string, number> = { 'ACTIVE': 0, 'REFLEXIVE': 1, 'SUPPORTIVE': 2, 'BALANCED': 3, 'NOT_SURE': 4 };
      const mapGender: Record<string, number> = { 'FEMALE': 0, 'MALE': 1, 'NON_BINARY': 2, 'NO_PREFERENCE': 3, 'NOT_SURE': 4 };
      const mapExp: Record<string, number> = { 'TRENDS': 0, 'BALANCED': 1, 'CONSOLIDATED': 2, 'NO_PREFERENCE': 3, 'NOT_SURE': 4 };
      const mapGoal: Record<string, number> = { 'CLARITY': 0, 'PRACTICALITY': 1, 'BOTH': 2, 'NOT_SURE': 3 };

      const payload = {
        motivoTerapia: mapReason[answers.reason],
        tempoBusca: mapTime[answers.timeNeeded],
        experienciaPrevia: mapHistory[answers.history],
        abordagem: mapApproach[answers.approaches],
        estiloTerapeutico: mapStyle[answers.interactionStyle],
        genero: mapGender[answers.genderPreference],
        experiencia: mapExp[answers.professionalTrajectory],
        objetivo: mapGoal[answers.mainGoal],
        contextos: [
          answers.specialContexts?.includes('LGBTQIA') ? 1 : 0,
          answers.specialContexts?.includes('RACIAL') ? 1 : 0,
          answers.specialContexts?.includes('NEURODIVERSITY') ? 1 : 0,
          answers.specialContexts?.includes('FEMINISM') ? 1 : 0,
          answers.specialContexts?.includes('SPIRITUALITY') ? 1 : 0,
        ],
        ignoraContextos: false,
        precisaSuporteFora: false,
        restricaoHorario: false,
      };
      onFinish(payload);
    }
  };

  const isAnswered = () => {
    const ans = answers[question.id];
    return !!ans && (question.type === 'radio' || ans.length > 0);
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50">
      {/* Área central que abriga pergunta e opções */}
      <div className="flex-1 flex flex-col px-8 md:px-16 pt-8 overflow-hidden">
        <div className="max-w-4xl w-full mx-auto flex flex-col h-full">
          
          {/* Header fixo para evitar corte */}
          <div className="shrink-0 mb-6">
            <span className="text-[10px] font-bold text-[#2E93D1] tracking-[0.2em] uppercase block mb-3">
              Questão {currentStep + 1} de {patientQuestions.length}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
              {question.title}
            </h2>
            {question.type === 'checkbox' && (
              <p className="text-sm text-slate-400 font-medium mt-2 italic">
                *Você pode selecionar mais de uma opção
              </p>
            )}
          </div>
          
          {/* Container de opções com scroll próprio */}
          <div className="flex-1 overflow-y-auto pr-2 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {question.options.map((opt) => {
                const isSelected = question.type === 'radio' 
                  ? answers[question.id] === opt.value 
                  : (answers[question.id] || []).includes(opt.value);
                return (
                  <button 
                    key={opt.value} 
                    onClick={() => handleSelect(opt.value)} 
                    className={`w-full text-left p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${
                      isSelected ? 'border-[#2E93D1] bg-sky-50/50' : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <span className={`text-sm md:text-base leading-snug ${isSelected ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>
                      {opt.label}
                    </span>
                    <div className={`w-5 h-5 rounded-${question.type === 'radio' ? 'full' : 'lg'} border-2 flex items-center justify-center shrink-0 ml-3 ${
                      isSelected ? 'border-[#2E93D1] bg-[#2E93D1]' : 'border-slate-300'
                    }`}>
                      {isSelected && (question.type === 'radio' ? <div className="w-1.5 h-1.5 bg-white rounded-full" /> : <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer fixo */}
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
          {currentStep === patientQuestions.length - 1 ? 'Concluir' : 'Próxima'}
        </button>
      </footer>
    </div>
  );
};