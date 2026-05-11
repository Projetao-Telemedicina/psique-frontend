// UC06 - Visualizar Cadastro de Paciente
// Fluxo principal: paciente vê todos os seus dados
// FA01: profissional com vínculo vê apenas Nome, Foto, Idade, Telefone

import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import CampoPerfil from '../components/CampoPerfil'

// TODO: substituir pelo usuário real vindo da autenticação
const TIPO_USUARIO = 'paciente' // trocar para 'profissional' para ver a visão do profissional
const PROFISSIONAL_TEM_VINCULO = true

// TODO: substituir pelos dados reais vindos da API
const dadosPaciente = {
  nome: 'Luana Silva',
  tipoConta: 'Conta de Cliente',
  email: 'luana@email.com',
  telefone: '(81) 98765-4321',
  dataNascimento: '15/04/1995',
  cpf: '155.558.344-77',
  endereco: 'Boa Viagem, Recife - PE',
  foto: null as string | null, // TODO: caminho da foto real vinda da API
}

function calcularIdade(dataNasc: string): number {
  const partes = dataNasc.split('/')
  const nasc = new Date(Number(partes[2]), Number(partes[1]) - 1, Number(partes[0]))
  const hoje = new Date()
  let idade = hoje.getFullYear() - nasc.getFullYear()
  const m = hoje.getMonth() - nasc.getMonth()
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--
  return idade
}

