import React from 'react'
import { text, object, boolean, number } from '@storybook/addon-knobs'
import { outcomeViewWithResults } from '../../../.storybook/constants'
import OutcomeDescription from './'

export default {
  title: 'OutcomeDescription'
}

export const standard = () => (
  <OutcomeDescription
    label= {text('Label', 'Example Label')}
    description={text('Description', 'Example Description')}
    friendlyDescription={text('Friendly Description', 'Example Friendly Description')}
    shouldTruncateText={boolean('Truncate Text?', true)}
    maxLines={number('Max Lines', 1)}
    calculationMethod={text('Calculation Method', outcomeViewWithResults.scoring_method.algorithm)}
    calculationInt={object('Calculation Int', outcomeViewWithResults.scoring_method.algorithm_data)}
    masteryPercent={number('Mastery Percent', outcomeViewWithResults.scoring_method.mastery_percent)}
    pointsPossible={number('Points Possible', outcomeViewWithResults.scoring_method.points_possible)}
    ratings={object('Ratings', outcomeViewWithResults.scoring_method.scoring_tiers)}
    truncated={boolean('Collapsed?', true)}
    isTray={boolean('Render in Tray?', false)}
    canManageOutcomes={boolean('User can manage outcomes', true)}
  />
)
