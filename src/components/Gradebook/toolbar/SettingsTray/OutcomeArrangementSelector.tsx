import React from 'react'
import {SimpleSelect} from '@instructure/ui-simple-select'
import {Text} from '@instructure/ui-text'
import {View} from '@instructure/ui-view'
import t from 'format-message'
import {OutcomeArrangement} from '@/util/gradebook/constants'

export interface OutcomeArrangementSelectorProps {
  value?: OutcomeArrangement
  onChange: (arrangement: OutcomeArrangement) => void
}

export const OutcomeArrangementSelector: React.FC<OutcomeArrangementSelectorProps> = ({
  value = OutcomeArrangement.UPLOAD_ORDER,
  onChange,
}) => {
  const options = [
    {
      id: OutcomeArrangement.ALPHABETICAL,
      value: OutcomeArrangement.ALPHABETICAL,
      name: t('Alphabetical'),
    },
    {id: OutcomeArrangement.CUSTOM, value: OutcomeArrangement.CUSTOM, name: t('Custom')},
    {
      id: OutcomeArrangement.UPLOAD_ORDER,
      value: OutcomeArrangement.UPLOAD_ORDER,
      name: t('Upload Order'),
    },
  ]

  const handleChange = (_event: React.SyntheticEvent, data: {value?: string | number}) => {
    const selectedValue = data.value as OutcomeArrangement
    if (Object.values(OutcomeArrangement).includes(selectedValue)) {
      onChange(selectedValue)
    }
  }

  return (
    <View>
      <SimpleSelect
        renderLabel={t('Arrange Outcomes by')}
        value={value}
        onChange={handleChange}
      >
        {options.map(option => (
          <SimpleSelect.Option
            id={option.id}
            value={option.value}
            key={`outcome_arrangement_${option.id}`}
          >
            {option.name}
          </SimpleSelect.Option>
        ))}
      </SimpleSelect>
      <View as="div" margin="xxx-small 0 0 0">
        <Text size="x-small" color="secondary">
          {t('(You may drag & drop columns to re-arrange)')}
        </Text>
      </View>
    </View>
  )
}
