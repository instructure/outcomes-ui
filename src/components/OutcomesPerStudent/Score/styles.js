const generateStyle = (componentTheme) => {
  return {
    mastery: { color: componentTheme.masteryColor },
    score: {
      boxSizing: 'border-box',
      display: 'flex',
      height: '4rem',
    },
    scoreText: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    scoreSpacer: { flexGrow: 1 },
    masteryStar: {
      flexBasis: '0',
      flexGrow: 1,
      textAlign: 'right',
      verticalAlign: 'middle',
      paddingRight: '0.5rem',
      fontSize: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end'
    }
  }
}

export default generateStyle
