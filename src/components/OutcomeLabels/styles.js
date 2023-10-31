const generateStyle = (componentTheme) => {
  return {
    line: { display: 'flex' },
    text: { paddingLeft: componentTheme.outcomeLabelsSpacing },
    pill: {
      display: 'inline-block',
      cssFloat: 'left',
      maxWidth: '12rem',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    comma: { cssFloat: 'left', width: '0.5rem' }
  }
}

export default generateStyle
