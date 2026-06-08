import { useState } from "react";
import { Send } from "lucide-react";
import Sidebar from '../components/Sidebar';
import EmergencyButton from '../components/EmergencyButton';
import { EmergencyModal } from "../components/EmergencyModal";
import { useAuth } from '../components/AuthContext';
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

// --- Types ---
type MoodId = "feliz" | "amedrontado" | "calmo" | "triste" | "ansioso" | "esperancoso" | "raivoso" | "tranquilo" | "cansado";
type SleepOption = "Dormi 8 horas ou mais" | "Dormi entre 6 a 8 horas" | "Dormi entre 4 a 5 horas" | "Dormi menos que 4 horas";

type Mood = { id: MoodId; label: string; emoji: string; };

interface DiaryPayload {
  feeling: string;
  sleepQuality: string;
  symptom: string;
  content: string;
}

const moods: Mood[] = [
  { id: "feliz", label: "Feliz", emoji: "😊" },
  { id: "amedrontado", label: "Amedrontado", emoji: "😨" },
  { id: "calmo", label: "Calmo", emoji: "🙂" },
  { id: "triste", label: "Triste", emoji: "😞" },
  { id: "ansioso", label: "Ansioso", emoji: "😵‍💫" },
  { id: "esperancoso", label: "Esperançoso", emoji: "☺️" },
  { id: "raivoso", label: "Raivoso", emoji: "😡" },
  { id: "tranquilo", label: "Tranquilo", emoji: "😌" },
  { id: "cansado", label: "Cansado", emoji: "😴" },
];

const sleepOptions: SleepOption[] = [
  "Dormi 8 horas ou mais",
  "Dormi entre 6 a 8 horas",
  "Dormi entre 4 a 5 horas",
  "Dormi menos que 4 horas",
];

const moodToFeeling = {
  feliz: "HAPPY", amedrontado: "SCARED", triste: "SAD", ansioso: "ANXIOUS",
  raivoso: "ANGRY", calmo: "CALM", tranquilo: "CALM", esperancoso: "HOPEFUL", cansado: "EXHAUSTED",
} as const;

const sleepToQuality = {
  "Dormi 8 horas ou mais": "EIGHT_OR_MORE",
  "Dormi entre 6 a 8 horas": "SIX_TO_EIGHT",
  "Dormi entre 4 a 5 horas": "FOUR_TO_FIVE",
  "Dormi menos que 4 horas": "LESS_THAN_FOUR",
} as const;

function MoodButton({ mood, selectedMood, onSelectMood }: { mood: Mood, selectedMood: MoodId, onSelectMood: (id: MoodId) => void }) {
  const isSelected = selectedMood === mood.id;
  return (
    <button
      type="button"
      onClick={() => onSelectMood(mood.id)}
      className="flex flex-col items-center gap-3 transition hover:-translate-y-1"
    >
      <span className={`flex h-16 w-16 items-center justify-center rounded-full bg-white text-3xl shadow-md transition ${isSelected ? "ring-4 ring-[#59bd91]" : "ring-1 ring-slate-100"}`}>
        {mood.emoji}
      </span>
      <span className="text-sm font-medium text-slate-600">{mood.label}</span>
    </button>
  );
}

export default function Diario() {
  const { user } = useAuth();
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [selectedMood, setSelectedMood] = useState<MoodId>("feliz");
  const [selectedSleep, setSelectedSleep] = useState<SleepOption>("Dormi 8 horas ou mais");
  const [diaryText, setDiaryText] = useState("");

  const getSidebarRole = () => user?.role === 'PROFESSIONAL' ? 'profissional' : user?.role === 'ADMIN' ? 'administrador' : 'paciente';


  const saveDiaryMutation = useMutation({
    mutationFn: async (payload: DiaryPayload) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Usuário não autenticado.");

      const response = await fetch("/api/diaries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      

      if (!response.ok) {
        throw new Error(data.message || "Erro ao salvar diário.");
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Diário salvo com sucesso!");
      setDiaryText(""); 
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro de conexão com o servidor.");
    }
  });

  const handleSubmitDiary = () => {
    saveDiaryMutation.mutate({
      feeling: moodToFeeling[selectedMood],
      sleepQuality: sleepToQuality[selectedSleep],
      symptom: "Nenhum",
      content: diaryText,
    });
  };

  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#F8FAFC]">
      <Sidebar role={getSidebarRole()} itemAtivo="diario" />

      <EmergencyModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
      />

      <section className="flex flex-col flex-1 overflow-hidden text-left">
        <header className="flex items-center justify-between px-8 py-6 bg-white border-b border-slate-100 shrink-0">
          <div>
            <h1 className="text-3xl font-bold text-[#1E293B]">Diário</h1>
            <p className="text-slate-500 text-sm">Registre seu bem-estar diário</p>
          </div>
          <EmergencyButton onClick={() => setShowEmergencyModal(true)} />
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto space-y-10">

            {/* Humor */}
            <div>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-base font-bold text-slate-800">Como você está se sentindo hoje?</p>
                <span className="text-sm font-medium text-slate-400">{new Date().toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-4">
                {moods.map((mood) => (
                  <MoodButton key={mood.id} mood={mood} selectedMood={selectedMood} onSelectMood={setSelectedMood} />
                ))}
              </div>
            </div>

            {/* Sono */}
            <div>
              <h2 className="mb-6 text-base font-bold text-slate-800">Acompanhamento do sono</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sleepOptions.map((option) => (
                  <label key={option} className="flex cursor-pointer items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-[#59bd91]">
                    <input type="radio" name="sleep" checked={selectedSleep === option} onChange={() => setSelectedSleep(option)} className="h-5 w-5 accent-[#59bd91]" />
                    <span className="text-sm font-medium text-slate-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Texto */}
            <div>
              <label htmlFor="diaryText" className="mb-3 block text-base font-bold text-slate-800">Diário escrito</label>
              <div className="relative">
                <textarea
                  id="diaryText"
                  value={diaryText}
                  onChange={(e) => setDiaryText(e.target.value)}
                  placeholder="Escreva aqui como foi seu dia..."
                  disabled={saveDiaryMutation.isPending} // Desabilita o campo durante o envio
                  className="w-full min-h-[200px] p-6 rounded-2xl bg-white border border-slate-200 shadow-sm focus:ring-2 focus:ring-[#59bd91] outline-none text-slate-700 disabled:opacity-60"
                />
                <button
                  onClick={handleSubmitDiary}
                  disabled={saveDiaryMutation.isPending} // Evita duplo clique bloqueando o botão
                  className="absolute bottom-4 right-4 flex items-center gap-2 px-6 py-3 rounded-full bg-[#59bd91] text-white font-bold hover:bg-[#4ea880] transition disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                  <Send size={18} /> 
                  {saveDiaryMutation.isPending ? "Enviando..." : "Enviar"}
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}