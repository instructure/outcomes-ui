const generateStyle = (componentTheme) => {
  return {
    spacing: { paddingRight: componentTheme.outcomeLabelsSpacing },
    line: { display: 'flex' },
    button: { marginTop: '1rem' }
  }
}

export default generateStyle
