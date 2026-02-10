import React from 'react'
import {RadioInput, RadioInputGroup} from '@instructure/ui-radio-input'
import t from 'format-message'
import {SecondaryInfoDisplay} from '@/util/gradebook/constants'

export interface SecondaryInfoSelectorProps {
  value: SecondaryInfoDisplay
  onChange: (value: SecondaryInfoDisplay) => void
}

export const SecondaryInfoSelector: React.FC<SecondaryInfoSelectorProps> = ({value, onChange}) => {
  const inputs = [
    {value: SecondaryInfoDisplay.SIS_ID, label: t('SIS ID')},
    {value: SecondaryInfoDisplay.INTEGRATION_ID, label: t('Integration ID')},
    {value: SecondaryInfoDisplay.LOGIN_ID, label: t('Login ID')},
    {value: SecondaryInfoDisplay.NONE, label: t('None')},
  ]

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value as SecondaryInfoDisplay)
  }

  return (
    <RadioInputGroup
      onChange={handleChange}
      name="secondary-info-display"
      defaultValue={value.toString()}
      description={t('Secondary info')}
    >
      {inputs.map(input => (
        <RadioInput key={input.value} value={input.value.toString()} label={input.label} />
      ))}
    </RadioInputGroup>
  )
}
