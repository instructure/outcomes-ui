const generateComponentTheme = ({breakpoints, spacing, colors}) => {
  return {
    reportBorder: '1px solid lightgray',
    masteryColor: colors.contrasts.green4570,
    outcomeLabelsSpacing: '0.5rem',
    outcomePickerItemPadding: '0.5rem',
    outcomeTagsSpacing: '0.75rem',
    averageColor: colors.contrasts.blue4570,
    checkboxLabelLeftPadding: '0.5rem',
    checkboxDescriptionLeftPadding: '2.25rem' // checkboxLabelLeftPadding + CheckboxFacade/facadeSizeMedium + CheckboxFacade/marginRight
  }
}
export default generateComponentTheme
