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
import { ScreenReaderContent } from '@instructure/ui-a11y-content'
import { Spinner } from '@instructure/ui-spinner'
import { useGradebookConfig } from '@/components/Gradebook/context/GradebookConfigContext'
import MasteryLevelIcon from '@/components/Gradebook/icons/MasteryLevelIcon'
import type { LmgbUserDetails, Student, StudentMasteryScores } from '@/types/gradebook'

interface HeaderProps {
  student: Student
  studentName: string
  userDetails: LmgbUserDetails
}

interface MasteryScoresProps {
  masteryScores?: StudentMasteryScores
}

interface ActionsProps {
  studentGradesUrl?: string
}

interface LoadingProps {
  isLoading: boolean
}

interface ErrorMessageProps {
  error: string | null
}

type HeaderSlot =
  | { headerOverride: ReactNode; student?: never; userDetails?: never }
  | { headerOverride?: never; student: Student; userDetails: LmgbUserDetails }

type MasteryScoresSlot =
  | { masteryScoresOverride: ReactNode; masteryScores?: never }
  | { masteryScoresOverride?: never; masteryScores?: StudentMasteryScores }

type ActionSlot =
  | { actionsOverride: ReactNode; studentGradesUrl?: never }
  | { actionsOverride?: never; studentGradesUrl: string }

export type StudentPopoverProps = {
  studentName: string
  isLoading?: boolean
  error?: string | null
  onShowingContentChange?: (isShowing: boolean) => void
} & HeaderSlot & MasteryScoresSlot & ActionSlot

const Header: React.FC<HeaderProps> = ({ student, studentName, userDetails }) => {
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

          {userDetails.course.name && (
            <View>
              <Text size="contentSmall">
                <TruncateText>{userDetails.course.name}</TruncateText>
              </Text>
            </View>
          )}

          {userDetails.user.sections.length && (
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

const Loading: React.FC<LoadingProps> = ({ isLoading }) => {
  if (!isLoading) return null

  return (
    <View as="div" textAlign="center" margin="medium none">
      <Spinner renderTitle={t('Loading user details')} size="small" />
    </View>
  )
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  if (!error) return null

  return (
    <View as="div" margin="large none">
      <Text>{error}</Text>
    </View>
  )
}

export const StudentPopover: React.FC<StudentPopoverProps> = ({
  studentName,
  headerOverride,
  student,
  userDetails,
  masteryScores,
  masteryScoresOverride,
  actionsOverride,
  studentGradesUrl,
  isLoading = false,
  error = null,
  onShowingContentChange,
}) => {
  const [isShowingContent, setIsShowingContent] = useState(false)

  const handleShowingContentChange = (isShowing: boolean) => {
    setIsShowingContent(isShowing)
    onShowingContentChange?.(isShowing)
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
        onShowContent={() => handleShowingContentChange(true)}
        onHideContent={() => handleShowingContentChange(false)}
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
              onClick={() => handleShowingContentChange(false)}
              screenReaderLabel={t('Close')}
            />
          </Flex.Item>

          <Flex.Item>
            <View padding="small" margin="xx-small 0 0 0" display="block" maxWidth="480px" minWidth="300px" minHeight="200px">
              <Loading isLoading={isLoading} />
              <ErrorMessage error={error} />

              {!isLoading && !error && (
                <View as="div">
                  <Flex direction="column" alignItems="start">
                    <Flex.Item>
                      {headerOverride ?? (
                        <Header student={student!} studentName={studentName!} userDetails={userDetails!} />
                      )}
                    </Flex.Item>

                    <Flex.Item>
                      {masteryScoresOverride ?? <MasteryScores masteryScores={masteryScores} />}
                    </Flex.Item>
                  </Flex>

                  <Divider />

                  {actionsOverride ?? <Actions studentGradesUrl={studentGradesUrl} />}
                </View>
              )}
            </View>
          </Flex.Item>
        </Flex>
      </Popover>
    </>
  )
}
