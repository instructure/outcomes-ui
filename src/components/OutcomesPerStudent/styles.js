const generateStyle = () => {
  return {
    reportWrapper: { position: 'relative', paddingLeft: '13rem' },
    background: { backgroundColor: 'white' },
    table: { overflowX: 'scroll' },
    headerRow: { display: 'flex', alignItems: 'stretch' },
    corner: {
      position: 'absolute',
      boxSizing: 'border-box',
      width: '13rem',
      left: '0',
      top: 'auto',
      fontSize: '3rem',
      fontWeight: 'normal',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    '.headerCell, .corner': {
      boxSizing: 'border-box',
      height: '5.5rem',
      borderRight: 'var(--reportBorder)',
      borderBottom: 'var(--reportBorder)'
    },
    headerCell: {
      boxSizing: 'border-box',
      borderTop: 'var(--reportBorder)',
      padding: '0.5rem',
      flex: '1 0 10rem',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    loadingSpinner: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      padding: '1.25rem 0.3125rem 1.25rem 0'
    },
    studentRow: {
      boxSizing: 'border-box',
      height: '4rem',
      display: 'flex',
      alignItems: 'stretch'
    },
    studentName: {
      position: 'absolute',
      boxSizing: 'border-box',
      left: '0',
      top: 'auto',
      width: '13rem',
      height: '4rem',
      paddingLeft: '0.5rem',
      borderRight: 'var(--reportBorder)',
      display: 'flex',
      justifyContent: 'flex-start',
      borderBottom: 'var(--reportBorder)',
      alignItems: 'center',
      '& .avatar': { paddingRight: '.5rem' },
      '& .name': {
        textAlign: 'left',
        textOverflow: 'ellipsis',
        overflowX: 'hidden',
        whiteSpace: 'nowrap'
      }
    },
    scoreCell: {
      boxSizing: 'border-box',
      flex: '1 0 10rem',
      borderBottom: 'var(--reportBorder)'
    }
  }
}

export default generateStyle
