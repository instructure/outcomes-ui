import { lighten } from '@instructure/ui-color-utils'

export default function generator ({breakpoints, spacing, colors}) {
  return {
    reportBorder: '1px solid lightgray',
    masteryColor: colors.shamrock,
    outcomeLabelsSpacing: '0.5rem',
    outcomePickerItemPadding: '0.5rem',
    outcomeTagsSpacing: '0.75rem',
    averageColor: colors.electric,
    masteryBarColorStart: colors.shamrock,
    masteryBarColorEnd: lighten(colors.shamrock),
    checkboxLabelLeftPadding: '0.5rem',
    checkboxDescriptionLeftPadding: '2.25rem' // checkboxLabelLeftPadding + CheckboxFacade/facadeSizeMedium + CheckboxFacade/marginRight
  }
}
