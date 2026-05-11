// UC07 - Visualizar Cadastro de Profissional
// Fluxo principal: profissional vê todos os seus dados
// FA01: paciente sem vínculo vê só dados públicos (nome, foto, descrição, avaliações)
// FA02: paciente com vínculo vê dados públicos + registro profissional

import { useNavigate } from 'react-router-dom'

// TODO: substituir pelo usuário real vindo da autenticação
const TIPO_USUARIO = 'profissional' // 'profissional' ou 'paciente'
const PACIENTE_TEM_VINCULO = true   // só importa quando TIPO_USUARIO = 'paciente'

// TODO: substituir pelos dados reais vindos da API
const dadosProfissional = {
  nome: 'João Silva',
  tipoConta: 'Conta de Profissional',
  especialidade: 'Psicólogo Clínico',
  descricao: 'Psicólogo clínico com mais de 5 anos de experiência em terapia cognitivo-comportamental.',
  email: 'joao@email.com',
  telefone: '(11) 98765-4321',
  dataNascimento: '15/04/1998',
  cpf: '155.558.344-55',
  registroProfissional: 'CRP 07/000000',
  genero: 'Homem Cis',
  endereco: 'Boa Viagem, Recife - PE',
  score: 3.6,
  totalAvaliacoes: 25,
  documentos: [
    { nome: 'Doc_Identidade.pdf', tamanho: '1.6 MB' },
  ],
  foto: null as string | null,
  atendimentoAtivo: true,
}

// ─── SVG Icons ───────────────────────────────────────────────────────────────

