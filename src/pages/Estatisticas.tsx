import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import EmergencyButton from '../components/EmergencyButton';
import { EmergencyModal } from "../components/EmergencyModal";
import { CheckCircle, Timer, Book, Smile, Users, Star, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const feelingMap: Record<string, string> = {
  HAPPY: "Feliz", SCARED: "Amedrontado", SAD: "Triste", ANXIOUS: "Ansioso",
  ANGRY: "Raivoso", CALM: "Calmo", HOPEFUL: "Esperançoso", EXHAUSTED: "Cansado"
};

const sleepMap: Record<string, string> = {
  'EIGHT_OR_MORE': "8h ou mais",
  'SIX_TO_EIGHT': "6 a 8 horas",
  'FOUR_TO_FIVE': "4 a 5 horas",
  'LESS_THAN_FOUR': "Menos de 4h"
};

export default function Estatisticas() {
  const { user } = useAuth();
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [stats, setStats] = useState({ sessions: 0, hours: 0, diaries: 0, sleep: 0, clients: 0 });
  const [feedData, setFeedData] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem('token');
      try {
        if (user?.role === 'PROFESSIONAL') {
          const [appRes, revRes] = await Promise.all([
            fetch('/api/appointments/me/history', { headers: { 'Authorization': `Bearer ${token}` } }),
            fetch('/api/professionals/me/reviews', { headers: { 'Authorization': `Bearer ${token}` } })
          ]);
          const apps = await appRes.json();
          const reviews = await revRes.json();
          const completed = apps.filter((a: any) => a.status === 'COMPLETED');

          setStats({
            sessions: completed.length,
            hours: completed.length * 1,
            clients: new Set(apps.map((a: any) => a.patientId)).size,
            diaries: 0,
            sleep: 0
          });
          setFeedData(reviews);
        } else {
          const [appRes, diaryRes] = await Promise.all([
            fetch('/api/appointments/me/history', { headers: { 'Authorization': `Bearer ${token}` } }),
            fetch('/api/diaries/me', { headers: { 'Authorization': `Bearer ${token}` } })
          ]);
          const apps = await appRes.json();
          const diaries = await diaryRes.json();
          const completed = apps.filter((a: any) => a.status === 'COMPLETED');

          const sleepWeights: Record<string, number> = { 'EIGHT_OR_MORE': 9, 'SIX_TO_EIGHT': 7, 'FOUR_TO_FIVE': 4.5, 'LESS_THAN_FOUR': 3 };

          setStats({
            sessions: completed.length,
            hours: completed.length * 1,
            diaries: diaries.length,
            clients: 0,
            sleep: diaries.length > 0
              ? Number((diaries.reduce((acc: number, d: any) => acc + (sleepWeights[d.sleepQuality] || 6), 0) / diaries.length).toFixed(1))
              : 0
          });
          setFeedData(diaries);
        }
      } catch (err) { toast.error("Erro ao carregar dados"); }
    };
    loadData();
  }, [user]);

  return (
    <main className="flex h-screen w-full bg-[#F8F9FA] overflow-hidden">
      <Sidebar role={user?.role === 'PROFESSIONAL' ? 'profissional' : 'paciente'} itemAtivo="estatisticas" />

      <EmergencyModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
      />

      <section className="flex flex-col flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-black">Estatísticas</h1>
          {user?.role !== 'PROFESSIONAL' && <EmergencyButton onClick={() => setShowEmergencyModal(true)} />}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="grid grid-cols-2 gap-4 md:gap-6 h-fit w-full lg:w-fit">
            <StatCard value={stats.sessions} label="Sessões concluídas" icon={<CheckCircle size={40} />} />
            <StatCard value={stats.hours} label="Horas de terapia" icon={<Timer size={40} />} />
            {user?.role === 'PROFESSIONAL' ? (
              <>
                <StatCard value={stats.clients} label="Clientes atendidos" icon={<Users size={40} />} />
                <StatCard value={feedData.length} label="Avaliações recebidas" icon={<Star size={40} />} />
              </>
            ) : (
              <>
                <StatCard value={stats.diaries} label="Registros no diário" icon={<Book size={40} />} />
                <StatCard value={stats.sleep} label="Média de horas de sono" icon={<Smile size={40} />} />
              </>
            )}
          </div>

          <div className="flex-1 w-full overflow-hidden">
            <h3 className="font-bold text-lg mb-4 text-black">{user?.role === 'PROFESSIONAL' ? 'Avaliações' : 'Diário'}</h3>
            <div className="space-y-3 w-full">
              {feedData.map((item: any) => (
                <div key={item.id} onClick={() => setSelectedItem(item)} className="cursor-pointer bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition w-full">
                  <p className="font-medium text-black truncate">{item.comment || (item.content ? item.content.substring(0, 50) + '...' : "Ver registro")}</p>
                  <p className="text-sm text-slate-400">{new Date(item.createdAt).toLocaleDateString('pt-BR')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-2xl w-full max-w-lg relative max-h-[80vh] flex flex-col">
            <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 text-slate-400 hover:text-black"><X /></button>
            <h2 className="text-xl font-bold mb-6 text-black">Detalhes do Registro</h2>

            {selectedItem.feeling ? (
              <div className="space-y-4 text-slate-700 flex-1 overflow-hidden flex flex-col">
                <p><strong className="text-black">Data:</strong> {new Date(selectedItem.createdAt).toLocaleDateString('pt-BR')}</p>
                <p><strong className="text-black">Sentimento:</strong> {feelingMap[selectedItem.feeling] || selectedItem.feeling}</p>
                <p><strong className="text-black">Qualidade do sono:</strong> {sleepMap[selectedItem.sleepQuality] || selectedItem.sleepQuality}</p>
                <div className="bg-slate-50 p-4 rounded-xl flex-1 flex flex-col overflow-hidden">
                  <p className="text-sm font-bold text-black mb-2">Relato do dia:</p>
                  <div className="flex-1 overflow-y-auto pr-2">
                    <p className="text-sm text-slate-600 whitespace-pre-wrap break-words">{selectedItem.content}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-slate-700 flex-1 flex flex-col overflow-hidden">
                <p><strong className="text-black">Nota:</strong> {selectedItem.rating} estrelas</p>
                <div className="bg-slate-50 p-4 rounded-xl flex-1 flex flex-col overflow-hidden">
                  <p className="text-sm font-bold text-black mb-2">Comentário:</p>
                  <div className="flex-1 overflow-y-auto pr-2">
                    <p className="text-sm text-slate-600 whitespace-pre-wrap break-words">{selectedItem.comment || "Sem comentários."}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}