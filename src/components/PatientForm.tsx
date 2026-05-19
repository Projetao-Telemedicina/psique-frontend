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
      { value: 'SISTEMICA', label: 'Sistêmica / Familiar: Focada nos padrões de repetição da família e nas relações sociais' },
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
    type: 'checkbox', // Múltipla escolha
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
    id: 'sessionTimeUsage',
    title: 'Como você prefere que o tempo das suas sessões seja aproveitado?',
    type: 'radio',
    options: [
      { value: 'GUIDED', label: 'Prefiro que o profissional guie a sessão, proponha exercícios práticos e traga ferramentas para eu aplicar no dia a dia' },
      { value: 'FREE', label: 'Prefiro ter total liberdade para falar o que vier à mente, com o profissional intervindo para me ajudar a conectar os pensamentos' },
      { value: 'MIXED', label: 'Gostaria de momentos de desabafo livre, mas também de momentos onde o profissional traga técnicas e caminhos claros' },
      { value: 'NO_PREFERENCE', label: 'Sem preferência / Não sei: Gostaria de experimentar os diferentes formatos e ver qual funciona melhor para mim' }
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
      onFinish(answers);
    }
  };

  const isAnswered = () => {
    const ans = answers[question.id];
    return !!ans && (question.type === 'radio' || ans.length > 0);
  };

  return (
    <div className="flex-1 flex flex-col p-8 md:p-16 justify-between bg-slate-50 overflow-y-auto h-screen">
      
      {/* Container de Questão Centralizado */}
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
        <div className={question.type === 'radio' ? 'mt-4 grid grid-cols-1 gap-3' : 'grid grid-cols-1 gap-3'}>
          {question.options.map((opt) => {
            const isSelected = question.type === 'radio' 
              ? answers[question.id] === opt.value 
              : (answers[question.id] || []).includes(opt.value);
              
            return (
              <button
                key={opt.value}
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
                
                {/* Renderização Condicional da UI baseada no tipo da pergunta */}
                {question.type === 'radio' ? (
                  /* Estilo Círculo (Radio) */
                  <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                    isSelected ? 'border-[#2E93D1] bg-[#2E93D1]' : 'border-slate-300 group-hover:border-slate-400'
                  }`}>
                    {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                ) : (
                  /* Estilo Quadrado (Checkbox) */
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
          {currentStep === patientQuestions.length - 1 ? 'Concluir' : 'Avançar'}
        </button>
      </div>
    </div>
  );
};