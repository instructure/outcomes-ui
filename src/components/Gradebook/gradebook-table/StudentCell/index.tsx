import React from 'react'
import { Avatar } from '@instructure/ui-avatar'
import { Flex } from '@instructure/ui-flex'
import { Text } from '@instructure/ui-text'
import { Outcome, Student, StudentRollupData } from '@/types/gradebook/rollup'
import { SecondaryInfoDisplay, NameDisplayFormat } from '@/util/gradebook/constants'
import { useGradebookConfig } from '@/components/Gradebook/context/GradebookConfigContext'

export interface StudentCellProps {
  courseId: string
  student: Student
  secondaryInfoDisplay?: SecondaryInfoDisplay
  showStudentAvatar?: boolean
  nameDisplayFormat?: NameDisplayFormat
  outcomes?: Outcome[]
  rollups?: StudentRollupData[]
}

const getSecondaryInfo = (student: Student, secondaryInfoDisplay?: SecondaryInfoDisplay) => {
  if (!secondaryInfoDisplay) return null

  switch (secondaryInfoDisplay) {
    case SecondaryInfoDisplay.SIS_ID:
      return student.sis_id || ''
    case SecondaryInfoDisplay.INTEGRATION_ID:
      return student.integration_id || ''
    case SecondaryInfoDisplay.LOGIN_ID:
      return student.login_id || ''
    default:
      return null
  }
}

export const StudentCell: React.FC<StudentCellProps> = ({
  courseId,
  student,
  secondaryInfoDisplay,
  showStudentAvatar = true,
  nameDisplayFormat,
  outcomes,
  rollups,
}) => {
  const { components } = useGradebookConfig()
  const StudentPopover = components.StudentPopover

  const shouldShowStudentStatus = student.status === 'inactive' || student.status === 'concluded'
  const secondaryInfo = getSecondaryInfo(student, secondaryInfoDisplay)
  const studentName =
    nameDisplayFormat === NameDisplayFormat.LAST_FIRST
      ? student.sortable_name
      : student.display_name

  return (
    <Flex height="100%" data-testid="student-cell" gap="small">
      {showStudentAvatar && (
        <Flex.Item as="div">
          <Avatar
            as="div"
            size="x-small"
            name={studentName}
            src={student.avatar_url}
            data-testid="student-avatar"
          />
        </Flex.Item>
      )}

      <Flex.Item as="div" padding="none x-small">
        <Flex direction="column" textAlign="start">
          <StudentPopover
            key={student.id}
            student={student}
            studentName={studentName}
            courseId={courseId}
            outcomes={outcomes}
            rollups={rollups}
          />
          {secondaryInfo !== null && (
            <Text size="legend" color="secondary" data-testid="student-secondary-info">
              {secondaryInfo}
            </Text>
          )}
        </Flex>
      </Flex.Item>

      {shouldShowStudentStatus && (
        <Flex.Item data-testid="student-status">
          <span className="label">{student.status}</span>
        </Flex.Item>
      )}
    </Flex>
  )
}
