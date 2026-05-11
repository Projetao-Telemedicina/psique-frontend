// UC04 - Editar Cadastro de Paciente
// Fluxo principal: paciente edita suas informações
// FA01: editar senha exige confirmação da senha atual
// FA02: editar foto de perfil

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CampoEditavel from '../components/CampoEditavel';
import Sidebar from '../components/Sidebar';

// TODO: substituir pelos dados reais vindos da API
const dadosIniciais = {
  nome: 'Luana Silva',
  email: 'luana@email.com',
  telefone: '(81) 98765-4321',
  dataNascimento: '15/04/1995',
  cpf: '155.558.344-77',
  endereco: 'Boa Viagem, Recife - PE',
  foto: null as string | null,
}

// ─── SVG Icons ───────────────────────────────────────────────────────────────

function IconeEditarFoto({ size = 12, color = 'white' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_400_730)">
        <path d="M14.1156 4.54126C14.8491 3.80795 14.8493 2.61709 14.116 1.8836C13.3827 1.1501 12.1918 1.14995 11.4583 1.88326L2.56097 10.7826C2.40619 10.9369 2.29172 11.127 2.22764 11.3359L1.34697 14.2373C1.31187 14.3547 1.34408 14.482 1.43084 14.5686C1.5176 14.6552 1.6449 14.6872 1.76231 14.6519L4.66431 13.7719C4.87309 13.7084 5.06309 13.5947 5.21764 13.4406L14.1156 4.54126" stroke={color} strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip0_400_730">
          <rect width="16" height="16" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  )
}

