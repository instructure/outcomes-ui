const generateStyle = (componentTheme) => {
  return {
    picker: { paddingLeft: '1rem' },
    checkbox: { padding: componentTheme.outcomePickerItemPadding },
    checkboxLabel: { paddingLeft: '0.5rem' }
  }
}

export default generateStyle
