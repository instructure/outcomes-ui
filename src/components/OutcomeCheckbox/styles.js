const generateStyle = (componentTheme) => {
  return {
    checkbox: { padding: componentTheme.outcomePickerItemPadding },
    checkboxLabel: {
      paddingLeft: componentTheme.checkboxLabelLeftPadding,
      display: 'flex'
    },
    checkboxDescription: {
      paddingLeft: componentTheme.checkboxDescriptionLeftPadding
    },
    checkboxFriendlyDescription: {
      marginLeft: componentTheme.checkboxDescriptionLeftPadding,
      marginBottom: '10px'
    },
    linkText: {
      display: 'table',
      tableLayout: 'fixed',
      whiteSpace: 'nowrap',
      width: '100%'
    },
    innerLinkText: {
      display: 'table-cell',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }
}

export default generateStyle
