import React, { useState, type ReactNode } from 'react'
import t from 'format-message'
import { Link } from '@instructure/ui-link'
import { CloseButton } from '@instructure/ui-buttons'
import { View } from '@instructure/ui-view'
import { Flex } from '@instructure/ui-flex'
import { Text } from '@instructure/ui-text'
import { Popover } from '@instructure/ui-popover'
import { TruncateText } from '@instructure/ui-truncate-text'
import { Avatar } from '@instructure/ui-avatar'
import { Spinner } from '@instructure/ui-spinner'
import { ScreenReaderContent } from '@instructure/ui-a11y-content'
import { useGradebookConfig } from '@components/Gradebook/context/GradebookConfigContext'
import {
  useStudentMasteryScores,
  type StudentMasteryScores,
} from '@/hooks/gradebook/useStudentMasteryScores'
import { useLmgbUserDetails, type LmgbUserDetails } from '@/hooks/gradebook/useLmgbUserDetails'
import type { Outcome, StudentRollupData, Student } from '@/types/gradebook/rollup'

export interface StudentPopoverProps {
  student: Student
  studentName: string
  studentGradesUrl: string
  courseId: string
  outcomes?: Outcome[]
  rollups?: StudentRollupData[]
  renderHeader?: (props: HeaderProps) => ReactNode
  renderMasteryScores?: (props: MasteryScoresProps) => ReactNode
  renderActions?: (props: ActionsProps) => ReactNode
}

interface HeaderProps {
  student: Student
  studentName: string
  userDetails?: LmgbUserDetails
}

const Header: React.FC<HeaderProps> = ({ student, studentName, userDetails }) => {
  if (!userDetails) return null

  return (
    <Flex gap="small" alignItems="start">
      <Flex.Item width="60px">
        <Avatar
          as="div"
          size="large"
          name={studentName}
          src={student.avatar_url}
          data-testid="lmgb-student-popover-avatar"
        />
      </Flex.Item>

      <Flex.Item>
        <View display="block" padding="0 large 0 0" maxWidth="320px">
          <View>
            <Text size="content" weight="bold">
              <TruncateText>{studentName}</TruncateText>
            </Text>
          </View>

          <View>
            <Text size="contentSmall">
              <TruncateText>{userDetails.course.name}</TruncateText>
            </Text>
          </View>

          {userDetails.user.sections.length > 0 && (
            <View>
              <Text size="legend">
                <TruncateText>
                  {userDetails.user.sections.map(section => section.name).join(', ')}
                </TruncateText>
              </Text>
            </View>
          )}
        </View>
      </Flex.Item>
    </Flex>
  )
}

interface MasteryScoresProps {
  masteryScores: StudentMasteryScores | null
}

const MasteryScores: React.FC<MasteryScoresProps> = ({ masteryScores }) => {
  if (!masteryScores) return null

  const AverageIcon = masteryScores.averageIcon

  return (
    <Flex>
      <Flex.Item width="60px"></Flex.Item>

      <Flex.Item padding="0 0 0 small">
        <Flex direction="row" alignItems="center" gap="small">
          <Flex.Item width="1.7rem">
            {AverageIcon && <AverageIcon width="120%" height="120%" />}
          </Flex.Item>

          <Flex.Item padding="0 0 xxx-small 0">
            <Text size="medium">
              {`${masteryScores.grossAverage ? masteryScores.grossAverage.toFixed(1) + ' ' : ''}${masteryScores.averageText}`}
            </Text>
          </Flex.Item>
        </Flex>

        <Flex gap="small" margin="x-small small small none">
          {masteryScores.buckets &&
          Object.values(masteryScores.buckets)
            .reverse()
            .map(bucket => {
              const BucketIcon = bucket.icon

              return (
                <Flex key={bucket.name} direction="row" alignItems="center" gap="xx-small">
                  <Flex.Item width="1.4rem" padding="xxx-small 0 0 0">
                    <BucketIcon width="100%" height="100%" />
                  </Flex.Item>

                  <Flex.Item>
                    <ScreenReaderContent>{`${bucket.name} ${bucket.count}`}</ScreenReaderContent>
                    <Text size="medium" aria-hidden="true">
                      {bucket.count}
                    </Text>
                  </Flex.Item>
                </Flex>
              )
            })}
        </Flex>
      </Flex.Item>
    </Flex>
  )
}

interface ActionsProps {
  studentGradesUrl: string
  onMessageClick: () => void
}

