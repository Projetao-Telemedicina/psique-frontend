// UC05 - Deletar Cadastro de Usuário
// Fluxo: aviso → confirmação de senha → conta deletada
// FE02: bloqueio se tiver consultas em aberto

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// TODO: substituir pelo tipo real do usuário autenticado
const TIPO_USUARIO = 'paciente' // 'paciente' ou 'profissional'

// TODO: verificar pela API se o usuário tem consultas futuras agendadas
const TEM_CONSULTAS_ABERTAS = false

type Passo = 'aviso' | 'senha' | 'sucesso'

// ─── SVG Icons ───────────────────────────────────────────────────────────────

function IconeAlerta({ size = 32, color = '#EF4444' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

function IconeCadeado({ size = 32, color = '#0D9488' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function IconeCheckCircle({ size = 32, color = '#0D9488' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function IconeX({ size = 14, color = '#EF4444' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
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

function IconePerfil({ size = 17, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

// Logo oficial do Psique (igual ao arquivo do projeto)
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
// ─── Componente principal ─────────────────────────────────────────────────────

export default function DeletarConta() {
  const navigate = useNavigate()
  const [passo, setPasso] = useState<Passo>('aviso')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  // Caminho de volta para o perfil dependendo do tipo de usuário
  const caminhoPerfilVoltar = TIPO_USUARIO === 'paciente' ? '/perfil/paciente' : '/perfil/profissional'

  function confirmarExclusao() {
    // FE02: não pode excluir com consultas abertas
    if (TEM_CONSULTAS_ABERTAS) {
      setErro('Não é possível excluir a conta com consultas em aberto. Cancele suas consultas futuras primeiro.')
      return
    }
    setPasso('senha')
    setErro('')
  }

  function enviarSenha() {
    if (!senha) { setErro('Digite sua senha'); return }

    setCarregando(true)
    // TODO: chamar API para validar senha e deletar a conta
    setTimeout(() => {
      if (senha !== '123456') { // TODO: remover esse mock, validar pela API
        setCarregando(false)
        setErro('Senha inválida')
        return
      }
      setCarregando(false)
      setPasso('sucesso')
    }, 1200)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F0F4F8' }}>

      {/* SIDEBAR — igual ao padrão do projeto */}
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', marginBottom: '32px', padding: '0 12px' }}>
          <LogoPsique />
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 10px' }}>
          <button
            onClick={() => navigate(caminhoPerfilVoltar)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
              padding: '9px 12px', background: 'rgba(255,255,255,0.20)',
              border: 'none', borderRadius: '8px',
              color: 'white', fontSize: '13px', fontWeight: '600',
              cursor: 'pointer', textAlign: 'left',
            }}
          >
            <IconePerfil size={17} color="white" />
            <span>Perfil</span>
          </button>
        </nav>

        <div style={{ flex: 1 }} />

        <button
          onClick={() => navigate('/login')}
          style={{
            marginBottom: '24px', width: '100%',
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '9px 22px', background: 'none', border: 'none',
            color: 'rgba(255,255,255,0.72)', fontSize: '13px', cursor: 'pointer', textAlign: 'left',
          }}
        >
          <IconeSair size={16} />
          <span>Sair da conta</span>
        </button>
      </aside>

      {/* CONTEÚDO */}
      <main style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

        {/* PASSO 1: AVISO */}
        {passo === 'aviso' && (
          <div style={{
            backgroundColor: 'white', borderRadius: '12px', padding: '40px',
            maxWidth: '480px', width: '100%', border: '1px solid #E2E8F0',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)', textAlign: 'center',
          }}>
            {/* Ícone de alerta */}
            <div style={{
              width: '70px', height: '70px', borderRadius: '50%',
              backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto 20px auto',
            }}>
              <IconeAlerta size={32} color="#EF4444" />
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1E293B', margin: '0 0 10px 0' }}>
              Excluir sua conta?
            </h2>
            <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 24px 0' }}>
              Esta ação é <strong>permanente e irreversível</strong>. Seus dados serão removidos conforme nossa política de privacidade.
            </p>

            {/* Lista de consequências */}
            <div style={{
              backgroundColor: '#FEF2F2', border: '1px solid #FECACA',
              borderRadius: '8px', padding: '16px', marginBottom: '24px', textAlign: 'left',
            }}>
              {[
                'Seu perfil deixará de ser visível no sistema',
                'Consultas futuras precisam ser canceladas antes',
                'Seu histórico de consultas ficará anonimizado',
                'Não é possível recuperar a conta depois',
              ].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ flexShrink: 0, marginTop: '1px' }}>
                    <IconeX size={13} color="#EF4444" />
                  </span>
                  <span style={{ fontSize: '13px', color: '#B91C1C' }}>{item}</span>
                </div>
              ))}
            </div>

            {/* Erro (ex: consultas abertas — FE02) */}
            {erro && (
              <div style={{
                backgroundColor: '#FEF2F2', border: '1px solid #FECACA',
                borderRadius: '8px', padding: '12px 16px', marginBottom: '16px',
                fontSize: '13px', color: '#B91C1C',
              }}>
                {erro}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={confirmarExclusao}
                style={{
                  width: '100%', padding: '12px', backgroundColor: '#EF4444', color: 'white',
                  border: 'none', borderRadius: '8px', fontSize: '14px',
                  fontWeight: '600', cursor: 'pointer',
                }}
              >
                Sim, excluir minha conta
              </button>
              <button
                onClick={() => navigate(caminhoPerfilVoltar)}
                style={{
                  width: '100%', padding: '12px', backgroundColor: 'white', color: '#374151',
                  border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '14px',
                  fontWeight: '500', cursor: 'pointer',
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* PASSO 2: CONFIRMAÇÃO DE SENHA */}
        {passo === 'senha' && (
          <div style={{
            backgroundColor: 'white', borderRadius: '12px', padding: '40px',
            maxWidth: '400px', width: '100%', border: '1px solid #E2E8F0',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)', textAlign: 'center',
          }}>
            {/* Ícone de cadeado */}
            <div style={{
              width: '70px', height: '70px', borderRadius: '50%',
              backgroundColor: '#F0FAFA', display: 'flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto 20px auto',
            }}>
              <IconeCadeado size={32} color="#0D9488" />
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1E293B', margin: '0 0 8px 0' }}>
              Confirme sua identidade
            </h2>
            <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 24px 0' }}>
              Por segurança, digite sua senha para confirmar a exclusão.
            </p>

            <div style={{ textAlign: 'left', marginBottom: '8px' }}>
              <label style={{ fontSize: '11px', color: '#374151', fontWeight: '600', display: 'block', marginBottom: '6px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Senha
              </label>
              <input
                type="password"
                value={senha}
                onChange={e => { setSenha(e.target.value); setErro('') }}
                placeholder="••••••••"
                onKeyDown={e => e.key === 'Enter' && enviarSenha()}
                style={{
                  width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB',
                  borderRadius: '8px', fontSize: '13px', outline: 'none',
                  boxSizing: 'border-box', fontFamily: 'inherit', color: '#1E293B',
                }}
              />
              {erro && <p style={{ fontSize: '13px', color: '#EF4444', margin: '4px 0 0 0' }}>{erro}</p>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
              <button
                onClick={enviarSenha}
                disabled={carregando}
                style={{
                  width: '100%', padding: '12px',
                  backgroundColor: carregando ? '#FCA5A5' : '#EF4444',
                  color: 'white', border: 'none', borderRadius: '8px',
                  fontSize: '14px', fontWeight: '600', cursor: carregando ? 'not-allowed' : 'pointer',
                }}
              >
                {carregando ? 'Excluindo...' : 'Confirmar exclusão'}
              </button>
              <button
                onClick={() => { setPasso('aviso'); setSenha(''); setErro('') }}
                style={{
                  width: '100%', padding: '12px', backgroundColor: 'white', color: '#374151',
                  border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '14px', cursor: 'pointer',
                }}
              >
                Voltar
              </button>
            </div>
          </div>
        )}

        {/* PASSO 3: SUCESSO */}
        {passo === 'sucesso' && (
          <div style={{
            backgroundColor: 'white', borderRadius: '12px', padding: '40px',
            maxWidth: '400px', width: '100%', border: '1px solid #E2E8F0',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)', textAlign: 'center',
          }}>
            {/* Ícone de check */}
            <div style={{
              width: '70px', height: '70px', borderRadius: '50%',
              backgroundColor: '#F0FAFA', display: 'flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto 20px auto',
            }}>
              <IconeCheckCircle size={32} color="#0D9488" />
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1E293B', margin: '0 0 10px 0' }}>
              Conta excluída
            </h2>
            <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 24px 0' }}>
              Sua conta foi removida com sucesso. Obrigado por ter usado o Psique.
            </p>
            <button
              onClick={() => navigate('/login')}
              style={{
                width: '100%', padding: '12px', backgroundColor: '#0D9488', color: 'white',
                border: 'none', borderRadius: '8px', fontSize: '14px',
                fontWeight: '600', cursor: 'pointer',
              }}
            >
              Ir para o início
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
