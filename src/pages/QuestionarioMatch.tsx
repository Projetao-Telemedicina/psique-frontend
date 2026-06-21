import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { toast } from 'react-hot-toast'; 
import { MatchSidebar } from '../components/MatchSidebar';
import { PatientForm } from '../components/PatientForm';
import { ProfessionalForm } from '../components/ProfessionalForm';
import { useAuth } from '../components/AuthContext';

export default function QuestionarioMatch() {
  const { user, token } = useAuth();
  const navigate = useNavigate(); 

  const [fetchedGender, setFetchedGender] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserGender = async () => {
      const userId = user?.id || localStorage.getItem('userId');
      if (!userId || !token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/professionals/${userId}`, { 
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setFetchedGender(Number(data.user?.gender) || 0);
        }
      } catch (err) {
        console.error("Erro ao carregar gênero:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserGender();
  }, [token, user]);

  const [stepData, setStepData] = useState({ current: 1, total: 1 });
  const progressPercentage = Math.round((stepData.current / stepData.total) * 100) || 0;

  const handleStepChange = useCallback((current: number, total: number) => {
    setStepData({ current, total });
  }, []);

  const handleFormFinish = async (finalAnswers: Record<string, any>) => {
    try {
      const endpoint = isProfessional 
        ? '/api/matching/professional/questionnaire' 
        : '/api/matching/patient/questionnaire';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(finalAnswers),
      });

      if (response.ok) {
        toast.success("Questionário enviado com sucesso!");
        if (window.history.length > 2) {
          navigate(-1);
        } else {
          navigate(isProfessional ? '/perfil/profissional' : '/paciente/home');
        }
      } else {
        throw new Error("Erro ao salvar dados.");
      }
    } catch (error) {
      console.error('Erro ao enviar questionário:', error);
      toast.error("Erro ao enviar questionário. Tente novamente."); 
    }
  };

  const isProfessional = user?.role === 'PROFESSIONAL';

  if (loading) {
    return <div className="flex h-screen w-full items-center justify-center">Carregando...</div>;
  }

  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#F8FAFC]">
      <MatchSidebar 
        progress={progressPercentage} 
        currentStep={stepData.current} 
        totalSteps={stepData.total} 
      />

      {isProfessional ? (
        <ProfessionalForm 
          onStepChange={handleStepChange} 
          onFinish={handleFormFinish} 
          userGender={fetchedGender} 
        />
      ) : (
        <PatientForm 
          onStepChange={handleStepChange} 
          onFinish={handleFormFinish} 
        />
      )}
    </main>
  );
}