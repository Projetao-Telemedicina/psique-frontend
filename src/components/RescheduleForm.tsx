import React, { useState, useEffect } from 'react';
import { Calendar, Loader2 } from 'lucide-react';

interface RescheduleFormProps {
    appointment: { professionalId: string };
    onSubmit: (date: string, time: string) => void;
    loading: boolean;
    role?: string;
}

export default function RescheduleForm({ appointment, onSubmit, loading, role }: RescheduleFormProps) {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [availableTimes, setAvailableTimes] = useState<string[]>([]);
    const [loadingTimes, setLoadingTimes] = useState(false);

    useEffect(() => {
        if (!selectedDate) return;

        const fetchAvailableTimes = async () => {
            try {
                setLoadingTimes(true);
                setSelectedTime(''); 
                const token = localStorage.getItem('token');
                
                const response = await fetch(`/api/professionals/${appointment.professionalId}/availabilities?date=${selectedDate}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const times: string[] = await response.json(); 
                    setAvailableTimes(times);
                }
            } catch (err) {
                console.error("Erro ao buscar horários livres:", err);
            } finally {
                setLoadingTimes(false);
            }
        };

        fetchAvailableTimes();
    }, [selectedDate, appointment.professionalId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedDate && selectedTime) {
            onSubmit(selectedDate, selectedTime);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* 1. SELEÇÃO DE DATA */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Escolha a Nova Data</label>
                <input 
                    type="date" 
                    required 
                    min={new Date().toISOString().split('T')[0]} 
                    value={selectedDate} 
                    onChange={(e) => setSelectedDate(e.target.value)} 
                    disabled={loading} 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-600 focus:bg-white transition-all" 
                />
            </div>

            {/* 2. EXIBIÇÃO DOS HORÁRIOS DISPONÍVEIS */}
            {selectedDate && (
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Horários Disponíveis</label>
                    
                    {loadingTimes ? (
                        <div className="flex items-center gap-2 text-xs text-slate-500 py-2">
                            <Loader2 className="animate-spin text-teal-600" size={16} />
                            <span>Consultando agenda...</span>
                        </div>
                    ) : availableTimes.length > 0 ? (
                        /* Grade de botões de horário */
                        <div className="grid grid-cols-4 gap-2">
                            {availableTimes.map((time) => (
                                <button
                                    key={time}
                                    type="button"
                                    onClick={() => setSelectedTime(time)}
                                    className={`py-2 text.xs font-bold rounded-xl border transition-all ${
                                        selectedTime === time
                                            ? 'bg-teal-600 border-teal-600 text-white shadow-sm shadow-teal-600/20'
                                            : 'bg-white border-slate-200 text-slate-700 hover:border-teal-600 hover:bg-teal-50/30'
                                    }`}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 p-3 rounded-xl">
                            Nenhum horário disponível para esta data. Por favor, escolha outro dia.
                        </p>
                    )}
                </div>
            )}

            {/* 3. BOTÃO DE ENVIO */}
            <button 
                type="submit" 
                disabled={loading || !selectedDate || !selectedTime} 
                className="w-full mt-2 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-full transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:pointer-events-none"
            >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <Calendar size={16} />}
                {role === 'PROFESSIONAL' ? 'Sugerir Reagendamento' : 'Solicitar Reagendamento'}
            </button>
        </form>
    );
}