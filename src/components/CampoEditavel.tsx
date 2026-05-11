const estiloInput: React.CSSProperties = {
  width: '100%', padding: '8px 12px', border: '1px solid #D1D5DB',
  borderRadius: '8px', fontSize: '13px', color: '#1E293B',
  outline: 'none', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif',
}


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

export default CampoEditavel