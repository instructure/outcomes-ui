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
    'failed_to_load_user_details_7221befa': 'Failed to load user details',
    'loading_user_details_53ede5bb': 'Loading user details',
    'message_5c38209d': 'Message',
    'remediation_feccc1fd': 'Remediation',
    'student_details_for_cc4a4206': 'Student Details',
    'view_mastery_report_7b7c9bc7': 'View Mastery Report',
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
