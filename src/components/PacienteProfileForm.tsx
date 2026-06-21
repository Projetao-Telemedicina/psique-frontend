import { Camera, MapPin, Loader2, Save, X, Trash2, Pencil } from 'lucide-react';
import { CampoPerfil } from './CampoPerfil';

export const PacienteProfileForm = ({
  dados,
  setDados,
  isEditing,
  setIsEditing,
  isSaving,
  onSave,
  onCancel,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  fileInputRef,
  onFotoChange,
  maskPhone,
  setIsDeleteModalOpen
}: any) => {
  return (
    <article className="flex-1 bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-8">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <div
              onClick={() => isEditing && fileInputRef.current?.click()}
              className={`w-32 h-32 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white shrink-0 relative overflow-hidden transition-all bg-teal-600 ${isEditing ? 'cursor-pointer hover:opacity-90' : ''}`}
            >
              {dados.user.avatarUrl ? (
                <img src={dados.user.avatarUrl} alt="Perfil" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold">{dados.user.name?.[0]}</span>
              )}
              {isEditing && (
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center backdrop-blur-[1px]">
                  <Camera size={20} />
                  <span className="text-[10px] font-bold mt-1 tracking-widest uppercase">Alterar</span>
                </div>
              )}
              <input type="file" ref={fileInputRef} hidden onChange={onFotoChange} accept="image/*" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{dados.user.name}</h2>
              <p className="text-teal-600 font-medium tracking-tight italic">Paciente Psique</p>
            </div>
          </div>
        </div>

        {/* Campos */}
        <div className="border-t border-slate-50 pt-8 text-left">
          <div className="grid grid-cols-2 gap-y-6 gap-x-12">
            <CampoPerfil label="Nome Completo" valor={dados.user.name} isEditing={isEditing} onChange={(val: string) => setDados({ ...dados, user: { ...dados.user, name: val } })} />
            <CampoPerfil label="E-mail" valor={dados.user.email} isEditing={isEditing} onChange={(val: string) => setDados({ ...dados, user: { ...dados.user, email: val } })} />
            <CampoPerfil label="Telefone" valor={maskPhone(dados.user.phone)} isEditing={isEditing} onChange={(val: string) => setDados({ ...dados, user: { ...dados.user, phone: maskPhone(val) } })} />
            <CampoPerfil label="CPF" valor={dados.user.cpf} isEditing={false} />

            <div className="col-span-2 mt-4 flex items-center gap-2">
              <MapPin size={14} className="text-slate-400" />
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Localização</h3>
            </div>

            <CampoPerfil label="Cidade" valor={dados.user.city} isEditing={isEditing} onChange={(val: string) => setDados({ ...dados, user: { ...dados.user, city: val } })} />
            <CampoPerfil label="Estado" valor={dados.user.state} isEditing={isEditing} onChange={(val: string) => setDados({ ...dados, user: { ...dados.user, state: val } })} />
            <CampoPerfil label="Rua" valor={dados.user.street} isEditing={isEditing} onChange={(val: string) => setDados({ ...dados, user: { ...dados.user, street: val } })} />
            <CampoPerfil label="Número" valor={dados.user.number} isEditing={isEditing} onChange={(val: string) => setDados({ ...dados, user: { ...dados.user, number: val } })} />

            <div className="col-span-2 mt-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Segurança e Emergência</h3>
            </div>

            <CampoPerfil label="Contato de Emergência" valor={dados.emergencyContactName} isEditing={isEditing} onChange={(val: string) => setDados({ ...dados, emergencyContactName: val })} />
            <CampoPerfil label="Telefone do Contato" valor={dados.emergencyContactPhone} isEditing={isEditing} onChange={(val: string) => setDados({ ...dados, emergencyContactPhone: maskPhone(val) })} />

            {isEditing && (
              <>
                <CampoPerfil label="Senha Atual" valor={currentPassword} isEditing={isEditing} type="password" onChange={(val: string) => setCurrentPassword(val)} />
                <CampoPerfil label="Nova Senha" valor={newPassword} isEditing={isEditing} type="password" onChange={(val: string) => setNewPassword(val)} />
              </>
            )}

            <div className="col-span-2 flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <input type="checkbox" disabled={!isEditing} checked={dados.shareDiaryWithProfessionals} onChange={(e) => setDados({ ...dados, shareDiaryWithProfessionals: e.target.checked })} className="w-5 h-5 accent-teal-600 cursor-pointer" />
              <span className="text-sm text-slate-600 font-semibold italic">Permitir que meu psicólogo veja meu diário de saúde</span>
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-4 mt-10 border-t border-slate-50 pt-6">
          {isEditing ? (
            <>
              <button onClick={onCancel} className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 font-bold text-sm rounded-full hover:bg-slate-50 flex items-center justify-center gap-2">
                <X size={16} /> Cancelar
              </button>
              <button onClick={onSave} className="flex-1 py-3 bg-teal-600 text-white font-bold text-sm rounded-full hover:bg-teal-700 shadow-md flex items-center justify-center gap-2">
                {isSaving ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16} /> Salvar Alterações</>}
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setIsDeleteModalOpen(true)}
                className="flex-1 py-3 bg-red-600 text-white font-bold text-sm rounded-full hover:bg-red-700 shadow-sm flex items-center justify-center gap-2"
              >
                <Trash2 size={16} /> Deletar Conta
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 py-3 bg-transparent border border-slate-200 text-slate-600 font-bold text-sm rounded-full hover:bg-slate-50 flex items-center justify-center gap-2"
              >
                <Pencil size={16} /> Editar Informações
              </button>
            </>
        )}
        </div>
      </div>
    </article>
  );
};