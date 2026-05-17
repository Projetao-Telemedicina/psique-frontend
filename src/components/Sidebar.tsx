import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

interface SidebarProps {
  role: UserRole;
  itemAtivo: string;
  atendimentoAtivo?: boolean;
}

type UserRole = 'paciente' | 'profissional' | 'administrador';

interface IconProps {
  size?: number;
  color?: string;
}

const IconWrapper = ({ children, size = 18, color = 'currentColor' }: { children: React.ReactNode } & IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const Icons = {
  Home: (p: IconProps) => <IconWrapper {...p}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></IconWrapper>,
  Diario: (p: IconProps) => <IconWrapper {...p}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></IconWrapper>,
  Agenda: (p: IconProps) => <IconWrapper {...p}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></IconWrapper>,
  Estatisticas: (p: IconProps) => <IconWrapper {...p}><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></IconWrapper>,
  Chat: (p: IconProps) => <IconWrapper {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></IconWrapper>,
  Ligacao: (p: IconProps) => <IconWrapper {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></IconWrapper>,
  Perfil: (p: IconProps) => <IconWrapper {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></IconWrapper>,

  Validacao: (p: IconProps) => <IconWrapper {...p}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></IconWrapper>,
  Usuarios: (p: IconProps) => <IconWrapper {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></IconWrapper>,
  Financeiro: (p: IconProps) => <IconWrapper {...p}><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></IconWrapper>,
  Configuracoes: (p: IconProps) => <IconWrapper {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></IconWrapper>,
  Sair: (p: IconProps) => (
    <svg width={p.size || 24} height={p.size || 24} viewBox="0 0 36 36" fill="none">
      <path d="M16.875 30.375C16.875 30.6734 16.7565 30.9595 16.5455 31.1705C16.3345 31.3815 16.0484 31.5 15.75 31.5H6.75C6.45163 31.5 6.16548 31.3815 5.95451 31.1705C5.74353 30.9595 5.625 30.6734 5.625 30.375V5.625C5.625 5.32663 5.74353 5.04048 5.95451 4.82951C6.16548 4.61853 6.45163 4.5 6.75 4.5H15.75C16.0484 4.5 16.3345 4.61853 16.5455 4.82951C16.7565 5.04048 16.875 5.32663 16.875 5.625C16.875 5.92337 16.7565 6.20952 16.5455 6.42049C16.3345 6.63147 16.0484 6.75 15.75 6.75H7.875V29.25H15.75C16.0484 29.25 16.3345 29.3685 16.5455 29.5795C16.7565 29.7905 16.875 30.0766 16.875 30.375ZM32.2959 17.2041L26.6709 11.5791C26.4598 11.368 26.1735 11.2494 25.875 11.2494C25.5765 11.2494 25.2902 11.368 25.0791 11.5791C24.868 11.7902 24.7494 12.0765 24.7494 12.375C24.7494 12.6735 24.868 12.9598 25.0791 13.1709L28.7845 16.875H15.75C15.4516 16.875 15.1655 16.9935 14.9545 17.2045C14.7435 17.4155 14.625 17.7016 14.625 18C14.625 18.2984 14.7435 18.5845 14.9545 18.7955C15.1655 19.0065 15.4516 19.125 15.75 19.125H28.7845L25.0791 22.8291C24.868 23.0402 24.7494 23.3265 24.7494 23.625C24.7494 23.9235 24.868 24.2098 25.0791 24.4209C25.2902 24.632 25.5765 24.7506 25.875 24.7506C26.1735 24.7506 26.4598 24.632 26.6709 24.4209L32.2959 18.7959C32.4005 18.6915 32.4835 18.5674 32.5401 18.4308C32.5967 18.2942 32.6259 18.1478 32.6259 18C32.6259 17.8522 32.5967 17.7058 32.5401 17.5692C32.4835 17.4326 32.4005 17.3085 32.2959 17.2041Z" fill={p.color || "white"} />
    </svg>
  )
};

const Sidebar: React.FC<SidebarProps> = ({ role, itemAtivo }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    if (logout) {
      logout();
    } else {
      localStorage.removeItem('accessToken');
    }
    navigate('/login');
  };

  const getMenuItems = () => {
    if (role === 'administrador') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: <Icons.Home />, path: '/admin/dashboard' },
        { id: 'validacoes', label: 'Validações', icon: <Icons.Validacao />, path: '/admin/validacoes' },
        { id: 'profissionais', label: 'Profissionais', icon: <Icons.Usuarios />, path: '/admin/profissionais' },
        { id: 'pacientes', label: 'Pacientes', icon: <Icons.Perfil />, path: '/admin/pacientes' },
        { id: 'financeiro', label: 'Financeiro', icon: <Icons.Financeiro />, path: '/admin/financeiro' },
        { id: 'configuracoes', label: 'Configurações', icon: <Icons.Configuracoes />, path: '/admin/configuracoes' },
      ];
    }

    return [
      { id: 'home', label: 'Home', icon: <Icons.Home />, path: '/' },
      ...(role === 'paciente' ? [{ id: 'diario', label: 'Diário', icon: <Icons.Diario />, path: '/diario' }] : []),
      { id: 'agenda', label: 'Agenda', icon: <Icons.Agenda />, path: '/agenda' },
      { id: 'estatisticas', label: 'Estatísticas', icon: <Icons.Estatisticas />, path: '/estatisticas' },
      { id: 'chat', label: 'Chat', icon: <Icons.Chat />, path: '/chat' },
      { id: 'ligacao', label: 'Ligação', icon: <Icons.Ligacao />, path: '/ligacao' },
      { id: 'perfil', label: 'Perfil', icon: <Icons.Perfil />, path: `/perfil/${role}` },
    ];
  };

  const menuItems = getMenuItems();

  return (
    <aside
      style={{
        width: '281px',
        height: '100%',
        background: 'linear-gradient(359deg, #3599D8 -50.97%, #5BB38A 99.09%)',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: '20px',
        flexShrink: 0,
      }}
    >
      {/* --- Tag de Administrador --- */}
      {role === 'administrador' && (
        <div style={{
          alignSelf: 'center',
          background: 'rgba(255, 255, 255, 0.2)',
          padding: '4px 12px',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          marginBottom: '10px'
        }}>
          <span style={{ color: 'white', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Administrador
          </span>
        </div>
      )}

      {/* --- Logo Area --- */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', marginBottom: '32px', padding: '0 12px' }}>
        <img
          src="/psique-logo-white.svg"
          alt="Logo Psique"
          style={{ width: '220px', height: '180px', objectFit: 'contain' }}
        />
      </div>

      {/* --- Navegação Unificada --- */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '0 15px' }}>
        {menuItems.map((item) => {
          const isAtivo = item.id === itemAtivo;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              style={{
                width: '100%',
                height: '45px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '0 15px',
                border: isAtivo ? '1px solid #A7A7A7' : '1px solid transparent',
                borderRadius: '99px', // Formato pílula arredondada para todos
                // Dinâmico: Se o item atual for o selecionado, ganha o fundo cinza claro. Se não, fica transparente
                background: isAtivo ? '#ECECEC' : 'transparent',
                // Dinâmico: Texto escuro no item ativo para contrastar com o cinza; texto branco nos demais
                color: isAtivo ? '#1E293B' : '#FFFFFF',
                fontSize: '14px',
                fontWeight: isAtivo ? '600' : '400',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                opacity: isAtivo ? 1 : 0.85,
              }}
            >
              {/* O stroke do ícone herda o 'color' definido acima (currentColor) */}
              <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                {item.icon}
              </span>
              <span style={{ flex: 1 }}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div style={{ flex: 1 }} />

      {/* --- Logout --- */}
      <button
        onClick={handleLogout}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '20px 25px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <Icons.Sair size={20} />
        <span style={{ color: 'white', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '500' }}>
          Sair da conta
        </span>
      </button>
    </aside>
  );
};

export default Sidebar;