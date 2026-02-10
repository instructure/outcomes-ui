import React from 'react'
import t from 'format-message'
import {Checkbox, CheckboxGroup} from '@instructure/ui-checkbox'
import {DisplayFilter} from '@/util/gradebook/constants'

export interface DisplayFilterSelectorProps {
  values: DisplayFilter[]
  onChange: (values: DisplayFilter[]) => void
}

export const DisplayFilterSelector: React.FC<DisplayFilterSelectorProps> = ({values, onChange}) => {
  return (
    <CheckboxGroup
      name="display-filter"
      description={t('Display')}
      defaultValue={values}
      onChange={values => onChange(values as DisplayFilter[])}
    >
      <Checkbox
        label={t('Unpublished Assignments')}
        value={DisplayFilter.SHOW_UNPUBLISHED_ASSIGNMENTS}
      />
      <Checkbox
        label={t('Outcomes with no results')}
        value={DisplayFilter.SHOW_OUTCOMES_WITH_NO_RESULTS}
      />
      <Checkbox
        label={t('Students with no results')}
        value={DisplayFilter.SHOW_STUDENTS_WITH_NO_RESULTS}
      />
      <Checkbox
        label={t('Avatars in student list')}
        value={DisplayFilter.SHOW_STUDENT_AVATARS}
      />
    </CheckboxGroup>
  )
}
