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
