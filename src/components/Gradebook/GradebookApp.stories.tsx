import GradebookApp from './index'
import { type Translations } from 'format-message'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof GradebookApp> = {
  title: 'Gradebook/GradebookApp',
  component: GradebookApp,
}

export default meta

type Story = StoryObj<typeof GradebookApp>

const resourceOverrides: Translations = {
  en: {
    'align_new_outcomes_2a2d3d48': 'Align new outcomes',
    'ascending_b3c87427': 'Ascending',
    'descending_b7828162': 'Descending',
    'hide_contributing_scores_37645cc1': 'Hide Contributing Scores',
    'show_contributing_scores_7674c46f': 'Show Contributing Scores',
    'show_outcome_distribution_a2c0d80': 'Show Outcome Distribution',
    'show_outcome_info_90c6fcc5': 'Show Outcome Info',
    'sort_15eac63f': 'Sort',
  },
}

export const Basic: Story = {
  args: {
    translationConfig: {
      language: 'en',
      resourceOverrides,
      i18nEnabled: true,
    },
  },
}
