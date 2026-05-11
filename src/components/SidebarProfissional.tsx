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



function SidebarProfissional({
    navigate,
    itemAtivo,
    atendimentoAtivo}: {
    navigate: (path: string) => void;
    itemAtivo: string;
    atendimentoAtivo: boolean;
}) {
    const itens = [
        { icone: <IconeHome />, label: 'Home', id: 'home', path: '/' },
        { icone: <IconeCalendario />, label: 'Agenda', id: 'agenda', path: '/agenda' },
        { icone: <IconeEstatisticas />, label: 'Estatísticas', id: 'estatisticas', path: '/estatisticas' },
        { icone: <IconeChat />, label: 'Chat', id: 'chat', path: '/chat' },
        { icone: <IconeLigacao />, label: 'Ligação', id: 'ligacao', path: '/ligacao' },
        { icone: <IconePerfil />, label: 'Perfil', id: 'perfil', path: '/perfil/profissional' },
    ];

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
            {/* Logo Section */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', marginBottom: '32px', padding: '0 12px' }}>
                <LogoPsique />
                <span style={{ color: 'white', fontSize: '18px', fontWeight: '600', letterSpacing: '0.3px' }}>Psique</span>
            </div>

            {/* Navigation Section */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 10px' }}>
                {itens.map((item) => {
                    const isPerfil = item.id === 'perfil';

                    // Lógica: O item fica visualmente ativo se for o itemAtivo atual 
                    // OU se for o item de 'ligacao' e o atendimento estiver true no banco.
                    const isAtivo = item.id === itemAtivo || (item.id === 'ligacao' && atendimentoAtivo);

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
                                    marginTop: '10px',
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
                        );
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
                                transition: '0.2s all',
                            }}
                        >
                            <span style={{ flexShrink: 0 }}>{item.icone}</span>
                            <span>{item.label}</span>

                            {/* Indicador visual extra para atendimento ativo (opcional) */}
                            {item.id === 'ligacao' && atendimentoAtivo && (
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ADE80', marginLeft: 'auto' }} />
                            )}
                        </button>
                    );
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
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.875 30.375C16.875 30.6734 16.7565 30.9595 16.5455 31.1705C16.3345 31.3815 16.0484 31.5 15.75 31.5H6.75C6.45163 31.5 6.16548 31.3815 5.95451 31.1705C5.74353 30.9595 5.625 30.6734 5.625 30.375V5.625C5.625 5.32663 5.74353 5.04048 5.95451 4.82951C6.16548 4.61853 6.45163 4.5 6.75 4.5H15.75C16.0484 4.5 16.3345 4.61853 16.5455 4.82951C16.7565 5.04048 16.875 5.32663 16.875 5.625C16.875 5.92337 16.7565 6.20952 16.5455 6.42049C16.3345 6.63147 16.0484 6.75 15.75 6.75H7.875V29.25H15.75C16.0484 29.25 16.3345 29.3685 16.5455 29.5795C16.7565 29.7905 16.875 30.0766 16.875 30.375ZM32.2959 17.2041L26.6709 11.5791C26.4598 11.368 26.1735 11.2494 25.875 11.2494C25.5765 11.2494 25.2902 11.368 25.0791 11.5791C24.868 11.7902 24.7494 12.0765 24.7494 12.375C24.7494 12.6735 24.868 12.9598 25.0791 13.1709L28.7845 16.875H15.75C15.4516 16.875 15.1655 16.9935 14.9545 17.2045C14.7435 17.4155 14.625 17.7016 14.625 18C14.625 18.2984 14.7435 18.5845 14.9545 18.7955C15.1655 19.0065 15.4516 19.125 15.75 19.125H28.7845L25.0791 22.8291C24.868 23.0402 24.7494 23.3265 24.7494 23.625C24.7494 23.9235 24.868 24.2098 25.0791 24.4209C25.2902 24.632 25.5765 24.7506 25.875 24.7506C26.1735 24.7506 26.4598 24.632 26.6709 24.4209L32.2959 18.7959C32.4005 18.6915 32.4835 18.5674 32.5401 18.4308C32.5967 18.2942 32.6259 18.1478 32.6259 18C32.6259 17.8522 32.5967 17.7058 32.5401 17.5692C32.4835 17.4326 32.4005 17.3085 32.2959 17.2041Z" fill="white" />
                </svg>
                <span style={{
                    color: 'white',
                    fontFamily: 'Poppins',
                    fontSize: '16px',
                    fontWeight: '700',
                    textDecoration: 'none',
                }}>Sair da conta</span>
            </button>
        </aside>
    );
}

export default SidebarProfissional