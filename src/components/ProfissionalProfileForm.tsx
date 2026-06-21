import { Camera, MapPin, Loader2, Save, X, Star, Pencil, Trash2 } from 'lucide-react';
import { CampoPerfil } from './CampoPerfil';

export const ProfissionalProfileForm = ({
  dados,
  setDados,
  isEditing,
  setIsEditing,
  setIsDeleteModalOpen,
  isSaving,
  onSave,
  onCancel,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  fileInputRef,
  onFotoChange,
  maskCPF,
  maskPhone,
  opcoesGenero,
  estrelasCalculadas
}: any) => {
  return (
    <article className="flex-1 bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <div
              onClick={() => isEditing && fileInputRef.current?.click()}
              className={`w-32 h-32 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white shrink-0 relative overflow-hidden transition-all bg-teal-600 ${isEditing ? 'cursor-pointer hover:opacity-90' : ''}`}
            >
              {dados.user.avatarUrl ? (
                <img src={dados.user.avatarUrl} alt="Perfil" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold">{dados.user.name[0]}</span>
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
              <p className="text-teal-600 font-medium tracking-tight italic">{dados.specialty}</p>
              <div className="flex items-center gap-1 mt-1">
                {Array.from({ length: estrelasCalculadas }).map((_, i) => <Star key={i} size={14} fill="#FACC15" color="#FACC15" />)}
                {Array.from({ length: 5 - estrelasCalculadas }).map((_, i) => <Star key={i} size={14} fill="transparent" color="#CBD5E1" />)}
                <span className="text-xs text-slate-400 font-medium ml-1">{dados.scoreAvg} ({dados.reviewCount} avaliações)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-50 pt-8 text-left">
          <div className="grid grid-cols-2 gap-y-6 gap-x-12">
            <div className="col-span-2">
              <CampoPerfil label="Sobre mim" valor={dados.user.bio} isEditing={isEditing} type="textarea" onChange={(v: string) => setDados({...dados, user: {...dados.user, bio: v}})} />
            </div>
            <CampoPerfil label="Nome completo" valor={dados.user.name} isEditing={isEditing} onChange={(v: string) => setDados({...dados, user: {...dados.user, name: v}})} />
            <CampoPerfil label="E-mail" valor={dados.user.email} isEditing={false} />
            <CampoPerfil label="CPF" valor={maskCPF(dados.user.cpf)} isEditing={false} />
            <CampoPerfil label="Telefone" valor={maskPhone(dados.user.phone)} isEditing={isEditing} onChange={(v: string) => setDados({...dados, user: {...dados.user, phone: v}})} />
            <CampoPerfil label="Gênero" valor={dados.user.gender} isEditing={isEditing} type="select" options={opcoesGenero} onChange={(v: string) => setDados({...dados, user: {...dados.user, gender: v}})} />
            <CampoPerfil label="Registro Profissional (CRP)" valor={dados.crp} isEditing={false} />
            <CampoPerfil label="Especialidade" valor={dados.specialty} isEditing={isEditing} onChange={(v: string) => setDados({...dados, specialty: v})} />
            
            <div className="col-span-2 mt-4 flex items-center gap-2">
               <MapPin size={14} className="text-slate-400" />
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Localização</h3>
            </div>
            <CampoPerfil label="CEP" valor={dados.user.cep} isEditing={isEditing} onChange={(v: string) => setDados({...dados, user: {...dados.user, cep: v}})} />
            <CampoPerfil label="Cidade" valor={dados.user.city} isEditing={isEditing} onChange={(v: string) => setDados({...dados, user: {...dados.user, city: v}})} />
            <CampoPerfil label="Estado" valor={dados.user.state} isEditing={isEditing} onChange={(v: string) => setDados({...dados, user: {...dados.user, state: v}})} />
            <CampoPerfil label="Rua" valor={dados.user.street} isEditing={isEditing} onChange={(v: string) => setDados({...dados, user: {...dados.user, street: v}})} />
            <CampoPerfil label="Número" valor={dados.user.number} isEditing={isEditing} onChange={(v: string) => setDados({...dados, user: {...dados.user, number: v}})} />

            {isEditing && (
              <>
                <div className="col-span-2 mt-4"><h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Segurança</h3></div>
                <CampoPerfil label="Senha Atual" valor={currentPassword} isEditing={isEditing} type="password" onChange={(v: string) => setCurrentPassword(v)} />
                <CampoPerfil label="Nova Senha" valor={newPassword} isEditing={isEditing} type="password" onChange={(v: string) => setNewPassword(v)} />
              </>
            )}
          </div>
        </div>

        <div className="flex gap-4 mt-10 border-t border-slate-50 pt-8">
          {isEditing ? (
            <>
              <button onClick={onCancel} className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 font-bold text-sm rounded-full hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                <X size={16} /> Cancelar
              </button>
              <button onClick={onSave} className="flex-1 py-3 bg-teal-600 text-white font-bold text-sm rounded-full hover:bg-teal-700 transition-all shadow-md flex items-center justify-center gap-2">
                {isSaving ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16} /> Salvar Alterações</>}
              </button>
            </>
         ) : (
            <>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="flex-1 py-3 bg-red-600 text-white font-bold text-sm rounded-full hover:bg-red-700 transition-all flex items-center justify-center gap-2"
              >
                <Trash2 size={16} /> Deletar Conta
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold text-sm rounded-full hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
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