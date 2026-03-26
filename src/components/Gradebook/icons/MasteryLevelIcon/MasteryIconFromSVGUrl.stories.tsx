import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { type MasteryIconOptions, masteryLevelToSvgUrl } from '@/util/gradebook/masteryLevelToSvgUrl'
import type { MasteryLevel } from '@/types/gradebook'

interface MasteryIconFromSVGUrlProps {
  masteryLevel: MasteryLevel
  options?: MasteryIconOptions
}

const MasteryIconFromSVGUrl = ({ masteryLevel, options }: MasteryIconFromSVGUrlProps) => {
  const src = masteryLevelToSvgUrl(masteryLevel, options)
  return <img src={src ?? undefined} alt={masteryLevel} width={32} height={32} />
}

const meta: Meta<typeof MasteryIconFromSVGUrl> = {
  title: 'Gradebook/MasteryLevelIcon/MasteryIconFromSVGUrl',
  component: MasteryIconFromSVGUrl,
  argTypes: {
    masteryLevel: {
      control: 'select',
      options: ['exceeds_mastery', 'mastery', 'near_mastery', 'remediation', 'unassessed', 'no_evidence'] satisfies MasteryLevel[],
    },
  },
}

export default meta

type Story = StoryObj<typeof MasteryIconFromSVGUrl>

export const ExceedsMastery: Story = {
  args: {
    masteryLevel: 'exceeds_mastery'
  }
}

export const Mastery: Story = {
  args: {
    masteryLevel: 'mastery'
  }
}

export const NearMastery: Story = {
  args: {
    masteryLevel: 'near_mastery'
  }
}

export const Remediation: Story = {
  args: {
    masteryLevel: 'remediation'
  }
}

export const Unassessed: Story = {
  args: {
    masteryLevel: 'unassessed'
  }
}

export const NoEvidence: Story = {
  args: {
    masteryLevel: 'no_evidence'
  }
}

export const ExceedsMasteryColorOverride: Story = {
  args: {
    masteryLevel: 'exceeds_mastery',
    options: {
      fill: '#FF00EE'
    }
  }
}
