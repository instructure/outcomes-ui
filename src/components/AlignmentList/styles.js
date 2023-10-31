const generateStyle = () => {
  return {
    header: {
      backgroundColor: '#BBBBBB',
      border: 'solid 1px #999999',
      borderRadius: '5px',
      padding: '10px 20px'
    },
    list: {
      listStyle: 'none',
      paddingLeft: '0',
      border: 'solid 1px #BBBBBB',
      borderRadius: '10px'
    },
    addOutcome: { textAlign: 'center', padding: '0.5rem', borderTop: 'dashed 1px #BBBBBB' },
    addOutcomeButton: { padding: '0' }
  }
}

export default generateStyle
