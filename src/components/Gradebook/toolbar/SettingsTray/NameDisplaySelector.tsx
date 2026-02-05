import React from 'react'
import {RadioInput, RadioInputGroup} from '@instructure/ui-radio-input'
import t from 'format-message'
import {NameDisplayFormat} from '@/util/Gradebook/constants'

export interface NameDisplayFormatSelectorProps {
  value?: NameDisplayFormat
  onChange: (format: NameDisplayFormat) => void
}

export const NameDisplayFormatSelector: React.FC<NameDisplayFormatSelectorProps> = ({
  value = NameDisplayFormat.FIRST_LAST,
  onChange,
}) => {
  const inputs = [
    {value: NameDisplayFormat.FIRST_LAST, label: t('First Name Last Name')},
    {value: NameDisplayFormat.LAST_FIRST, label: t('Last Name, First Name')},
  ]

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value as NameDisplayFormat)
  }

  return (
    <RadioInputGroup
      onChange={handleChange}
      name="name-display-format"
      value={value.toString()}
      description={t('Name Display Format')}
    >
      {inputs.map(input => (
        <RadioInput key={input.value} value={input.value.toString()} label={input.label} />
      ))}
    </RadioInputGroup>
  )
}
