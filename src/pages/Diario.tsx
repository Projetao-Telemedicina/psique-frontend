import React, { useState } from "react";
import { RotateCcw, Send } from "lucide-react";
import Sidebar from '../components/Sidebar';

type MoodId =
  | "feliz"
  | "amedrontado"
  | "calmo"
  | "triste"
  | "ansioso"
  | "esperancoso"
  | "raivoso"
  | "tranquilo"
  | "cansado";

type Mood = {
  id: MoodId;
  label: string;
  emoji: string;
};

type SleepOption =
  | "Dormi 8 horas ou mais"
  | "Dormi entre 6 a 8 horas"
  | "Dormi entre 4 a 5 horas"
  | "Dormi menos que 4 horas";

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

//integracao com backend//
const moodToFeeling = {
  feliz: "HAPPY",
  amedrontado: "SCARED",
  triste: "SAD",
  ansioso: "ANXIOUS",
  raivoso: "ANGRY",
  calmo: "CALM",
  tranquilo: "CALM",
  esperancoso: "HOPEFUL",
  cansado: "EXHAUSTED",
} as const;

const sleepToQuality = {
  "Dormi 8 horas ou mais": "EIGHT_OR_MORE",
  "Dormi entre 6 a 8 horas": "SIX_TO_EIGHT",
  "Dormi entre 4 a 5 horas": "FOUR_TO_FIVE",
  "Dormi menos que 4 horas": "LESS_THAN_FOUR",
} as const;
//termina aqui

type MoodButtonProps = {
  mood: Mood;
  selectedMood: MoodId;
  onSelectMood: (moodId: MoodId) => void;
};

function MoodButton({ mood, selectedMood, onSelectMood }: MoodButtonProps) {
  const isSelected = selectedMood === mood.id;

  return (
    <button
      type="button"
      onClick={() => onSelectMood(mood.id)}
      className="flex items-center gap-4 rounded-2xl transition hover:-translate-y-0.5"
    >
      <span
        className={`flex h-[54px] w-[54px] items-center justify-center rounded-full bg-white text-[30px] shadow-[0_12px_24px_rgba(0,0,0,0.22)] transition ${
          isSelected ? "ring-2 ring-[#59bd91] ring-offset-4" : ""
        }`}
      >
        {mood.emoji}
      </span>

      <span className="text-[13px] font-medium text-[#5d5d5d]">
        {mood.label}
      </span>
    </button>
  );
}

export default function Diario() {
  const [selectedMood, setSelectedMood] = useState<MoodId>("feliz");
  const [selectedSleep, setSelectedSleep] = useState<SleepOption>(
    "Dormi 8 horas ou mais"
  );
  const [diaryText, setDiaryText] = useState<string>(
    "Escreva aqui como foi o seu dia..."
  );

  //botao e funcao do botao
  async function handleSubmitDiary() {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("Usuário não autenticado.");
    return;
  }

  const response = await fetch("/api/diaries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      feeling: moodToFeeling[selectedMood],
      sleepQuality: sleepToQuality[selectedSleep],
      content: diaryText,
    }),
  });

  if (!response.ok) {
    console.error("Erro ao salvar diário.");
    return;
  }

  const data = await response.json();
  console.log("Diário salvo:", data);
}
//

  return (
    <section className="min-h-screen w-full bg-[#f7f7f7] px-6 py-10 text-[#171717] md:px-10 lg:px-12">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[13px] font-bold">Diário</h1>
        </div>

        <button
          type="button"
          className="flex items-center gap-3 rounded-full px-2 py-1 text-[11px] font-semibold text-[#202020] transition hover:bg-black/5"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d45a00] text-white shadow-sm">
            <RotateCcw size={14} strokeWidth={2.4} />
          </span>
          Botão de Emergência
        </button>
      </header>

      <div className="grid gap-10 xl:grid-cols-[1.4fr_0.85fr]">
        <div>
          <div className="mb-7 flex flex-wrap items-center gap-x-8 gap-y-2">
            <p className="text-[13px] font-medium">
              Como você está se sentindo hoje?
            </p>
            <span className="text-[13px] font-semibold text-[#6c6c6c]">
              14/04/2026
            </span>
          </div>

          <div className="grid max-w-[650px] grid-cols-1 gap-x-12 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
            {moods.map((mood) => (
              <MoodButton
                key={mood.id}
                mood={mood}
                selectedMood={selectedMood}
                onSelectMood={setSelectedMood}
              />
            ))}
          </div>
        </div>

        <div className="xl:pt-9">
          <h2 className="mb-7 text-[13px] font-medium">
            Acompanhamento do sono
          </h2>

          <div className="space-y-7">
            {sleepOptions.map((option) => (
              <label
                key={option}
                className="flex cursor-pointer items-center gap-3 text-[13px] font-bold text-[#111111]"
              >
                <input
                  type="radio"
                  name="sleep"
                  value={option}
                  checked={selectedSleep === option}
                  onChange={() => setSelectedSleep(option)}
                  className="h-4 w-4 accent-[#5cbd91]"
                />
                {option}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 max-w-[990px]">
        <label htmlFor="diaryText" className="mb-4 block text-[13px] font-bold">
          Diário escrito
        </label>

        <div className="relative rounded-[9px] bg-[#d8d8d8] shadow-sm">
          <textarea
            id="diaryText"
            value={diaryText}
            onChange={(event) => setDiaryText(event.target.value)}
            placeholder="Escreva aqui como foi seu dia"
            className="min-h-[225px] w-full resize-none bg-transparent px-6 py-7 pr-20 text-[15px] leading-relaxed text-[#555555] outline-none placeholder:text-[#777777]"
          />

          <button
            type="button"
            onClick={handleSubmitDiary}
            className="absolute bottom-5 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-[#5fbd90] text-white shadow-sm transition hover:scale-105 hover:bg-[#52aa80]"
            aria-label="Enviar diário"
          >
            <Send size={18} strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </section>
  );
}
