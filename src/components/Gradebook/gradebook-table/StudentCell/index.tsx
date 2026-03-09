import React, { ReactNode } from 'react'
import { Avatar } from '@instructure/ui-avatar'
import { Flex } from '@instructure/ui-flex'
import { Text } from '@instructure/ui-text'
import { NameDisplayFormat } from '@/util/gradebook/constants'

export interface StudentData {
  id: string
  displayName: string
  sortableName: string
  avatarUrl?: string
  status?: string
}

export interface StudentCellProps {
  student: StudentData
  studentPopover: ReactNode
  secondaryInfo?: string
  showStudentAvatar?: boolean
  nameDisplayFormat?: NameDisplayFormat
}

export const StudentCell: React.FC<StudentCellProps> = ({
  student,
  secondaryInfo,
  showStudentAvatar = true,
  nameDisplayFormat,
  studentPopover,
}) => {
  const shouldShowStudentStatus = student.status === 'inactive' || student.status === 'concluded'
  const studentName =
    nameDisplayFormat === NameDisplayFormat.LAST_FIRST
      ? student.sortableName
      : student.displayName

  return (
    <Flex height="100%" data-testid="student-cell" gap="small">
      {showStudentAvatar && (
        <Flex.Item as="div">
          <Avatar
            as="div"
            size="x-small"
            name={studentName}
            src={student.avatarUrl}
            data-testid="student-avatar"
          />
        </Flex.Item>
      )}

      <Flex.Item as="div" padding="none x-small">
        <Flex direction="column" textAlign="start">
          {studentPopover}
          {secondaryInfo !== undefined && (
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
