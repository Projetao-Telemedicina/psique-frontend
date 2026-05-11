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

export default CampoPerfil 