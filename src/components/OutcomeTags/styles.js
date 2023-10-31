const generateStyle = (componentTheme) => {
  return {
    line: { display: 'inline-flex' },
    tags: { display: 'flex', flexWrap: 'wrap' },
    text: {
      paddingLeft: componentTheme.outcomeTagsSpacing,
      marginBottom: componentTheme.outcomeTagsSpacing
    }
  }
}

export default generateStyle