function IconeCheck({ size = 14, color = '#166534' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function IconeVoltar({ size = 18, color = '#64748B' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function IconeUsuario({ size = 36, color = 'white' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function IconeCadeado({ size = 15, color = '#0D9488' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}


// ─── Campo editável (com fonte Inter e estilos atualizados) ──────────────────

const estiloInput: React.CSSProperties = {
  width: '100%', padding: '8px 12px', border: '1px solid #D1D5DB',
  borderRadius: '8px', fontSize: '13px', color: '#1E293B',
  outline: 'none', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif',
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function EditarPerfilPaciente() {
  const navigate = useNavigate()

  const [dados, setDados] = useState(dadosIniciais)
  const [campoEditando, setCampoEditando] = useState<string | null>(null)
  const [valorEditando, setValorEditando] = useState('')
  const [erroValidacao, setErroValidacao] = useState('')

  const [modalSenhaAberto, setModalSenhaAberto] = useState(false)
  const [novaSenha, setNovaSenha] = useState('')
  const [senhaAtual, setSenhaAtual] = useState('')
  const [erroSenha, setErroSenha] = useState('')
  const [mensagemSucesso, setMensagemSucesso] = useState('')

  function abrirEdicao(campo: string, valorAtual: string) {
    setCampoEditando(campo)
    setValorEditando(valorAtual)
    setErroValidacao('')
  }

  function cancelarEdicao() {
    setCampoEditando(null)
    setValorEditando('')
    setErroValidacao('')
  }

  function salvarCampo() {
    if (!valorEditando.trim()) {
      setErroValidacao('Este campo não pode ficar em branco')
      return
    }
    if (campoEditando === 'email' && !valorEditando.includes('@')) {
      setErroValidacao('E-mail inválido (sem @)')
      return
    }
    if (campoEditando === 'telefone' && valorEditando.replace(/\D/g, '').length < 10) {
      setErroValidacao('Telefone inválido (informe com DDD)')
      return
    }
    setDados(prev => ({ ...prev, [campoEditando!]: valorEditando }))
    setCampoEditando(null)
    setValorEditando('')
    mostrarSucesso('Informação atualizada com sucesso!')
  }

  function mostrarSucesso(msg: string) {
    setMensagemSucesso(msg)
    setTimeout(() => setMensagemSucesso(''), 3000)
  }

  function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0]
    if (arquivo) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setDados(prev => ({ ...prev, foto: reader.result as string }))
        mostrarSucesso('Foto atualizada com sucesso!')
      }
      reader.readAsDataURL(arquivo)
    }
  }

  function abrirModalSenha() {
    setModalSenhaAberto(true)
    setNovaSenha('')
    setSenhaAtual('')
    setErroSenha('')
  }

  function salvarSenha() {
    if (!novaSenha)  { setErroSenha('Digite a nova senha');    return }
    if (!senhaAtual) { setErroSenha('Digite sua senha atual'); return }
    // TODO: validar senha atual pela API
    if (senhaAtual !== '123456') {
      setErroSenha('Senha atual incorreta')
      return
    }
    setModalSenhaAberto(false)
    mostrarSucesso('Senha atualizada com sucesso!')
  }

  const camposPaciente = [
    { campo: 'nome',           label: 'NOME COMPLETO' },
    { campo: 'email',          label: 'E-MAIL' },
    { campo: 'telefone',       label: 'TELEFONE' },
    { campo: 'dataNascimento', label: 'DATA DE NASCIMENTO' },
    { campo: 'cpf',            label: 'CPF' },
    { campo: 'endereco',       label: 'ENDEREÇO' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F0F4F8' }}>

      <main style={{ flex: 1, overflowY: 'auto', position: 'relative', display: 'flex', flexDirection: 'row' }}>

        {/* SIDEBAR */}
        <Sidebar role="paciente" navigate={navigate} itemAtivo="perfil" />



        <div style={{ flex: 1, overflowY: 'auto', position: 'relative', display: 'flex', flexDirection: 'column' }}>

        {/* TOPBAR */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '28px 32px 20px', backgroundColor: '#ffffff',
          borderBottom: '1px solid #E2E8F0',
        }}>
          <button
            onClick={() => navigate('/perfil/paciente')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
            aria-label="Voltar"
          >
            <IconeVoltar size={20} color="#64748B" />
          </button>
          <div>
            <h1 style={{
              color: '#1E293B',
              fontFamily: 'Inter',
              fontSize: '30px',
              fontStyle: 'normal',
              fontWeight: '700',
              lineHeight: '36px',
              margin: 0,
            }}>Editar Perfil</h1>
            <p style={{
              color: '#64748B',
              fontFamily: 'Inter',
              fontSize: '16px',
              fontStyle: 'normal',
              fontWeight: '400',
              lineHeight: '24px',
              margin: '4px 0 0 0',
            }}>Clique no lápis para editar cada informação.</p>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', position: 'relative', display: 'flex', flexDirection: 'row' }}>

        <div style={{ padding: '24px 32px' }}>

          {/* Mensagem de sucesso */}
          {mensagemSucesso && (
            <div style={{
              backgroundColor: '#F0FDF4', border: '1px solid #86EFAC',
              borderRadius: '8px', padding: '12px 16px', marginBottom: '20px',
              color: '#166534', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <IconeCheck size={14} color="#166534" />
              {mensagemSucesso}
            </div>
          )}

          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0' }}>

            {/* FOTO DE PERFIL */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #F1F5F9' }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: '80px', height: '80px', borderRadius: '50%',
                  overflow: 'hidden', backgroundColor: '#0D9488',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {dados.foto
                    ? <img src={dados.foto} alt="foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <IconeUsuario size={36} color="white" />
                  }
                </div>
                <label style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: '26px', height: '26px', backgroundColor: '#0D9488',
                  borderRadius: '50%', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', cursor: 'pointer', border: '2px solid white',
                }}>
                  <IconeEditarFoto size={12} color="white" />
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFoto} />
                </label>
              </div>
              <div>
                <p style={{
                  fontWeight: '600', color: '#1E293B', margin: 0,
                  fontFamily: 'Inter', fontSize: '16px',
                }}>{dados.nome}</p>
                <p style={{
                  fontSize: '13px', color: '#64748B', margin: '4px 0 0 0',
                  fontFamily: 'Inter',
                }}>Conta de Cliente</p>
              </div>
            </div>

            {/* CAMPOS EDITÁVEIS */}
            {camposPaciente.map(({ campo, label }) => (
              <CampoEditavel
                key={campo}
                label={label}
                valor={(dados as Record<string, string>)[campo]}
                editando={campoEditando === campo}
                valorEditando={valorEditando}
                erro={campoEditando === campo ? erroValidacao : ''}
                onEditar={() => abrirEdicao(campo, (dados as Record<string, string>)[campo])}
                onCancelar={cancelarEdicao}
                onSalvar={salvarCampo}
                onChangeValor={setValorEditando}
              />
            ))}

            {/* SENHA */}
            <div style={{ marginTop: '4px', paddingTop: '16px', borderTop: '1px solid #F1F5F9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{
                    color: '#64748B',
                    fontFamily: 'Inter',
                    fontSize: '12px',
                    fontWeight: '600',
                    lineHeight: '16px',
                    textTransform: 'uppercase',
                    margin: '0 0 4px 0',
                  }}>
                    SENHA
                  </p>
                  <p style={{
                    fontSize: '14px', color: '#1E293B', margin: 0, letterSpacing: '2px',
                    fontFamily: 'Inter',
                  }}>••••••••</p>
                </div>
                <button
                  onClick={abrirModalSenha}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#0D9488', fontSize: '13px', padding: '4px 8px',
                    fontFamily: 'Inter',
                  }}
                >
                  <IconeCadeado size={14} color="#0D9488" />
                  Alterar senha
                </button>
              </div>
            </div>
          </div>
          </div>
          </div>
        </div>
      </main>

      {/* MODAL DE ALTERAR SENHA */}
      {modalSenhaAberto && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
        }}>
          <div style={{
            backgroundColor: 'white', borderRadius: '16px', padding: '28px',
            width: '100%', maxWidth: '380px', margin: '16px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          }}>
            <h2 style={{
              fontSize: '18px', fontWeight: '600', color: '#1E293B', margin: '0 0 8px 0',
              fontFamily: 'Inter',
            }}>Alterar senha</h2>
            <p style={{
              fontSize: '13px', color: '#64748B', margin: '0 0 20px 0',
              fontFamily: 'Inter',
            }}>Digite sua senha atual e a nova senha.</p>

            <div style={{ marginBottom: '14px' }}>
              <label style={{
                fontSize: '11px', color: '#374151', fontWeight: '600', display: 'block',
                marginBottom: '6px', letterSpacing: '0.5px', textTransform: 'uppercase',
                fontFamily: 'Inter',
              }}>Senha atual</label>
              <input
                type="password"
                value={senhaAtual}
                onChange={e => { setSenhaAtual(e.target.value); setErroSenha('') }}
                placeholder="••••••••"
                style={estiloInput}
              />
            </div>

            <div style={{ marginBottom: '8px' }}>
              <label style={{
                fontSize: '11px', color: '#374151', fontWeight: '600', display: 'block',
                marginBottom: '6px', letterSpacing: '0.5px', textTransform: 'uppercase',
                fontFamily: 'Inter',
              }}>Nova senha</label>
              <input
                type="password"
                value={novaSenha}
                onChange={e => { setNovaSenha(e.target.value); setErroSenha('') }}
                placeholder="••••••••"
                style={estiloInput}
              />
            </div>

            {erroSenha && (
              <p style={{ fontSize: '12px', color: '#EF4444', margin: '4px 0 0 0', fontFamily: 'Inter' }}>{erroSenha}</p>
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button
                onClick={() => setModalSenhaAberto(false)}
                style={{
                  flex: 1, padding: '10px', backgroundColor: 'white', color: '#374151',
                  border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13px',
                  fontWeight: '500', cursor: 'pointer', fontFamily: 'Inter',
                }}
              >
                Cancelar
              </button>
              <button
                onClick={salvarSenha}
                style={{
                  flex: 1, padding: '10px', backgroundColor: '#0D9488', color: 'white',
                  border: 'none', borderRadius: '8px', fontSize: '13px',
                  fontWeight: '600', cursor: 'pointer', fontFamily: 'Inter',
                }}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}