function IconeEmergencia({ size = 14, color = 'white' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

function IconeLixeira({ size = 15, color = 'white' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
}

function IconeEditar({ size = 15, color = '#374151' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function IconeEstrela({ size = 14, color = '#F59E0B', filled = false }: { size?: number; color?: string; filled?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function IconeCheck({ size = 14, color = '#22C55E' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function IconeCartao({ size = 14, color = '#94A3B8' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  )
}

function IconeUsuario({ size = 50, color = 'white' }: { size?: number; color?: string }) {
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

// ─── Campo de perfil ──────────────────────────────────────────────────────────

function CampoPerfil({ label, valor, ultimo = false }: { label: string; valor: string; ultimo?: boolean }) {
  return (
    <div style={{
      paddingBottom: ultimo ? 0 : '14px',
      marginBottom: ultimo ? 0 : '14px',
      borderBottom: ultimo ? 'none' : '1px solid #F1F5F9',
      alignSelf: 'stretch',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
    }}>
      <p style={{
        color: '#64748B',
        fontFamily: 'Inter',
        fontSize: '12px',
        fontStyle: 'normal',
        fontWeight: '600',
        lineHeight: '16px',
        textTransform: 'uppercase',
        margin: '0 0 4px 0',
        alignSelf: 'stretch',
        textAlign: 'left',
      }}>
        {label}
      </p>
      <p style={{
        color: '#1E293B',
        fontFamily: 'Inter',
        fontSize: '14px',
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: '20px',
        margin: 0,
        alignSelf: 'stretch',
        textAlign: 'left',
      }}>
        {valor}
      </p>
    </div>
  )
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

function SidebarProfissional({
  navigate,
  itemAtivo,
  atendimentoAtivo,
}: {
  navigate: (path: string) => void
  itemAtivo: string
  atendimentoAtivo: boolean
}) {
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

      <div style={{ padding: '12px 16px 14px' }}>
        <p style={{
          color: '#FFF',
          fontFamily: 'Poppins',
          fontSize: '16px',
          fontStyle: 'normal',
          fontWeight: '700',
          lineHeight: '18px',
          margin: '0 0 12px 0',
        }}>Atendimento</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            onClick={() => { }}
            style={{
              width: '93px',
              height: '42px',
              borderRadius: '39px',
              background: '#D9D9D9',
              cursor: 'pointer',
              position: 'relative',
              flexShrink: 0,
              transition: 'background 0.2s',
            }}
          >
            <div style={{
              width: '33px',
              height: '33px',
              position: 'absolute',
              top: '4.5px',
              left: atendimentoAtivo ? '56px' : '4.5px',
              transition: 'left 0.2s',
            }}>
              <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16.5" cy="16.5" r="16.5" fill="#BF4D00" />
              </svg>
            </div>
          </div>
          <span style={{
            color: '#FFF',
            fontFamily: 'Poppins',
            fontSize: '16px',
            fontStyle: 'normal',
            fontWeight: '700',
            lineHeight: '18px',
          }}>
            {atendimentoAtivo ? 'ON' : 'OFF'}
          </span>
        </div>
      </div>

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
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.875 30.375C16.875 30.6734 16.7565 30.9595 16.5455 31.1705C16.3345 31.3815 16.0484 31.5 15.75 31.5H6.75C6.45163 31.5 6.16548 31.3815 5.95451 31.1705C5.74353 30.9595 5.625 30.6734 5.625 30.375V5.625C5.625 5.32663 5.74353 5.04048 5.95451 4.82951C6.16548 4.61853 6.45163 4.5 6.75 4.5H15.75C16.0484 4.5 16.3345 4.61853 16.5455 4.82951C16.7565 5.04048 16.875 5.32663 16.875 5.625C16.875 5.92337 16.7565 6.20952 16.5455 6.42049C16.3345 6.63147 16.0484 6.75 15.75 6.75H7.875V29.25H15.75C16.0484 29.25 16.3345 29.3685 16.5455 29.5795C16.7565 29.7905 16.875 30.0766 16.875 30.375ZM32.2959 17.2041L26.6709 11.5791C26.4598 11.368 26.1735 11.2494 25.875 11.2494C25.5765 11.2494 25.2902 11.368 25.0791 11.5791C24.868 11.7902 24.7494 12.0765 24.7494 12.375C24.7494 12.6735 24.868 12.9598 25.0791 13.1709L28.7845 16.875H15.75C15.4516 16.875 15.1655 16.9935 14.9545 17.2045C14.7435 17.4155 14.625 17.7016 14.625 18C14.625 18.2984 14.7435 18.5845 14.9545 18.7955C15.1655 19.0065 15.4516 19.125 15.75 19.125H28.7845L25.0791 22.8291C24.868 23.0402 24.7494 23.3265 24.7494 23.625C24.7494 23.9235 24.868 24.2098 25.0791 24.4209C25.2902 24.632 25.5765 24.7506 25.875 24.7506C26.1735 24.7506 26.4598 24.632 26.6709 24.4209L32.2959 18.7959C32.4005 18.6915 32.4835 18.5674 32.5401 18.4308C32.5967 18.2942 32.6259 18.1478 32.6259 18C32.6259 17.8522 32.5967 17.7058 32.5401 17.5692C32.4835 17.4326 32.4005 17.3085 32.2959 17.2041Z" fill="white" />
        </svg>
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

// ─── Tela principal ───────────────────────────────────────────────────────────

export default function VisualizarPerfilProfissional() {
  const navigate = useNavigate()
  const ehProprioProfissional = TIPO_USUARIO === 'profissional'
  const mostrarRegistro = ehProprioProfissional || (TIPO_USUARIO === 'paciente' && PACIENTE_TEM_VINCULO)
  const mostrarScore = dadosProfissional.totalAvaliacoes >= 3

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F0F4F8' }}>
      <SidebarProfissional
        navigate={navigate}
        itemAtivo="perfil"
        atendimentoAtivo={dadosProfissional.atendimentoAtivo}
      />

      <main style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {/* TOPBAR */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          padding: '28px 32px 20px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #E2E8F0',
        }}>
          <div style={{ width: '100%' }}>
            <h1 style={{
              color: '#1E293B',
              fontFamily: 'Inter',
              fontSize: '30px',
              fontStyle: 'normal',
              fontWeight: '700',
              lineHeight: '36px',
              margin: 0,
              textAlign: 'left',
            }}>Meu Perfil</h1>
            <p style={{
              color: '#64748B',
              fontFamily: 'Inter',
              fontSize: '16px',
              fontStyle: 'normal',
              fontWeight: '400',
              lineHeight: '24px',
              margin: '4px 0 0 0',
              textAlign: 'left',
            }}>Gerencie suas informações pessoais.</p>
          </div>
        </div>

        {/* CORPO */}
        <div style={{ padding: '24px 32px', flex: 1 }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            {/* CARD PRINCIPAL */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '24px',
              flex: 1,
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px -1px rgba(0, 0, 0, 0.10)',
              maxHeight: 'calc(100vh - 180px)',
              overflowY: 'auto',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(100, 116, 139, 0.3) transparent',
            }}>
              {/* Foto + info + card match — linha principal */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '32px',
                marginBottom: '24px',
                flexWrap: 'wrap',
              }}>

                {/* COLUNA ESQUERDA: foto + nome + tipo de conta + estrelas */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  flexShrink: 0,
                }}>
                  {/* Foto de perfil */}
                  <div style={{
                    width: '138px',
                    height: '138px',
                    borderRadius: '69px',
                    background: dadosProfissional.foto
                      ? `url("${dadosProfissional.foto}") lightgray 50% / cover no-repeat`
                      : '#0D9488',
                    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 4px 4px 0 rgba(0, 0, 0, 0.20), 0 0 30px 12px rgba(0, 0, 0, 0.12)',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {!dadosProfissional.foto && <IconeUsuario size={50} color="white" />}
                  </div>

                  {/* Nome */}
                  <p style={{
                    color: '#1E293B',
                    fontFamily: 'Inter',
                    fontSize: '24px',
                    fontStyle: 'normal',
                    fontWeight: '700',
                    lineHeight: '32px',
                    margin: 0,
                    textAlign: 'center',
                  }}>{dadosProfissional.nome}</p>

                  {/* Conta de Profissional */}
                  <p style={{
                    color: '#012765',
                    fontFamily: 'Inter',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: '500',
                    lineHeight: '20px',
                    margin: 0,
                    textAlign: 'center',
                  }}>{dadosProfissional.tipoConta}</p>

                  {/* Estrelas e avaliações */}
                  {mostrarScore ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg width="94" height="18" viewBox="0 0 94 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.48616 0L10.3914 6.21885H16.557L11.5689 10.0623L13.4742 16.2812L8.48616 12.4377L3.49812 16.2812L5.40338 10.0623L0.415342 6.21885H6.5809L8.48616 0Z" fill="#FFAE00" />
                        <path d="M27.7215 0L29.6268 6.21885H35.7923L30.8043 10.0623L32.7096 16.2812L27.7215 12.4377L22.7335 16.2812L24.6387 10.0623L19.6507 6.21885H25.8162L27.7215 0Z" fill="#FFAE00" />
                        <path d="M46.9569 0L48.8621 6.21885H55.0277L50.0396 10.0623L51.9449 16.2812L46.9569 12.4377L41.9688 16.2812L43.8741 10.0623L38.886 6.21885H45.0516L46.9569 0Z" fill="#FFAE00" />
                        <path d="M66.1922 0L68.0975 6.21885H74.263L69.275 10.0623L71.1803 16.2812L66.1922 12.4377L61.2042 16.2812L63.1094 10.0623L58.1214 6.21885H64.287L66.1922 0Z" fill="#2F2F2F" />
                        <path d="M85.4276 0L87.3328 6.21885H93.4984L88.5103 10.0623L90.4156 16.2812L85.4276 12.4377L80.4395 16.2812L82.3448 10.0623L77.3567 6.21885H83.5223L85.4276 0Z" fill="#2F2F2F" />
                      </svg>
                      <span style={{
                        color: '#64748B',
                        fontFamily: 'Inter',
                        fontSize: '14px',
                        fontWeight: '700',
                        lineHeight: '20px',
                      }}>{dadosProfissional.score.toFixed(1)}</span>
                      <span style={{
                        color: '#64748B',
                        fontFamily: 'Inter',
                        fontSize: '14px',
                        fontWeight: '400',
                        lineHeight: '20px',
                      }}>({dadosProfissional.totalAvaliacoes} avaliações)</span>
                    </div>
                  ) : (
                    <p style={{ fontSize: '12px', color: '#94A3B8', fontStyle: 'italic', margin: 0 }}>Novo Profissional</p>
                  )}
                </div>

                {/* COLUNA DIREITA: card "Seus pacientes não condizem..." */}
                <div style={{
                  width: '333px',
                  height: '182px',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.00)',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px -1px rgba(0, 0, 0, 0.10)',
                  padding: '16px 20px',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: '12px',
                  flexShrink: 0,
                }}>
                  <p style={{
                    fontSize: '13px',
                    color: '#374151',
                    margin: 0,
                    fontWeight: '500',
                    lineHeight: '1.5',
                  }}>
                    Seus pacientes não condizem com sua especialidade?
                  </p>
                  <button
                    onClick={() => { }}
                    style={{
                      backgroundColor: '#0D9488',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      width: '100%',
                    }}
                  >
                    Refazer questionário de match
                  </button>
                </div>

              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #F1F5F9', marginBottom: '16px', marginTop: '24px' }} />

              {/* CAMPOS */}
              <CampoPerfil label="DESCRIÇÃO PROFISSIONAL" valor={dadosProfissional.descricao} />
              <CampoPerfil label="NOME COMPLETO" valor={dadosProfissional.nome} />
              <CampoPerfil label="E-MAIL" valor={dadosProfissional.email} />
              <CampoPerfil label="TELEFONE" valor={dadosProfissional.telefone} />
              <CampoPerfil label="DATA DE NASCIMENTO" valor={dadosProfissional.dataNascimento} />
              <CampoPerfil label="CPF" valor={dadosProfissional.cpf} />

              {mostrarRegistro && (
                <CampoPerfil label="REGISTRO PROFISSIONAL" valor={dadosProfissional.registroProfissional} />
              )}

              {ehProprioProfissional && (
                <>
                  <CampoPerfil label="GÊNERO" valor={dadosProfissional.genero} />

                  {/* DOCUMENTOS ANEXADOS */}
                  <div style={{
                    alignSelf: 'stretch',
                    marginBottom: '14px',
                    paddingBottom: '14px',
                    borderBottom: '1px solid #F1F5F9',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}>
                    <p style={{
                      color: '#64748B',
                      fontFamily: 'Inter',
                      fontSize: '12px',
                      fontWeight: '600',
                      lineHeight: '16px',
                      textTransform: 'uppercase',
                      margin: '0 0 12px 0',
                      alignSelf: 'stretch',
                      textAlign: 'left',
                    }}>DOCUMENTOS ANEXADOS</p>

                    {dadosProfissional.documentos.map((doc) => (
                      <div key={doc.nome} style={{
                        display: 'flex',
                        width: '287px',
                        height: '74px',
                        padding: '16px',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderRadius: '24px',
                        border: '1px solid rgba(226, 232, 240, 0.80)',
                        background: '#F8FAFC',
                        marginBottom: '8px',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            display: 'flex',
                            width: '40px',
                            height: '40px',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: '12px',
                            background: '#FFE2E2',
                          }}>
                            <svg width="15" height="19" viewBox="0 0 15 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M2.49967 17.4997C1.5792 17.4997 0.833008 16.7535 0.833008 15.833V2.49968C0.833008 1.5792 1.5792 0.83301 2.49967 0.83301H9.16634C9.69915 0.832147 10.2103 1.04392 10.5863 1.42134L13.5763 4.41134C13.9548 4.78755 14.1672 5.29939 14.1663 5.83301V15.833C14.1663 16.7535 13.4201 17.4997 12.4997 17.4997H2.49967" stroke="#E7000B" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          <div>
                            <p style={{ color: '#1E293B', fontFamily: 'Inter', fontSize: '14px', fontWeight: '700', margin: 0 }}>{doc.nome}</p>
                            <p style={{ color: '#64748B', fontFamily: 'Inter', fontSize: '12px', fontWeight: '400', margin: 0 }}>{doc.tamanho}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => { }}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '9999px',
                            background: 'rgba(255, 255, 255, 0.00)',
                            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px -1px rgba(0, 0, 0, 0.10)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            border: 'none',
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.20248 7.20297C1.15386 7.072 1.15386 6.92793 1.20248 6.79697C2.17082 4.449 4.45983 2.91699 6.99964 2.91699C9.53946 2.91699 11.8285 4.449 12.7968 6.79697C12.8454 6.92793 12.8454 7.072 12.7968 7.20297C11.8285 9.55094 9.53946 11.0829 6.99964 11.0829C4.45983 11.0829 2.17082 9.55094 1.20248 7.20297" stroke="#3B82F6" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M5.25 7C5.25 7.96585 6.03415 8.75 7 8.75C7.96585 8.75 8.75 7.96585 8.75 7C8.75 6.03415 7.96585 5.25 7 5.25C6.03415 5.25 5.25 6.03415 5.25 7V7" stroke="#3B82F6" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>

                  <CampoPerfil label="ENDEREÇO" valor={dadosProfissional.endereco} ultimo />
                </>
              )}

              {/* BOTÕES DE AÇÃO */}
              {ehProprioProfissional && (
                <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                  <button
                    onClick={() => navigate('/conta/excluir')}
                    style={{
                      width: '307px',
                      height: '38px',
                      borderRadius: '9999px',
                      background: '#EF4444',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px -1px rgba(0, 0, 0, 0.10)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      border: 'none',
                    }}
                  >
                    <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.625 12C2.14375 12 1.73192 11.8696 1.3895 11.6087C1.04709 11.3478 0.875586 11.0338 0.875003 10.6667V2C0.627086 2 0.41942 1.936 0.252003 1.808C0.0845864 1.68 0.00058635 1.52178 3.01724e-06 1.33333C-0.000580316 1.14489 0.0834197 0.986667 0.252003 0.858667C0.420586 0.730667 0.628253 0.666667 0.875003 0.666667H4.375C4.375 0.477778 4.459 0.319556 4.627 0.192C4.795 0.0644445 5.00267 0.000444444 5.25 0H8.75C8.99792 0 9.20587 0.0640001 9.37387 0.192C9.54187 0.32 9.62558 0.478222 9.625 0.666667H13.125C13.3729 0.666667 13.5809 0.730667 13.7489 0.858667C13.9169 0.986667 14.0006 1.14489 14 1.33333C13.9994 1.52178 13.9154 1.68022 13.748 1.80867C13.5806 1.93711 13.3729 2.00089 13.125 2V10.6667C13.125 11.0333 12.9538 11.3473 12.6114 11.6087C12.269 11.87 11.8568 12.0004 11.375 12H2.625ZM11.375 2H2.625V10.6667H11.375V2ZM6.125 5.9V8C6.125 8.18889 6.209 8.34733 6.377 8.47533C6.545 8.60333 6.75267 8.66711 7 8.66667C7.24733 8.66622 7.45529 8.60222 7.62388 8.47467C7.79246 8.34711 7.87617 8.18889 7.875 8V5.9L8.6625 6.48333C8.82292 6.60556 9.02358 6.66667 9.2645 6.66667C9.50542 6.66667 9.71308 6.6 9.8875 6.46667C10.0479 6.34444 10.1281 6.18889 10.1281 6C10.1281 5.81111 10.0479 5.65555 9.8875 5.53333L7.6125 3.8C7.4375 3.66667 7.23333 3.6 7 3.6C6.76667 3.6 6.5625 3.66667 6.3875 3.8L4.1125 5.53333C3.95208 5.65555 3.86838 5.80844 3.86138 5.992C3.85438 6.17555 3.93808 6.33378 4.1125 6.46667C4.27292 6.58889 4.47358 6.65289 4.7145 6.65867C4.95542 6.66444 5.16308 6.606 5.3375 6.48333L6.125 5.9Z" fill="white" />
                    </svg>
                    <span style={{ color: '#FFF', fontFamily: 'Inter', fontSize: '14px', fontWeight: '500' }}>Deletar conta</span>
                  </button>

                  <button
                    onClick={() => navigate('/perfil/profissional/editar')}
                    style={{
                      width: '307px',
                      height: '38px',
                      borderRadius: '9999px',
                      background: 'white',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px -1px rgba(0, 0, 0, 0.10)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      border: 'none',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14.1156 4.54126C14.8491 3.80795 14.8493 2.61709 14.116 1.8836C13.3827 1.1501 12.1918 1.14995 11.4583 1.88326L2.56097 10.7826C2.40619 10.9369 2.29172 11.127 2.22764 11.3359L1.34697 14.2373C1.31187 14.3547 1.34408 14.482 1.43084 14.5686C1.5176 14.6552 1.6449 14.6872 1.76231 14.6519L4.66431 13.7719C4.87309 13.7084 5.06309 13.5947 5.21764 13.4406L14.1156 4.54126" stroke="#1E293B" strokeWidth="1.33333" />
                    </svg>
                    <span style={{ color: '#1E293B', fontFamily: 'Inter', fontSize: '14px', fontWeight: '500' }}>Editar Informações</span>
                  </button>
                </div>
              )}
            </div>

            {/* CARD LATERAL - Plano de impulsionamento */}
            {ehProprioProfissional && (
              <div style={{ width: '432px', flexShrink: 0 }}>
                <div style={{
                  width: '432px',
                  height: '552px',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.00)',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px -1px rgba(0, 0, 0, 0.10)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ color: '#1E293B', fontFamily: 'Inter', fontSize: '20px', fontWeight: '700' }}>Plano de impulsionamento</h3>
                    <div style={{ display: 'flex', width: '32px', height: '32px', borderRadius: '9999px', background: '#F0FDF4', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M7.68324 1.5296C7.74284 1.4092 7.86556 1.33301 7.99991 1.33301C8.13426 1.33301 8.25698 1.4092 8.31658 1.5296L9.85658 4.64894C10.0622 5.06593 10.4598 5.35509 10.9199 5.42227L14.3639 5.92627C14.497 5.94556 14.6077 6.03876 14.6493 6.16667C14.6909 6.29459 14.6562 6.43503 14.5599 6.52894L12.0692 8.95427C11.7355 9.27902 11.5831 9.74732 11.6619 10.2063L12.2499 13.6329C12.2734 13.766 12.2189 13.9008 12.1096 13.9803C12.0003 14.0597 11.8552 14.0698 11.7359 14.0063L8.65724 12.3876C8.24551 12.1712 7.75364 12.1712 7.34191 12.3876L4.26391 14.0063C4.14467 14.0694 3.99989 14.0591 3.89077 13.9797C3.78166 13.9004 3.72726 13.7658 3.75058 13.6329L4.33791 10.2069C4.41691 9.74777 4.26453 9.27916 3.93058 8.95427L1.43991 6.5296C1.34278 6.4358 1.30762 6.29483 1.34929 6.1664C1.39097 6.03796 1.50221 5.94451 1.63591 5.9256L5.07924 5.42227C5.53981 5.3555 5.93798 5.06628 6.14391 4.64894L7.68324 1.5296" stroke="#22C55E" strokeWidth="1.33333" />
                      </svg>
                    </div>
                  </div>

                  <p style={{ color: '#1E293B', fontFamily: 'Inter', fontSize: '16px', fontWeight: '500', lineHeight: '28px' }}>Receba mais visibilidade para os pacientes e seja destaque nos resultados de busca.</p>

                  <div style={{
                    width: '366px',
                    height: '176px',
                    borderRadius: '24px',
                    background: 'linear-gradient(359deg, #3599D8 -50.97%, #5BB38A 99.09%)',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px -1px rgba(0, 0, 0, 0.10)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: '20px',
                  }}>
                    <p style={{ color: '#FFF', fontFamily: 'Inter', fontSize: '24px', fontWeight: '700', margin: '0 0 8px 0' }}>Plano Impulso profissional</p>
                    <p style={{ color: '#FFF', fontFamily: 'Inter', fontSize: '30px', fontWeight: '700', margin: 0 }}>R$ 29<span style={{ color: 'rgba(255,255,255,0.80)', fontSize: '14px', fontWeight: '400' }}>/mês</span></p>
                    <button style={{ width: '306px', height: '51px', borderRadius: '9999px', background: '#1E293B', marginTop: '16px', border: 'none', cursor: 'pointer', color: '#FFF', fontFamily: 'Inter', fontSize: '14px', fontWeight: '700' }}>
                      Ativar impulsionamento
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M14.5341 6.6669C15.1615 9.74591 13.5537 12.845 10.6751 14.1051C7.79655 15.3652 4.42889 14.4442 2.59228 11.8945C0.755675 9.34484 0.948825 5.85885 3.05586 3.52768C5.1629 1.19652 8.61171 0.653163 11.3334 2.22357" stroke="#22C55E" strokeWidth="1.33333" />
                      <path d="M6 7.33366L8 9.33366L14.6667 2.66699" stroke="#22C55E" strokeWidth="1.33333" />
                    </svg>
                    <span style={{ color: '#64748B', fontFamily: 'Inter', fontSize: '14px' }}>Impulsionamento ativo até: 15/11/2026</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2.66634 3.33398H13.333C14.0689 3.33398 14.6663 3.93143 14.6663 4.66732V11.334C14.6663 12.0699 14.0689 12.6673 13.333 12.6673H2.66634C1.93045 12.6673 1.33301 12.0699 1.33301 11.334V4.66732C1.33301 3.93143 1.93045 3.33398 2.66634 3.33398V3.33398" stroke="#3B82F6" strokeWidth="1.33333" />
                      <path d="M1.33301 6.66699H14.6663" stroke="#3B82F6" strokeWidth="1.33333" />
                    </svg>
                    <span style={{ color: '#64748B', fontFamily: 'Inter', fontSize: '14px' }}>Cartão final 4321</span>
                  </div>

                  <button style={{ width: '366px', height: '46px', borderRadius: '9999px', background: 'white', border: 'none', cursor: 'pointer', color: '#1E293B', fontFamily: 'Inter', fontSize: '14px', fontWeight: '700', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.10)' }}>
                    Gerenciar Assinatura
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}