import { useState } from 'react';
import { Eye, EyeOff, ChevronDown } from 'lucide-react';

interface CampoPerfilProps {
  label: string;
  valor: string;
  isEditing: boolean;
  onChange?: (val: string) => void;
  type?: 'text' | 'password' | 'date' | 'select' | 'textarea';
  options?: { label: string; value: string }[]; 
}

export const CampoPerfil = ({ label, valor, isEditing, onChange, type = "text", options }: CampoPerfilProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const formatExibicao = (v: string) => {
    if (type === 'password' && !isEditing) return '••••••••';
    if (type === 'date' && v && !isEditing) return v.split('-').reverse().join('/');
    if (type === 'select' && !isEditing && options) {
      return options.find(opt => opt.value === v)?.label || v;
    }
    return v;
  };

  return (
    <div className="flex flex-col gap-1.5 text-left w-full">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
        {label}
      </label>

      {isEditing && onChange ? (
        <div className="relative">
          {type === 'textarea' ? (
            <textarea
              value={valor}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:border-teal-500 transition-all resize-none"
              rows={3}
            />
          ) : type === 'select' ? (
            <div className="relative">
              <select
                value={valor}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:border-teal-500 appearance-none cursor-pointer"
              >
                {options?.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          ) : (
            <>
              <input
                type={type === 'password' && showPassword ? 'text' : type}
                value={valor}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:border-teal-500 transition-all"
              />
              {type === 'password' && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              )}
            </>
          )}
        </div>
      ) : (
        <p className="text-slate-700 font-semibold text-sm px-1 py-2">
          {formatExibicao(valor)}
        </p>
      )}
    </div>
  );
};