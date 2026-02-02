import { ExportCSVButton } from './ExportCSVButton'
import type { Meta, StoryObj } from '@storybook/react'
import { mockCSVExportProps } from './__mocks__/exportCSVButtonMock'

const meta: Meta<typeof ExportCSVButton> = {
  title: 'Gradebook/ExportCSVButton',
  component: ExportCSVButton,
}

export default meta

type Story = StoryObj<typeof ExportCSVButton>

export const Basic: Story = {
  args: {
    ...mockCSVExportProps,
  },
}
