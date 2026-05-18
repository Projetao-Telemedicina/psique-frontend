import React, { useState } from 'react';
import { Calendar, Loader2 } from 'lucide-react';

interface RescheduleFormProps {
    appointment: { professionalId: string };
    onSubmit: (date: string, time: string) => void;
    loading: boolean;
    role?: string;
}

export default function RescheduleForm({ onSubmit, loading, role }: RescheduleFormProps) {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

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
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Escolha a Nova Data
                </label>
                <div className="relative">
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
            </div>

            {/* 2. SELEÇÃO DE HORÁRIO */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Escolha o Novo Horário
                </label>
                <div className="relative">
                    <input 
                        type="time" 
                        required 
                        value={selectedTime} 
                        onChange={(e) => setSelectedTime(e.target.value)} 
                        disabled={loading} 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-600 focus:bg-white transition-all [color-scheme:light]" 
                    />
                </div>
            </div>

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