const Actions: React.FC<ActionsProps> = ({ studentGradesUrl, onMessageClick }) => {
  return (
    <Flex direction="row" justifyItems="center">
      <Flex.Item>
        <Link onClick={onMessageClick} variant="standalone">
          <Text size="small">{t('Message')}</Text>
        </Link>
      </Flex.Item>

      <View
        as="div"
        margin="none small none small"
        borderWidth="none small none none"
        width="0px"
        height="1.4rem"
      />

      <Flex.Item>
        <Link href={studentGradesUrl} variant="standalone">
          <Text size="small">{t('View Mastery Report')}</Text>
        </Link>
      </Flex.Item>
    </Flex>
  )
}

const Divider: React.FC = () => (
  <View as="div" margin="none none x-small none" borderWidth="small none none none" height="0px" />
)

interface LoadingProps {
  isLoading: boolean
}

const Loading: React.FC<LoadingProps> = ({ isLoading }) => {
  if (!isLoading) return null

  return (
    <View as="div" textAlign="center" margin="medium none">
      <Spinner renderTitle={t('Loading user details')} size="small" />
    </View>
  )
}

interface ErrorMessageProps {
  error: string | null
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  if (!error) return null

  return (
    <View as="div" margin="small none">
      <Text>{error}</Text>
    </View>
  )
}

const Container: React.FC<StudentPopoverProps> = ({
  student,
  studentName,
  studentGradesUrl,
  courseId,
  outcomes = [],
  rollups = [],
  renderHeader,
  renderMasteryScores,
  renderActions,
}) => {
  const [isShowingContent, setIsShowingContent] = useState(false)
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)

  const config = useGradebookConfig()
  const userDetailsQueryHandler = config.resources?.apiHandlers?.userDetailsQuery

  if (!userDetailsQueryHandler) {
    console.warn('StudentPopover: No userDetailsQuery handler provided in GradebookConfigContext.')
  }

  const {
    data: userDetails,
    isLoading,
    error: queryError,
  } = useLmgbUserDetails({
    courseId,
    studentId: String(student.id),
    enabled: isShowingContent && !!userDetailsQueryHandler,
    userDetailsQueryHandler: userDetailsQueryHandler || (async () => ({} as LmgbUserDetails)),
  })

  const error = queryError ? t('Failed to load user details') : null

  const masteryScores = useStudentMasteryScores({
    student,
    outcomes,
    rollups,
  })

  const headerProps: HeaderProps = { student, studentName, userDetails }
  const masteryScoresProps: MasteryScoresProps = { masteryScores }
  const actionsProps: ActionsProps = {
    studentGradesUrl,
    onMessageClick: () => setIsMessageModalOpen(true),
  }

  return (
    <>
      {isMessageModalOpen && (<></>)}
      {/* TODO: https://instructure.atlassian.net/browse/OUTC-575
      {isMessageModalOpen && (
        <MessageStudentsModal
          contextCode={`course_${courseId}`}
          onRequestClose={() => setIsMessageModalOpen(false)}
          open={isMessageModalOpen}
          bulkMessage={false}
          groupConversation={false}
          recipients={[{ id: student.id, displayName: studentName }]}
          title={t('Send a message')}
        />
      )} */}

      <Popover
        renderTrigger={
          <Link isWithinText={false} data-testid="student-cell-link">
            <TruncateText>{studentName}</TruncateText>
          </Link>
        }
        isShowingContent={isShowingContent}
        onShowContent={() => setIsShowingContent(true)}
        onHideContent={() => setIsShowingContent(false)}
        on="click"
        screenReaderLabel={`${t('Student Details for')} ${studentName}`}
        shouldContainFocus
        shouldReturnFocus
        shouldCloseOnDocumentClick
        offsetY="16px"
      >
        <Flex>
          <Flex.Item>
            <CloseButton
              placement="end"
              offset="small"
              onClick={() => setIsShowingContent(false)}
              screenReaderLabel={t('Close')}
            />
          </Flex.Item>

          <Flex.Item>
            <View padding="small" margin="xx-small 0 0 0" display="block" maxWidth="480px" minWidth="300px" minHeight="200px">
              <Loading isLoading={isLoading} />
              <ErrorMessage error={error} />

              {userDetails && (
                <View as="div">
                  <Flex direction="column" alignItems="start">
                    <Flex.Item>
                      {renderHeader ? renderHeader(headerProps) : <Header {...headerProps} />}
                    </Flex.Item>

                    <Flex.Item>
                      {renderMasteryScores ? (
                        renderMasteryScores(masteryScoresProps)
                      ) : (
                        <MasteryScores {...masteryScoresProps} />
                      )}
                    </Flex.Item>
                  </Flex>

                  <Divider />

                  {renderActions ? renderActions(actionsProps) : <Actions {...actionsProps} />}
                </View>
              )}
            </View>
          </Flex.Item>
        </Flex>
      </Popover>
    </>
  )
}

export const StudentPopover: React.FC<StudentPopoverProps> = (props) => {
  return <Container {...props} />
}

export type { HeaderProps, MasteryScoresProps, ActionsProps }
