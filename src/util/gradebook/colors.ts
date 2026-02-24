import { ViewProps } from '@instructure/ui-view'

type IconButtonColor = 'primary' | 'primary-inverse'

const INVERSE_COLOR: Record<NonNullable<ViewProps['background']>, IconButtonColor> = {
  transparent:       'primary',
  primary:           'primary',
  secondary:         'primary',
  'primary-inverse': 'primary-inverse',
  brand:             'primary-inverse',
  info:              'primary-inverse',
  alert:             'primary-inverse',
  success:           'primary-inverse',
  danger:            'primary-inverse',
  warning:           'primary-inverse',
}

export const getInverseColor = (background: ViewProps['background']): IconButtonColor =>
  background ? INVERSE_COLOR[background] ?? 'primary' : 'primary'
