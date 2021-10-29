import React from 'react'
import { object, text, boolean } from '@storybook/addon-knobs'
import { defaultScoringMethod, defaultScoringTiers, outcomeRollup } from '../../../.storybook/constants'
import OutcomeView from './'

export default {
  title: 'OutcomeView'
}

export const noResults = () => (
  <OutcomeView
    description={ text('Description', 'This is your sample outcome description') }
    title={ text('Title', 'Outcome title') }
    scoringMethod={ object('ScoringMethod', defaultScoringMethod) }
    scoringTiers={ object('ScoringTiers', defaultScoringTiers) }
    artifactTypeName="Quiz"
    displayMasteryDescription={ boolean('Display Mastery Description', true) }
    displayMasteryPercentText={ boolean('Display Mastery Percent Text', true) }
    outcomeResult={ null }
  />
)

export const results = () => (
  <OutcomeView
    description={ text('Description', 'This is your sample outcome description') }
    title={ text('Title', 'Outcome title') }
    scoringMethod={ object('Scoring Method', defaultScoringMethod) }
    scoringTiers={ object('Scoring Tiers', defaultScoringTiers) }
    artifactTypeName="Quiz"
    displayMasteryDescription={ boolean('Display Mastery Description', true) }
    displayMasteryPercentText={ boolean('Display Mastery Percent Text', true) }
    outcomeResult={ object('Outcome Result', outcomeRollup) }
  />
)

export const noResultsFriendlyDescription = () => (
  <OutcomeView
    description={ text('Description', 'This is your sample outcome description') }
    title={ text('Title', 'Outcome title') }
    scoringMethod={ object('Scoring Method', defaultScoringMethod) }
    scoringTiers={ object('Scoring Tiers', defaultScoringTiers) }
    artifactTypeName="Quiz"
    displayMasteryDescription={ boolean('Display Mastery Description', true) }
    displayMasteryPercentText={ boolean('Display Mastery Percent Text', true) }
    outcomeResult={ null }
    friendlyDescription={ text('Friendly Description', 'This is a friendly description') }
  />
)

export const resultsFriendlyDescription = () => (
  <OutcomeView
    description={ text('Description', 'This is your sample outcome description') }
    title={ text('Title', 'Outcome title') }
    scoringMethod={ object('Scoring Method', defaultScoringMethod) }
    scoringTiers={ object('Scoring Tiers', defaultScoringTiers) }
    artifactTypeName="Quiz"
    displayMasteryDescription={ boolean('Display Mastery Description', true) }
    displayMasteryPercentText={ boolean('Display Mastery Percent Text', true) }
    outcomeResult={ object('Outcome Result', outcomeRollup) }
    friendlyDescription={ text('Friendly Description', 'This is a friendly description') }
  />
)
