import React from 'react'
import { object, number, boolean } from '@storybook/addon-knobs'
import { scoringTiersWithResults } from '../../../.storybook/constants'
import Ratings from './'

export default {
  title: 'Ratings'
}

export const ratings = () => (
  <Ratings
    ratings={object('Rating', scoringTiersWithResults)}
    masteryPercent={number('Mastery Percent', 0.6)}
    pointsPossible={number('Points Possible', 5)}
    isTray={boolean('Render in Outcome Tray?', false)}
  />
)