function IconeUsuario({ size = 32, color = 'white' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

// ─── Componentes principais ───────────────────────────────────────────────────

export default function VisualizarPerfilPaciente() {
  const navigate = useNavigate()
  const ehProprioPaciente = TIPO_USUARIO === 'paciente'
  const idade = calcularIdade(dadosPaciente.dataNascimento)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F0F4F8' }}>



      {/* CONTEÚDO PRINCIPAL */}
      <main style={{ flex: 1, overflowY: 'auto', position: 'relative', display: 'flex', flexDirection: 'row' }}>

        {/* SIDEBAR */}
        <Sidebar role="paciente" navigate={navigate} itemAtivo="perfil" />



        <div style={{ flex: 1, overflowY: 'auto', position: 'relative', display: 'flex', flexDirection: 'column' }}>
        {/* TOPBAR */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          padding: '28px 32px 20px', backgroundColor: '#ffffff',
          borderBottom: '1px solid #E2E8F0',
        }}>
          <div style={{ alignSelf: 'stretch' }}>
            {/* Título "Meu Perfil" */}
            <h1 style={{
              alignSelf: 'stretch',
              color: '#1E293B',
              fontFamily: 'Inter',
              fontSize: '30px',
              fontStyle: 'normal',
              fontWeight: '700',
              lineHeight: '36px',
              margin: 0,
            }}>Meu Perfil</h1>

            {/* Descrição "Gerencie suas informações pessoais" */}
            <p style={{
              alignSelf: 'stretch',
              color: '#64748B',
              fontFamily: 'Inter',
              fontSize: '16px',
              fontStyle: 'normal',
              fontWeight: '400',
              lineHeight: '24px',
              margin: '4px 0 0 0',
            }}>Gerencie suas informações pessoais.</p>
          </div>

          {/* Botão de emergência (mantém igual) */}
          <button
            onClick={() => { /* (colocar caminho) */ }}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '8px 16px 8px 8px',
              backgroundColor: '#ffffff',
              color: '#1E293B',
              border: '1px solid #E2E8F0',
              borderRadius: '50px',
              fontSize: '13px', fontWeight: '500', cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}
          >
            <div style={{
              width: '30px', height: '30px', backgroundColor: '#BF4D00',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.1252 4.16626C13.0149 4.2234 12.8863 4.23439 12.7679 4.19681C12.6495 4.15923 12.5508 4.07617 12.4936 3.96587C12.0461 3.08197 11.3689 2.33491 10.533 1.80317C10.4809 1.77032 10.4358 1.72752 10.4002 1.67723C10.3647 1.62694 10.3394 1.57014 10.3258 1.51007C10.3122 1.45 10.3106 1.38785 10.321 1.32715C10.3314 1.26644 10.3537 1.20839 10.3865 1.1563C10.4194 1.1042 10.4622 1.05909 10.5125 1.02354C10.5628 0.987986 10.6196 0.962685 10.6796 0.949083C10.7397 0.935481 10.8018 0.933843 10.8625 0.944263C10.9233 0.954683 10.9813 0.976957 11.0334 1.00981C12.0076 1.63356 12.7986 2.50487 13.3256 3.53462C13.3827 3.64496 13.3937 3.77348 13.3561 3.89192C13.3186 4.01036 13.2355 4.10904 13.1252 4.16626ZM2.09258 4.21899C2.17845 4.21896 2.26267 4.19533 2.33603 4.15069C2.4094 4.10605 2.46909 4.04212 2.50859 3.96587C2.95602 3.08197 3.63325 2.33491 4.46914 1.80317C4.57435 1.73682 4.64888 1.63139 4.67635 1.51007C4.70382 1.38876 4.68198 1.2615 4.61562 1.1563C4.54927 1.05109 4.44384 0.976554 4.32252 0.949083C4.20121 0.921612 4.07396 0.943457 3.96875 1.00981C2.99457 1.63356 2.20354 2.50487 1.67656 3.53462C1.63955 3.60605 1.62155 3.68581 1.6243 3.76622C1.62704 3.84663 1.65043 3.92498 1.69222 3.99373C1.73401 4.06248 1.7928 4.11931 1.86291 4.15877C1.93303 4.19822 2.01212 4.21896 2.09258 4.21899ZM12.9969 10.3092C13.0799 10.4516 13.1239 10.6134 13.1245 10.7783C13.1251 10.9431 13.0822 11.1052 13.0001 11.2482C12.918 11.3912 12.7997 11.51 12.6571 11.5926C12.5145 11.6753 12.3525 11.7189 12.1877 11.719H9.79707C9.68948 12.2488 9.40204 12.7252 8.98344 13.0673C8.56484 13.4094 8.04083 13.5963 7.50019 13.5963C6.95956 13.5963 6.43555 13.4094 6.01695 13.0673C5.59835 12.7252 5.3109 12.2488 5.20332 11.719H2.81269C2.64794 11.7187 2.48618 11.6749 2.34371 11.5922C2.20124 11.5094 2.0831 11.3906 2.00117 11.2477C1.91924 11.1047 1.87643 10.9427 1.87705 10.778C1.87767 10.6132 1.92169 10.4515 2.00469 10.3092C2.53262 9.39809 2.81269 8.10259 2.81269 6.56274C2.81269 5.31954 3.30655 4.12726 4.18563 3.24818C5.06471 2.3691 6.25699 1.87524 7.50019 1.87524C8.7434 1.87524 9.93568 2.3691 10.8148 3.24818C11.6938 4.12726 12.1877 5.31954 12.1877 6.56274C12.1877 8.102 12.4678 9.39751 12.9969 10.3092ZM8.82558 11.719H6.1748C6.27192 11.9929 6.45149 12.2299 6.68883 12.3976C6.92616 12.5652 7.20961 12.6553 7.50019 12.6553C7.79078 12.6553 8.07422 12.5652 8.31156 12.3976C8.5489 12.2299 8.72847 11.9929 8.82558 11.719ZM12.1877 10.7815C11.5643 9.71098 11.2502 8.29184 11.2502 6.56274C11.2502 5.56818 10.8551 4.61435 10.1518 3.91109C9.44858 3.20783 8.49476 2.81274 7.50019 2.81274C6.50563 2.81274 5.55181 3.20783 4.84854 3.91109C4.14528 4.61435 3.75019 5.56818 3.75019 6.56274C3.75019 8.29243 3.43496 9.71157 2.81269 10.7815H12.1877Z" fill="white" />
              </svg>
            </div>
            Botão de Emergência
          </button>
        </div>
        

        <div style={{ flex: 1, overflowY: 'auto', position: 'relative', display: 'flex', flexDirection: 'row' }}>
        

        {/* CORPO */}
        <div style={{ padding: '24px 32px', flex: 1 }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>

            {/* CARD PRINCIPAL */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              flex: 1,
              border: '1px solid #E2E8F0',
            }}>

              {/* Foto + nome + card de match */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', marginBottom: '24px', flexWrap: 'wrap' }}>

                {/* Ícone do Perfil - 138x138 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <div style={{
                    width: '138px',
                    height: '138px',
                    borderRadius: '69px',
                    background: dadosPaciente.foto
                      ? `url("${dadosPaciente.foto}") lightgray 50% / cover no-repeat`
                      : '#0D9488',
                    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 4px 4px 0 rgba(0, 0, 0, 0.20), 0 0 30px 12px rgba(0, 0, 0, 0.12)',
                    overflow: 'hidden',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {!dadosPaciente.foto && <IconeUsuario size={50} color="white" />}
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    {/* Nome - 24px Inter negrito */}
                    <p style={{
                      color: '#1E293B',
                      fontFamily: 'Inter',
                      fontSize: '24px',
                      fontStyle: 'normal',
                      fontWeight: '700',
                      lineHeight: '32px',
                      margin: 0
                    }}>{dadosPaciente.nome}</p>

                    {/* Tipo Conta - 14px Inter 500 */}
                    <p style={{
                      color: '#012765',
                      fontFamily: 'Inter',
                      fontSize: '14px',
                      fontStyle: 'normal',
                      fontWeight: '500',
                      lineHeight: '20px',
                      margin: '2px 0 0 0'
                    }}>{dadosPaciente.tipoConta}</p>
                  </div>
                </div>

                {/* Aba "Não gostou das recomendações?" - 341x166 */}
                <div style={{
                  width: '341px',
                  height: '166px',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.00)',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px -1px rgba(0, 0, 0, 0.10)',
                  padding: '16px 20px',
                  position: 'relative',
                }}>
                  <p style={{ fontSize: '13px', color: '#374151', margin: '0 0 12px 0', fontWeight: '500' }}>
                    Não gostou das recomendações?
                  </p>
                  <button
                    onClick={() => { /* (colocar caminho) */ }}
                    style={{
                      backgroundColor: '#0D9488', color: 'white', border: 'none',
                      borderRadius: '8px', padding: '10px 14px', fontSize: '12px',
                      fontWeight: '500', cursor: 'pointer', width: '100%',
                    }}
                  >
                    Refazer questionário de match
                  </button>
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #F1F5F9', marginBottom: '8px' }} />

              {/* DADOS */}
              {ehProprioPaciente ? (
                <div style={{ textAlign: 'left' }}>
                  <CampoPerfil label="NOME COMPLETO" valor={dadosPaciente.nome} />
                  <CampoPerfil label="E-MAIL" valor={dadosPaciente.email} />
                  <CampoPerfil label="TELEFONE" valor={dadosPaciente.telefone} />
                  <CampoPerfil label="DATA DE NASCIMENTO" valor={dadosPaciente.dataNascimento} />
                  <CampoPerfil label="CPF" valor={dadosPaciente.cpf} />
                  <CampoPerfil label="ENDEREÇO" valor={dadosPaciente.endereco} ultimo />
                </div>
              ) : PROFISSIONAL_TEM_VINCULO ? (
                <div style={{ textAlign: 'left' }}>
                  <div style={{
                    backgroundColor: '#FFF8E1', border: '1px solid #FFE082',
                    borderRadius: '8px', padding: '12px 16px', marginBottom: '20px',
                    fontSize: '13px', color: '#92400E', textAlign: 'center',
                  }}>
                    Você está vendo apenas os dados autorizados deste paciente (vínculo de consulta ativo).
                  </div>
                  <CampoPerfil label="NOME COMPLETO" valor={dadosPaciente.nome} />
                  <CampoPerfil label="IDADE" valor={`${idade} anos`} />
                  <CampoPerfil label="TELEFONE (URGÊNCIA)" valor={dadosPaciente.telefone} ultimo />
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>
                  <p>Sem permissão para visualizar estes dados.</p>
                </div>
              )}


              {/* BOTÕES DE AÇÃO */}
              {ehProprioPaciente && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  {/* Botão Deletar Conta - NOVAS ESPECIFICAÇÕES */}
                  <button
                    onClick={() => navigate('/conta/excluir')}
                    style={{
                      width: '307px',
                      height: '38px',
                      position: 'relative',  /* mudei de absolute para relative para não quebrar o layout */
                      borderRadius: '9999px',
                      background: 'rgba(236, 5, 5, 0.87)',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px -1px rgba(0, 0, 0, 0.10)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      border: 'none',
                    }}
                  >
                    {/* Ícone Lixeira NOVO com as especificações */}
                    <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.625 12C2.14375 12 1.73192 11.8696 1.3895 11.6087C1.04709 11.3478 0.875586 11.0338 0.875003 10.6667V2C0.627086 2 0.41942 1.936 0.252003 1.808C0.0845864 1.68 0.00058635 1.52178 3.01724e-06 1.33333C-0.000580316 1.14489 0.0834197 0.986667 0.252003 0.858667C0.420586 0.730667 0.628253 0.666667 0.875003 0.666667H4.375C4.375 0.477778 4.459 0.319556 4.627 0.192C4.795 0.0644445 5.00267 0.000444444 5.25 0H8.75C8.99792 0 9.20587 0.0640001 9.37387 0.192C9.54187 0.32 9.62558 0.478222 9.625 0.666667H13.125C13.3729 0.666667 13.5809 0.730667 13.7489 0.858667C13.9169 0.986667 14.0006 1.14489 14 1.33333C13.9994 1.52178 13.9154 1.68022 13.748 1.80867C13.5806 1.93711 13.3729 2.00089 13.125 2V10.6667C13.125 11.0333 12.9538 11.3473 12.6114 11.6087C12.269 11.87 11.8568 12.0004 11.375 12H2.625ZM11.375 2H2.625V10.6667H11.375V2ZM6.125 5.9V8C6.125 8.18889 6.209 8.34733 6.377 8.47533C6.545 8.60333 6.75267 8.66711 7 8.66667C7.24733 8.66622 7.45529 8.60222 7.62388 8.47467C7.79246 8.34711 7.87617 8.18889 7.875 8V5.9L8.6625 6.48333C8.82292 6.60556 9.02358 6.66667 9.2645 6.66667C9.50542 6.66667 9.71308 6.6 9.8875 6.46667C10.0479 6.34444 10.1281 6.18889 10.1281 6C10.1281 5.81111 10.0479 5.65555 9.8875 5.53333L7.6125 3.8C7.4375 3.66667 7.23333 3.6 7 3.6C6.76667 3.6 6.5625 3.66667 6.3875 3.8L4.1125 5.53333C3.95208 5.65555 3.86838 5.80844 3.86138 5.992C3.85438 6.17555 3.93808 6.33378 4.1125 6.46667C4.27292 6.58889 4.47358 6.65289 4.7145 6.65867C4.95542 6.66444 5.16308 6.606 5.3375 6.48333L6.125 5.9Z" fill="white" />
                    </svg>

                    <span style={{
                      color: '#FFF',
                      textAlign: 'center',
                      fontFamily: 'Inter',
                      fontSize: '14px',
                      fontStyle: 'normal',
                      fontWeight: '500',
                      lineHeight: '20px',
                    }}>
                      Deletar conta
                    </span>
                  </button>
                  {/* Editar: branco com letras cinzas */}
                  {/* Botão Editar Informações - NOVAS ESPECIFICAÇÕES */}
                  <button
                    onClick={() => navigate('/perfil/paciente/editar')}
                    style={{
                      width: '307px',
                      height: '38px',
                      position: 'relative',  /* mudei de absolute para relative para não quebrar o layout */
                      borderRadius: '9999px',
                      background: 'rgba(255, 255, 255, 0.00)',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px -1px rgba(0, 0, 0, 0.10)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      border: 'none',
                    }}
                  >
                    {/* Ícone Lápis NOVO com as especificações */}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                      <g clipPath="url(#clip0_400_730)">
                        <path d="M14.1156 4.54126C14.8491 3.80795 14.8493 2.61709 14.116 1.8836C13.3827 1.1501 12.1918 1.14995 11.4583 1.88326L2.56097 10.7826C2.40619 10.9369 2.29172 11.127 2.22764 11.3359L1.34697 14.2373C1.31187 14.3547 1.34408 14.482 1.43084 14.5686C1.5176 14.6552 1.6449 14.6872 1.76231 14.6519L4.66431 13.7719C4.87309 13.7084 5.06309 13.5947 5.21764 13.4406L14.1156 4.54126" stroke="#1E293B" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                      </g>
                      <defs>
                        <clipPath id="clip0_400_730">
                          <rect width="16" height="16" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>

                    <span style={{
                      color: '#1E293B',
                      textAlign: 'center',
                      fontFamily: 'Inter',
                      fontSize: '14px',
                      fontStyle: 'normal',
                      fontWeight: '500',
                      lineHeight: '20px',
                    }}>
                      Editar Informações
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* CARDS LATERAIS — apenas paciente */}
            {ehProprioPaciente && (
              <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '16px', flexShrink: 0 }}>

                {/* Carteira Virtual  */}
                <div style={{
                  width: '432px',
                  height: '263px',
                  position: 'relative',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.00)',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px -1px rgba(0, 0, 0, 0.10)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                }}>

                  {/* Cabeçalho: título + ícone */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{
                      color: '#1E293B',
                      fontFamily: 'Inter',
                      fontSize: '20px',
                      fontStyle: 'normal',
                      fontWeight: '700',
                      lineHeight: '28px',
                      margin: 0,
                    }}>Carteira Virtual</h3>

                    {/* Ícone da carteira com fundo azul */}
                    <div style={{
                      display: 'flex',
                      width: '32px',
                      height: '32px',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '9999px',
                      background: '#c9e1ff',
                    }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.6667 4.66667V2.66667C12.6667 2.29872 12.3679 2 12 2H3.33333C2.59745 2 2 2.59745 2 3.33333C2 4.06922 2.59745 4.66667 3.33333 4.66667H13.3333C13.7013 4.66667 14 4.96539 14 5.33333V8H12C11.2641 8 10.6667 8.59745 10.6667 9.33333C10.6667 10.0692 11.2641 10.6667 12 10.6667H14C14.3679 10.6667 14.6667 10.3679 14.6667 10V8.66667C14.6667 8.29872 14.3679 8 14 8" stroke="#3B82F6" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 3.3335V12.6668C2 13.4027 2.59745 14.0002 3.33333 14.0002H13.3333C13.7013 14.0002 14 13.7014 14 13.3335V10.6668" stroke="#3B82F6" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>

                  {/* Saldo disponível */}
                  <div style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #ffffff',
                    borderRadius: '8px',
                    padding: '14px',
                    marginBottom: '20px',
                  }}>
                    <p style={{ fontSize: '11px', color: '#94A3B8', margin: '0 0 4px 0' }}>Saldo disponível</p>
                    <p style={{ fontSize: '22px', fontWeight: '700', color: '#1E293B', margin: 0 }}>R$ 150,00</p>
                  </div>

                  {/* Botões */}
                  <div style={{ display: 'flex', gap: '16px' }}>

                    {/* Botão Adicionar */}
                    <button
                      onClick={() => { }}
                      style={{
                        width: '176px',
                        height: '42px',
                        position: 'relative',
                        borderRadius: '9999px',
                        background: 'rgba(9, 43, 241, 0.92)',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px -1px rgba(0, 0, 0, 0.10)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        border: 'none',
                        backgroundColor: '#3B82F6',
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.33301 8.00016H12.6663M7.99967 3.3335V12.6668" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span style={{
                        color: '#FFF',
                        textAlign: 'center',
                        fontFamily: 'Inter',
                        fontSize: '14px',
                        fontStyle: 'normal',
                        fontWeight: '700',
                        lineHeight: '20px',
                      }}>Adicionar</span>
                    </button>

                    {/* Botão Histórico */}
                    <button
                      onClick={() => { }}
                      style={{
                        width: '178px',
                        height: '42px',
                        position: 'relative',
                        borderRadius: '9999px',
                        background: 'rgba(255, 255, 255, 0.00)',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px -1px rgba(0, 0, 0, 0.10)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        border: 'none',
                        backgroundColor: 'white',
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.33301 8.00016C1.33301 11.6796 4.32024 14.6668 7.99967 14.6668C11.6791 14.6668 14.6663 11.6796 14.6663 8.00016C14.6663 4.32073 11.6791 1.3335 7.99967 1.3335C4.32024 1.3335 1.33301 4.32073 1.33301 8.00016V8.00016" stroke="#1E293B" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8 4V8L10.6667 9.33333" stroke="#1E293B" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span style={{
                        color: '#1E293B',
                        textAlign: 'center',
                        fontFamily: 'Inter',
                        fontSize: '14px',
                        fontStyle: 'normal',
                        fontWeight: '700',
                        lineHeight: '20px',
                      }}>Histórico</span>
                    </button>
                  </div>
                </div>

                {/* Assinatura e Planos - NOVAS ESPECIFICAÇÕES */}
                <div style={{
                  width: '432px',
                  height: '464px',
                  position: 'relative',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.00)',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px -1px rgba(0, 0, 0, 0.10)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}>

                  {/* Cabeçalho: título + ícone estrela */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{
                      color: '#1E293B',
                      fontFamily: 'Inter',
                      fontSize: '20px',
                      fontStyle: 'normal',
                      fontWeight: '700',
                      lineHeight: '28px',
                      margin: 0,
                    }}>Assinatura e Planos</h3>

                    {/* Ícone estrela com fundo */}
                    <div style={{
                      display: 'flex',
                      width: '32px',
                      height: '32px',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '9999px',
                      background: '#EFF6FF',
                    }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.68324 1.53009C7.74284 1.40969 7.86556 1.3335 7.99991 1.3335C8.13426 1.3335 8.25698 1.40969 8.31658 1.53009L9.85658 4.64943C10.0622 5.06642 10.4598 5.35558 10.9199 5.42276L14.3639 5.92676C14.497 5.94605 14.6077 6.03925 14.6493 6.16716C14.6909 6.29508 14.6562 6.43552 14.5599 6.52943L12.0692 8.95476C11.7355 9.2795 11.5831 9.7478 11.6619 10.2068L12.2499 13.6334C12.2734 13.7665 12.2189 13.9013 12.1096 13.9808C12.0003 14.0602 11.8552 14.0703 11.7359 14.0068L8.65724 12.3881C8.24551 12.1716 7.75364 12.1716 7.34191 12.3881L4.26391 14.0068C4.14467 14.0699 3.99989 14.0596 3.89077 13.9802C3.78166 13.9009 3.72726 13.7663 3.75058 13.6334L4.33791 10.2074C4.41691 9.74825 4.26453 9.27965 3.93058 8.95476L1.43991 6.53009C1.34278 6.43628 1.30762 6.29532 1.34929 6.16689C1.39097 6.03845 1.50221 5.945 1.63591 5.92609L5.07924 5.42276C5.53981 5.35599 5.93798 5.06677 6.14391 4.64943L7.68324 1.53009" stroke="#22C55E" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>

                  {/* Card do Plano Conexão */}
                  <div style={{
                    width: '366px',
                    height: '156px',
                    position: 'relative',
                    borderRadius: '24px',
                    background: 'linear-gradient(135deg, #0D9488 0%, #34D399 100%)',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px -1px rgba(0, 0, 0, 0.10)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: '20px',
                    marginBottom: '8px',
                  }}>
                    <p style={{
                      color: '#FFF',
                      textAlign: 'center',
                      fontFamily: 'Inter',
                      fontSize: '24px',
                      fontStyle: 'normal',
                      fontWeight: '700',
                      lineHeight: '32px',
                      margin: '0 0 4px 0',
                    }}>Plano Conexão</p>

                    <p style={{
                      color: 'rgba(255, 255, 255, 0.90)',
                      textAlign: 'center',
                      fontFamily: 'Inter',
                      fontSize: '14px',
                      fontStyle: 'normal',
                      fontWeight: '500',
                      lineHeight: '20px',
                      margin: '0 0 8px 0',
                    }}>12 sessões válidas por 180 dias</p>

                    <p style={{
                      color: '#FFF',
                      textAlign: 'center',
                      fontFamily: 'Inter',
                      fontSize: '30px',
                      fontStyle: 'normal',
                      fontWeight: '700',
                      lineHeight: '36px',
                      margin: 0,
                    }}>R$ 200<span style={{ fontSize: '14px', fontWeight: '400' }}>/mês</span></p>
                  </div>

                  {/* Próxima cobrança */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_400_852)">
                        <path d="M14.5341 6.6669C15.1615 9.74591 13.5537 12.845 10.6751 14.1051C7.79655 15.3652 4.42889 14.4442 2.59228 11.8945C0.755675 9.34484 0.948825 5.85885 3.05586 3.52768C5.1629 1.19652 8.61171 0.653163 11.3334 2.22357" stroke="#22C55E" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M6 7.33317L8 9.33317L14.6667 2.6665" stroke="#22C55E" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                      </g>
                      <defs>
                        <clipPath id="clip0_400_852">
                          <rect width="16" height="16" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                    <span style={{
                      color: '#64748B',
                      fontFamily: 'Inter',
                      fontSize: '14px',
                      fontStyle: 'normal',
                      fontWeight: '400',
                      lineHeight: '20px',
                    }}>Próxima cobrança: 15/11/2026</span>
                  </div>

                  {/* Cartão final */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.66634 3.3335H13.333C14.0689 3.3335 14.6663 3.93094 14.6663 4.66683V11.3335C14.6663 12.0694 14.0689 12.6668 13.333 12.6668H2.66634C1.93045 12.6668 1.33301 12.0694 1.33301 11.3335V4.66683C1.33301 3.93094 1.93045 3.3335 2.66634 3.3335V3.3335" stroke="#3B82F6" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M1.33301 6.6665H14.6663" stroke="#3B82F6" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={{
                      color: '#64748B',
                      fontFamily: 'Inter',
                      fontSize: '14px',
                      fontStyle: 'normal',
                      fontWeight: '400',
                      lineHeight: '20px',
                    }}>Cartão final 4321</span>
                  </div>

                  {/* Botão Fazer Upgrade */}
                  <button
                    onClick={() => { }}
                    style={{
                      width: '366px',
                      height: '44px',
                      position: 'relative',
                      borderRadius: '9999px',
                      background: '#1E293B',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px -1px rgba(0, 0, 0, 0.10)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      border: 'none',
                    }}
                  >
                    <span style={{
                      color: '#FFF',
                      textAlign: 'center',
                      fontFamily: 'Inter',
                      fontSize: '14px',
                      fontStyle: 'normal',
                      fontWeight: '700',
                      lineHeight: '20px',
                    }}>Fazer Upgrade de Plano</span>
                  </button>

                  {/* Botão Gerenciar Assinatura */}
                  <button
                    onClick={() => { }}
                    style={{
                      width: '366px',
                      height: '46px',
                      position: 'relative',
                      borderRadius: '9999px',
                      background: 'rgba(255, 255, 255, 0.00)',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px -1px rgba(0, 0, 0, 0.10)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      border: 'none',
                      backgroundColor: 'white',
                    }}
                  >
                    <span style={{
                      color: '#1E293B',
                      textAlign: 'center',
                      fontFamily: 'Inter',
                      fontSize: '14px',
                      fontStyle: 'normal',
                      fontWeight: '700',
                      lineHeight: '20px',
                    }}>Gerenciar Assinatura</span>
                  </button>
                </div>

              </div>
            )}
          </div>
        </div>
        </div>
        </div>
      </main>
    </div>
  )
}
