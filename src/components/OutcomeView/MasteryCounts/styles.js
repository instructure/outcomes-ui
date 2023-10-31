const generateStyle = (componentTheme) => {
  return {
    '@media screen and (min-width: 768px)': {
      masteryBarGraph: { marginTop: '2rem' },
      masteryScoreSection: { display: 'none' }
    },
    '@media screen and (max-width: 768px)': {
      masteryBarGraph: { display: 'none' },
      masteryScoreSection: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: '2rem'
      },
      masteryScoreBoxAboveMastery: {
        color: componentTheme.masteryColor,
        display: 'flex',
        flexDirection: 'column',
        fontWeight: 'bold',
        textAlign: 'center'
      },
      masteryScoreBoxBelowMastery: {
        display: 'flex',
        flexDirection: 'column',
        fontWeight: 'bold',
        textAlign: 'center'
      }
    },
    masteryBarDetails: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingTop: '0.25rem'
    },
    masteryCountText: { color: componentTheme.masteryColor }
  }
}

export default generateStyle
