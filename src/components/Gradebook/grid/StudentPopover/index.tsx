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
import MasteryLevelIcon from '../../icons/MasteryLevelIcon'

interface HeaderProps {
  student?: Student
  studentName?: string
  userDetails?: LmgbUserDetails
}

export interface HeaderConfig {
  userDetailsQuery: (courseId: string, studentId: string) => Promise<LmgbUserDetails>
  renderHeader?: (props: HeaderProps) => ReactNode
}

interface MasteryScoresProps {
  masteryScores?: StudentMasteryScores | null
}

export interface MasteryScoresConfig {
  renderMasteryScores?: (props: MasteryScoresProps) => ReactNode
}

interface ActionsProps {
  studentGradesUrl?: string
}

type ActionConfigWithCustomRender = {
  renderActions: (props: ActionsProps) => ReactNode
  studentGradesUrl?: never
}

type ActionConfigWithDefaultRender = {
  renderActions?: never
  studentGradesUrl: string
}

export type ActionConfig = ActionConfigWithCustomRender | ActionConfigWithDefaultRender

export interface StudentPopoverProps {
  student: Student
  studentName: string
  courseId: string
  outcomes?: Outcome[]
  rollups?: StudentRollupData[]
  headerConfig: HeaderConfig
  actionConfig: ActionConfig
  masteryScoresConfig?: MasteryScoresConfig
}

const Header: React.FC<HeaderProps> = ({ student, studentName, userDetails }) => {
  return (
    <Flex gap="small" alignItems="start">
      <Flex.Item width="60px">
        <Avatar
          as="div"
          size="large"
          name={studentName!}
          src={student!.avatar_url}
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

          {userDetails?.course.name && (
            <View>
              <Text size="contentSmall">
                <TruncateText>{userDetails.course.name}</TruncateText>
              </Text>
            </View>
          )}

          {userDetails?.user?.sections.length && (
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

const MasteryScores: React.FC<MasteryScoresProps> = ({ masteryScores }) => {
  const { masteryLevelConfig } = useGradebookConfig()

  if (!masteryScores) return null

  const { averageIcon, averageText, grossAverage } = masteryScores

  const masteryLevelName = masteryLevelConfig?.masteryLevelOverrides?.[averageIcon]?.name || averageText
  const availableBuckets = masteryLevelConfig?.availableLevels

  return (
    <Flex>
      <Flex.Item width="60px"></Flex.Item>

      <Flex.Item padding="0 0 0 small">
        <Flex direction="row" alignItems="center" gap="small">
          <Flex.Item width="1.7rem">
            <MasteryLevelIcon masteryLevel={averageIcon} ariaHidden />
          </Flex.Item>

          <Flex.Item padding="0 0 xxx-small 0">
            <Text size="medium">
              {`${grossAverage ? grossAverage.toFixed(1) + ' ' : ''}${masteryLevelName}`}
            </Text>
          </Flex.Item>
        </Flex>

        <Flex gap="small" margin="x-small small small none">
          {masteryScores.buckets &&
          Object.values(masteryScores.buckets)
            .filter(bucket => !availableBuckets || availableBuckets.includes(bucket.icon))
            .reverse()
            .map(bucket => {
              const { icon, name, count } = bucket
              const bucketName = masteryLevelConfig?.masteryLevelOverrides?.[icon]?.name || name
              return (
                <Flex key={bucket.name} direction="row" alignItems="center" gap="xx-small">
                  <Flex.Item width="1.4rem" padding="xxx-small 0 0 0">
                    <MasteryLevelIcon masteryLevel={icon} width="100%" height="100%" ariaHidden />
                  </Flex.Item>

                  <Flex.Item>
                    <ScreenReaderContent>{`${bucketName} ${count}`}</ScreenReaderContent>
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

const Actions: React.FC<ActionsProps> = ({ studentGradesUrl }) => {
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)

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

      <Flex direction="row" justifyItems="center">
        <Flex.Item>
          <Link onClick={() => setIsMessageModalOpen(true)} variant="standalone">
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

        {studentGradesUrl && (
          <Flex.Item>
            <Link href={studentGradesUrl} variant="standalone">
              <Text size="small">{t('View Mastery Report')}</Text>
            </Link>
          </Flex.Item>
        )}
      </Flex>
    </>
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
  courseId,
  outcomes = [],
  rollups = [],
  headerConfig,
  actionConfig,
  masteryScoresConfig,
}) => {
  const [isShowingContent, setIsShowingContent] = useState(false)

  const { userDetailsQuery, renderHeader } = headerConfig
  const { renderActions, studentGradesUrl } = actionConfig
  const { renderMasteryScores } = masteryScoresConfig || {}

  const {
    data: userDetails,
    isLoading,
    error: queryError,
  } = useLmgbUserDetails({
    courseId,
    studentId: String(student.id),
    enabled: isShowingContent,
    userDetailsQueryHandler: userDetailsQuery,
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
  }

  return (
    <>
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
