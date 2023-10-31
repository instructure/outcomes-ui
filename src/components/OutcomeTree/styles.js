
const generateStyle = () => {
  return {
    outcomeTree: { overflow: 'scroll', height: '100%' },
    outcomeContent: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflowY: 'scroll'
    },
    selectedOutcomeCollection: {
      paddingBottom: '1rem',
      paddingLeft: '1rem',
      paddingTop: '1rem',
      '.selectedOutcomeCollection .outcomeDescription > p': {
        marginTop: '0.75rem',
        marginBottom: '0.75rem',
        '&:last-child': { marginBottom: '0' }
      }
    },
  }
}

export default generateStyle
