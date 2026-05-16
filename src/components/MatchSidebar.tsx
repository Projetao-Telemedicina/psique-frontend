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
        background: 'linear-gradient(180deg, #3599D8 0%, #5BB38A 100%)',
        display: 'flex',
        flexDirection: 'column',
        padding: '40px 24px 48px 24px',
        flexShrink: 0,
        position: 'relative',
        boxSizing: 'border-box'
      }}
    >
      {/* --- Container da Logo --- */}
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          marginTop: '70px',
          width: '100%'
        }}
      >
        <img
          src="/psique-logo-white.svg" 
          alt="Psique Logo"
          style={{ 
            width: '190px', 
            height: 'auto', 
            objectFit: 'contain' 
          }}
        />
        {/* --- Texto Match Maior e Destacado --- */}
        <p
          style={{
            color: '#ffffff',
            fontFamily: "'Poppins', sans-serif",
            fontSize: '32px', 
            fontWeight: '600',
            margin: '-22px 0 0 0', 
            letterSpacing: '-0.5px',
            opacity: 0.95,
            textAlign: 'center'
          }}
        >
          Match
        </p>
      </div>

      {/* Espaçador para empurrar o progresso para o rodapé */}
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
        
        <p style={{ fontSize: '12px', fontWeight: '500', opacity: 0.9, marginTop: '10px', margin: '10px 0 0 0' }}>
          Pergunta {currentStep} de {totalSteps}
        </p>
      </div>

      {/* --- Seta Flutuante de Transição Lateral --- */}
      <div 
        style={{
          position: 'absolute',
          right: '-18px',
          top: '46%',
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