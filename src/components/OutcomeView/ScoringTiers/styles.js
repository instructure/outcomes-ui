const generateStyle = (componentTheme) => {
  return {
    score: {
      border: '1px solid #ccc',
      color: '#888',
      borderRadius: '100%',
      width: '2.25rem',
      height: '2.25rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: '0.1rem',
      marginRight: '1.0rem'
    },
    description: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    },
    rating: { display: 'flex', marginBottom: '0.5rem' },
    scoringTier: { marginBottom: '1.0rem' },
    masteryCount: { fontWeight: 'bold', marginLeft: '3.5rem' },
    gap: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      marginBottom: '1rem',
      marginLeft: '3.5rem',
    },
    pill: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '1.2rem',
      '.pill:not(:last-child)': { marginBottom: '0.75rem' }
    },
    iconMastery: {
      marginRight: '0.5rem',
      color: componentTheme.masteryColor
    },
    iconAverage: {
      marginRight: '0.5rem',
      color: componentTheme.averageColor
    },
    mastery: {
      color: componentTheme.masteryColor
    },
    average: {
      color: componentTheme.averageColor
    }
  }
}

export default generateStyle
