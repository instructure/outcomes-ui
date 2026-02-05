import React from 'react'
import {RadioInput, RadioInputGroup} from '@instructure/ui-radio-input'
import t from 'format-message'
import {ScoreDisplayFormat} from '@/util/Gradebook/constants'

export interface ScoreDisplayFormatSelectorProps {
  value?: ScoreDisplayFormat
  onChange: (format: ScoreDisplayFormat) => void
}

export const ScoreDisplayFormatSelector: React.FC<ScoreDisplayFormatSelectorProps> = ({
  value = ScoreDisplayFormat.ICON_ONLY,
  onChange,
}) => {
  const inputs = [
    {value: ScoreDisplayFormat.ICON_ONLY, label: t('Icons Only')},
    {value: ScoreDisplayFormat.ICON_AND_POINTS, label: t('Icons + Points')},
    {value: ScoreDisplayFormat.ICON_AND_LABEL, label: t('Icons + Descriptor')},
  ]

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value as ScoreDisplayFormat)
  }

  return (
    <RadioInputGroup
      onChange={handleChange}
      name="score-display-format"
      value={value.toString()}
      description={t('Scoring')}
    >
      {inputs.map(input => (
        <RadioInput key={input.value} value={input.value.toString()} label={input.label} />
      ))}
    </RadioInputGroup>
  )
}
