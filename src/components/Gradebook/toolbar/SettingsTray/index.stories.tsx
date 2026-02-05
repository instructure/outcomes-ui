import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { SettingsTray } from './index'
import { Button } from '@instructure/ui-buttons'
import { View } from '@instructure/ui-view'
import { StoryWrapper } from '@/components/Gradebook/storybook/decorators'

const meta: Meta<typeof SettingsTray> = {
  title: 'Gradebook/SettingsTray',
  component: SettingsTray,
  decorators: [
    (Story) => (
      <StoryWrapper>
        <Story />
      </StoryWrapper>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof SettingsTray>

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <View>
        <Button onClick={() => setOpen(true)}>Open Settings</Button>
        <SettingsTray open={open} onDismiss={() => setOpen(false)} />
      </View>
    )
  },
}

export const Open: Story = {
  render: () => <SettingsTray open={true} onDismiss={() => {}} />,
}
