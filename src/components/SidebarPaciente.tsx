// Ícones da sidebar
function IconeHome({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
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

function IconeDiario({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  )
}

function IconeAgenda({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
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

// Logo oficial do Psique
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


function SidebarPaciente({ navigate, itemAtivo }: { navigate: (path: string) => void; itemAtivo: string }) {
  const itens = [
    { icone: <IconeHome />, label: 'Home', id: 'home', path: '/' },
    { icone: <IconeDiario />, label: 'Diário', id: 'diario', path: '/diario' },
    { icone: <IconeAgenda />, label: 'Agenda', id: 'agenda', path: '/agenda' },
    { icone: <IconeEstatisticas />, label: 'Estatísticas', id: 'estatisticas', path: '/estatisticas' },
    { icone: <IconeChat />, label: 'Chat', id: 'chat', path: '/chat' },
    { icone: <IconeLigacao />, label: 'Ligação', id: 'ligacao', path: '/ligacao' },
    { icone: <IconePerfil />, label: 'Perfil', id: 'perfil', path: '/perfil/paciente' },
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
      {/* Logo */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', marginBottom: '32px', padding: '0 12px' }}>
        <LogoPsique />
      </div>

      {/* Itens de navegação */}
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

      {/* Sair da conta */}
      <button
        onClick={() => navigate('/login')}
        style={{
          marginTop: 'auto',
          marginBottom: '24px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '9px 22px',
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.72)',
          fontSize: '13px',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <IconeSair size={16} color="rgba(255,255,255,0.72)" />
        <span>Sair da conta</span>
      </button>
    </aside>
  )
}

export default SidebarPaciente 