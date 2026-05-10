// UC04 - Editar Cadastro de Profissional
// Fluxo principal: profissional edita suas informações
// FA01: editar senha exige confirmação da senha atual
// FA02: editar foto de perfil
// FA03: profissional pode editar descrição

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// TODO: substituir pelos dados reais vindos da API
const dadosIniciais = {
  nome: 'João Silva',
  email: 'joao@email.com',
  telefone: '(11) 98765-4321',
  dataNascimento: '15/04/1998',
  cpf: '155.558.344-55',
  endereco: 'Boa Viagem, Recife - PE',
  descricao: 'Psicólogo clínico com mais de 5 anos de experiência em terapia cognitivo-comportamental.',
  registroProfissional: 'CRP 07/000000',
  genero: 'Homem Cis',
  foto: null as string | null,
}

// ─── SVG Icons ───────────────────────────────────────────────────────────────

function IconeEditar({ size = 14, color = '#0D9488' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_400_730)">
        <path d="M14.1156 4.54126C14.8491 3.80795 14.8493 2.61709 14.116 1.8836C13.3827 1.1501 12.1918 1.14995 11.4583 1.88326L2.56097 10.7826C2.40619 10.9369 2.29172 11.127 2.22764 11.3359L1.34697 14.2373C1.31187 14.3547 1.34408 14.482 1.43084 14.5686C1.5176 14.6552 1.6449 14.6872 1.76231 14.6519L4.66431 13.7719C4.87309 13.7084 5.06309 13.5947 5.21764 13.4406L14.1156 4.54126" stroke={color} strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_400_730">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

function IconeEditarFoto({ size = 12, color = 'white' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_400_730)">
        <path d="M14.1156 4.54126C14.8491 3.80795 14.8493 2.61709 14.116 1.8836C13.3827 1.1501 12.1918 1.14995 11.4583 1.88326L2.56097 10.7826C2.40619 10.9369 2.29172 11.127 2.22764 11.3359L1.34697 14.2373C1.31187 14.3547 1.34408 14.482 1.43084 14.5686C1.5176 14.6552 1.6449 14.6872 1.76231 14.6519L4.66431 13.7719C4.87309 13.7084 5.06309 13.5947 5.21764 13.4406L14.1156 4.54126" stroke={color} strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_400_730">
          <rect width="16" height="16" fill="white" />
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

function IconeSair({ size = 16, color = 'rgba(255,255,255,0.72)' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
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

// Ícones da sidebar
function IconeHome({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function IconeCalendario({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function IconeEstatisticas({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  )
}

function IconeChat({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function IconeLigacao({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function IconePerfil({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

// Logo oficial do Psique (igual ao perfil profissional)
function LogoPsique() {
  return (
    <img
      src="/psique-logo-white.svg"
      alt="Logo Psique"
      style={{
        width: '254.664px',
        height: '271.642px',
        objectFit: 'contain',
      }}
    />
  )
}

// ─── Sidebar do Profissional (igual ao perfil profissional) ──────────────────

function SidebarProfissional({ navigate, itemAtivo }: { navigate: (path: string) => void; itemAtivo: string }) {
  const itens = [
    { icone: <IconeHome />, label: 'Home', id: 'home', path: '/' },
    { icone: <IconeCalendario />, label: 'Agenda', id: 'agenda', path: '/agenda' },
    { icone: <IconeEstatisticas />, label: 'Estatísticas', id: 'estatisticas', path: '/estatisticas' },
    { icone: <IconeChat />, label: 'Chat', id: 'chat', path: '/chat' },
    { icone: <IconeLigacao />, label: 'Ligação', id: 'ligacao', path: '/ligacao' },
    { icone: <IconePerfil />, label: 'Perfil', id: 'perfil', path: '/perfil/profissional' },
  ]

  return (
    <aside
      style={{
        width: '281px',
        height: '930px',
        background: 'linear-gradient(359deg, #3599D8 -50.97%, #5BB38A 99.09%)',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: '28px',
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', marginBottom: '32px', padding: '0 12px' }}>
        <LogoPsique />
        <span style={{ color: 'white', fontSize: '18px', fontWeight: '600', letterSpacing: '0.3px' }}>Psique</span>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 10px' }}>
        {itens.map((item) => {
          const isPerfil = item.id === 'perfil'
          const isAtivo = item.id === itemAtivo

          if (isPerfil) {
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                style={{
                  width: '207px',
                  height: '53px',
                  borderRadius: '99px',
                  border: '1px solid #A7A7A7',
                  background: '#ECECEC',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '0 12px',
                  color: isAtivo ? '#1E293B' : '#64748B',
                  fontSize: '13px',
                  fontWeight: isAtivo ? '600' : '400',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span style={{ flexShrink: 0, color: isAtivo ? '#1E293B' : '#64748B' }}>{item.icone}</span>
                <span>{item.label}</span>
              </button>
            )
          }

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 12px',
                background: isAtivo ? 'rgba(255,255,255,0.20)' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                color: isAtivo ? 'white' : 'rgba(255,255,255,0.72)',
                fontSize: '13px',
                fontWeight: isAtivo ? '600' : '400',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{ flexShrink: 0 }}>{item.icone}</span>
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div style={{ flex: 1 }} />

      {/* Sair da conta */}
      <button
        onClick={() => navigate('/login')}
        style={{
          width: '164px',
          height: '53px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          marginTop: 'auto',
          marginBottom: '24px',
          marginLeft: '16px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {/* Ícone de saída */}
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.875 30.375C16.875 30.6734 16.7565 30.9595 16.5455 31.1705C16.3345 31.3815 16.0484 31.5 15.75 31.5H6.75C6.45163 31.5 6.16548 31.3815 5.95451 31.1705C5.74353 30.9595 5.625 30.6734 5.625 30.375V5.625C5.625 5.32663 5.74353 5.04048 5.95451 4.82951C6.16548 4.61853 6.45163 4.5 6.75 4.5H15.75C16.0484 4.5 16.3345 4.61853 16.5455 4.82951C16.7565 5.04048 16.875 5.32663 16.875 5.625C16.875 5.92337 16.7565 6.20952 16.5455 6.42049C16.3345 6.63147 16.0484 6.75 15.75 6.75H7.875V29.25H15.75C16.0484 29.25 16.3345 29.3685 16.5455 29.5795C16.7565 29.7905 16.875 30.0766 16.875 30.375ZM32.2959 17.2041L26.6709 11.5791C26.4598 11.368 26.1735 11.2494 25.875 11.2494C25.5765 11.2494 25.2902 11.368 25.0791 11.5791C24.868 11.7902 24.7494 12.0765 24.7494 12.375C24.7494 12.6735 24.868 12.9598 25.0791 13.1709L28.7845 16.875H15.75C15.4516 16.875 15.1655 16.9935 14.9545 17.2045C14.7435 17.4155 14.625 17.7016 14.625 18C14.625 18.2984 14.7435 18.5845 14.9545 18.7955C15.1655 19.0065 15.4516 19.125 15.75 19.125H28.7845L25.0791 22.8291C24.868 23.0402 24.7494 23.3265 24.7494 23.625C24.7494 23.9235 24.868 24.2098 25.0791 24.4209C25.2902 24.632 25.5765 24.7506 25.875 24.7506C26.1735 24.7506 26.4598 24.632 26.6709 24.4209L32.2959 18.7959C32.4005 18.6915 32.4835 18.5674 32.5401 18.4308C32.5967 18.2942 32.6259 18.1478 32.6259 18C32.6259 17.8522 32.5967 17.7058 32.5401 17.5692C32.4835 17.4326 32.4005 17.3085 32.2959 17.2041Z" fill="white" />
        </svg>

        {/* Texto "Sair da conta" */}
        <span style={{
          color: 'white',
          fontFamily: 'Poppins',
          fontSize: '16px',
          fontStyle: 'normal',
          fontWeight: '700',
          lineHeight: '14px',
          textDecoration: 'none',
        }}>Sair da conta</span>
      </button>
    </aside>
  )
}

// ─── Campo editável (com estilos atualizados) ────────────────────────────────

const estiloInput: React.CSSProperties = {
  width: '100%', padding: '8px 12px', border: '1px solid #D1D5DB',
  borderRadius: '8px', fontSize: '13px', color: '#1E293B',
  outline: 'none', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif',
}

function CampoEditavel({
  label, valor, editando, valorEditando, erro,
  onEditar, onCancelar, onSalvar, onChangeValor, multiline = false,
}: {
  label: string
  valor: string
  editando: boolean
  valorEditando: string
  erro: string
  onEditar: () => void
  onCancelar: () => void
  onSalvar: () => void
  onChangeValor: (v: string) => void
  multiline?: boolean
}) {
  return (
    <div style={{ marginBottom: '13px', paddingBottom: '13px', borderBottom: '1px solid #F1F5F9' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <p style={{
          color: '#64748B',
          fontFamily: 'Inter',
          fontSize: '12px',
          fontStyle: 'normal',
          fontWeight: '600',
          lineHeight: '16px',
          textTransform: 'uppercase',
          margin: '0 0 4px 0',
        }}>
          {label}
        </p>
        {!editando && (
          <button
            onClick={onEditar}
            style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px' }}
            aria-label={`Editar ${label}`}
          >
            <IconeEditar size={14} color="#0D9488" />
          </button>
        )}
      </div>

      {editando ? (
        <div>
          {multiline ? (
            <textarea
              value={valorEditando}
              onChange={e => onChangeValor(e.target.value)}
              rows={3}
              style={{ ...estiloInput, resize: 'vertical' }}
            />
          ) : (
            <input
              type="text"
              value={valorEditando}
              onChange={e => onChangeValor(e.target.value)}
              style={estiloInput}
              autoFocus
            />
          )}
          {erro && <p style={{ fontSize: '12px', color: '#EF4444', margin: '4px 0 0 0', fontFamily: 'Inter' }}>{erro}</p>}
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button
              onClick={onSalvar}
              style={{
                padding: '6px 16px', backgroundColor: '#0D9488', color: 'white',
                border: 'none', borderRadius: '6px', fontSize: '12px',
                fontWeight: '600', cursor: 'pointer', fontFamily: 'Inter',
              }}
            >
              Salvar
            </button>
            <button
              onClick={onCancelar}
              style={{
                padding: '6px 14px', backgroundColor: 'white', color: '#374151',
                border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '12px',
                cursor: 'pointer', fontFamily: 'Inter',
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <p style={{
          color: '#1E293B',
          fontFamily: 'Inter',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: '400',
          lineHeight: '20px',
          margin: 0,
        }}>{valor}</p>
      )}
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function EditarPerfilProfissional() {
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
    if (!novaSenha) { setErroSenha('Digite a nova senha'); return }
    if (!senhaAtual) { setErroSenha('Digite sua senha atual'); return }
    if (senhaAtual !== '123456') {
      setErroSenha('Senha atual incorreta')
      return
    }
    setModalSenhaAberto(false)
    mostrarSucesso('Senha atualizada com sucesso!')
  }

  const camposProfissional = [
    { campo: 'nome', label: 'NOME COMPLETO' },
    { campo: 'email', label: 'E-MAIL' },
    { campo: 'telefone', label: 'TELEFONE' },
    { campo: 'dataNascimento', label: 'DATA DE NASCIMENTO' },
    { campo: 'cpf', label: 'CPF' },
    { campo: 'genero', label: 'GÊNERO' },
    { campo: 'registroProfissional', label: 'REGISTRO PROFISSIONAL' },
    { campo: 'endereco', label: 'ENDEREÇO' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F0F4F8' }}>

      <SidebarProfissional navigate={navigate} itemAtivo="perfil" />

      <main style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

        {/* TOPBAR */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '28px 32px 20px', backgroundColor: '#ffffff',
          borderBottom: '1px solid #E2E8F0',
        }}>
          <button
            onClick={() => navigate('/perfil/profissional')}
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

          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px -1px rgba(0, 0, 0, 0.10)',
            maxHeight: 'calc(100vh - 280px)',
            overflowY: 'auto',
            /* Estilos da barra de rolagem minimalista */
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(100, 116, 139, 0.3) transparent',
          }}>

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
                  fontWeight: '600', color: '#1E293B', margin: '0 0 4px 0',
                  fontFamily: 'Inter', fontSize: '16px',
                }}>{dados.nome}</p>
                <p style={{
                  fontSize: '13px', color: '#64748B', margin: 0,
                  fontFamily: 'Inter',
                }}>Conta de Profissional</p>
              </div>
            </div>

            {/* DESCRIÇÃO PROFISSIONAL */}
            <CampoEditavel
              label="DESCRIÇÃO PROFISSIONAL"
              valor={dados.descricao}
              editando={campoEditando === 'descricao'}
              valorEditando={valorEditando}
              erro={campoEditando === 'descricao' ? erroValidacao : ''}
              onEditar={() => abrirEdicao('descricao', dados.descricao)}
              onCancelar={cancelarEdicao}
              onSalvar={salvarCampo}
              onChangeValor={setValorEditando}
              multiline
            />

            {/* CAMPOS EDITÁVEIS */}
            {camposProfissional.map(({ campo, label }) => (
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