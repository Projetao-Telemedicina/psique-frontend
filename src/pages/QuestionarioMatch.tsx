import { useState, useCallback } from 'react';
import { MatchSidebar } from '../components/MatchSidebar';
import { PatientForm } from '../components/PatientForm';
import { ProfessionalForm } from '../components/ProfessionalForm';
import { useAuth } from '../components/AuthContext';

export default function QuestionarioMatch() {
  const { user } = useAuth();

  const [stepData, setStepData] = useState({ current: 1, total: 1 });
  const progressPercentage = Math.round((stepData.current / stepData.total) * 100) || 0;

  const handleStepChange = useCallback((current: number, total: number) => {
    setStepData({ current, total });
  }, []);

  const handleFormFinish = (finalAnswers: Record<string, any>) => {
    console.log('Questionário respondido! Dados recolhidos:', finalAnswers);
  };

  const isProfessional = user?.role === 'PROFESSIONAL';

  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#F8FAFC]">
      {/* Sidebar do Match com o progresso */}
      <MatchSidebar 
        progress={progressPercentage} 
        currentStep={stepData.current} 
        totalSteps={stepData.total} 
      />

      {/* Formulário Dinâmico baseado na role do usuário logado */}
      {isProfessional ? (
        <ProfessionalForm onStepChange={handleStepChange} onFinish={handleFormFinish} />
      ) : (
        <PatientForm onStepChange={handleStepChange} onFinish={handleFormFinish} />
      )}
    </main>
  );
}