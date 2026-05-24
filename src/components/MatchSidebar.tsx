import React from 'react';

interface MatchSidebarProps {
  progress: number;
  currentStep: number;
  totalSteps: number;
}

export const MatchSidebar: React.FC<MatchSidebarProps> = ({ progress, currentStep, totalSteps }) => {
  return (
    <aside
      style={{
        width: '281px', 
        height: '100vh',
        background: 'linear-gradient(359deg, #3599D8 -50.97%, #5BB38A 99.09%)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 24px 48px 24px', 
        flexShrink: 0,
        position: 'relative',
        boxSizing: 'border-box'
      }}
    >
      {/* Espaçador superior para garantir a centralização vertical */}
      <div style={{ flex: 1 }} />

      {/* --- Bloco Único da Identidade Visual --- */}
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          width: '100%'
        }}
      >
        {/* Caixa ampliada para dar o destaque máximo à logo da borboleta */}
        <div style={{ width: '240px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src="/psique-logo-white.svg" 
            alt="Psique Logo"
            style={{ 
              width: '100%',  
              height: '100%', 
              objectFit: 'contain'
            }}
          />
        </div>
        
        {/* Texto Match menor, atuando estritamente como subtítulo da logo */}
        <p
          style={{
            color: '#ffffff',
            fontFamily: "'Poppins', sans-serif",
            fontSize: '32px', 
            fontWeight: '700', 
            margin: '-20px 0 0 0', 
            letterSpacing: '0px',
            opacity: 0.95,
            textAlign: 'center',
            lineHeight: '1'
          }}
        >
          Match
        </p>
      </div>

      {/* Espaçador inferior */}
      <div style={{ flex: 1 }} />

      {/* --- Bloco de Progresso --- */}
      <div style={{ color: 'white', fontFamily: 'Poppins, sans-serif', width: '100%', padding: '0 8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '10px' }}>
          <span style={{ fontSize: '12px', fontWeight: '500', opacity: 0.9 }}>
            Progresso
          </span>
          <span style={{ fontSize: '20px', fontWeight: '700', lineHeight: '1' }}>
            {progress}%
          </span>
        </div>
        
        {/* Barra Branca Fina */}
        <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255, 255, 255, 0.3)', borderRadius: '99px', overflow: 'hidden' }}>
          <div 
            style={{ 
              height: '100%', 
              backgroundColor: '#ffffff', 
              width: `${progress}%`, 
              borderRadius: '99px',
              transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)' 
            }} 
          />
        </div>
        
        <p style={{ fontSize: '12px', fontWeight: '500', opacity: 0.9, margin: '10px 0 0 0' }}>
          Pergunta {currentStep} de {totalSteps}
        </p>
      </div>

      {/* --- Seta Flutuante de Transição Lateral --- */}
      <div 
        style={{
          position: 'absolute',
          right: '-18px',
          top: '50%', 
          transform: 'translateY(-50%)',
          width: '36px',
          height: '36px',
          backgroundColor: '#358FA6', 
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '3px solid #ffffff',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
          zIndex: 10
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </div>
    </aside>
  );
};