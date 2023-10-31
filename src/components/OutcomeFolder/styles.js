const generateStyle = (componentTheme) => {
  return {
    folder: {
      display: 'flex',
      alignContent: 'flex-start',
      padding: componentTheme.outcomePickerItemPadding
    },
    folderIcon: {
      fontSize: '1.5em',
      height: '1.25rem',
      width: '1.25rem',
      marginRight: '0.5rem'
    },
    folderDetails: { paddingLeft: '0.5rem' }
  }
}

export default generateStyle
