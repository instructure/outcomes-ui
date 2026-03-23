import t from 'format-message'
import React, { useState, useMemo } from 'react'
import { Button, CloseButton, IconButton } from '@instructure/ui-buttons'
import { Checkbox } from '@instructure/ui-checkbox'
import { Flex } from '@instructure/ui-flex'
import { Heading } from '@instructure/ui-heading'
import {
  IconArrowOpenDownLine,
  IconArrowOpenUpLine,
  IconAttachMediaLine,
  IconWarningSolid,
} from '@instructure/ui-icons'
import { Link } from '@instructure/ui-link'
import { Modal } from '@instructure/ui-modal'
import { Spinner } from '@instructure/ui-spinner'
import { Table } from '@instructure/ui-table'
import { Text } from '@instructure/ui-text'
import { TextArea } from '@instructure/ui-text-area'
import { TextInput } from '@instructure/ui-text-input'
import { Tooltip } from '@instructure/ui-tooltip'
import { View } from '@instructure/ui-view'
import { sortBy } from 'es-toolkit/compat'
import UploadMedia from '@instructure/canvas-media'
import type { Student, SendMessageArgs, ObserverUser } from './types'
import Pill from './Pill'
import {
  type Attachment,
  AttachmentDisplay,
  AttachmentUploadSpinner,
  FileAttachmentUpload,
} from './messageAttachments'
import {
  type MediaUploadFile,
  MediaAttachment,
  UploadMediaStrings,
  MediaCaptureStrings,
  SelectStrings,
} from './mediaComment'

export type { Student, SendMessageArgs, ObserverUser }

function observerCount(
  students: Student[],
  observers: Record<string, ObserverUser[]>,
) {
  return students.reduce((acc, student) => acc + (observers[student.id]?.length || 0), 0)
}

function calculateObserverRecipientCount(selectedObservers: Record<string, string[]>) {
  return Object.values(selectedObservers).reduce((acc, array) => acc + array.length, 0)
}

function isLengthBetweenBoundaries(subsetLength: number, totalLength: number) {
  return subsetLength > 0 && subsetLength < totalLength
}

function initializeSelectedObservers(studentCollection: Student[]) {
  return studentCollection.reduce(
    (map, student) => ({ ...map, [student.id]: [] }),
    {} as Record<string, string[]>,
  )
}

export type Props = {
  onClose: () => void
  students: Student[]
  onSend: (args: SendMessageArgs) => void
  attachments?: Attachment[]
  pendingUploads?: Attachment[]
  onAddAttachment?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onDeleteAttachment?: (id: string) => void
  observersByStudentID?: Record<string, ObserverUser[]>
  isLoadingObservers?: boolean
  userId?: string
}

const MessageStudentsWhoDialog = ({
  onClose,
  students,
  onSend,
  attachments = [],
  pendingUploads = [],
  onAddAttachment,
  onDeleteAttachment,
  observersByStudentID = {},
  isLoadingObservers = false,
  userId,
}: Props) => {
  const [open, setOpen] = useState(true)
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState('')
  const [subject, setSubject] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [pendingSendArgs, setPendingSendArgs] = useState<SendMessageArgs | null>(null)
  const [showTable, setShowTable] = useState(false)
  const [mediaUploadOpen, setMediaUploadOpen] = useState(false)
  const [mediaUploadFile, setMediaUploadFile] = useState<MediaUploadFile | null>(null)
  const [mediaPreviewURL, setMediaPreviewURL] = useState<string | null>(null)
  const [mediaTitle, setMediaTitle] = useState<string | null>(null)

  const close = () => setOpen(false)

  const sortedStudents = useMemo(
    () => [...students].sort((a, b) => a.sortableName.localeCompare(b.sortableName)),
    [students],
  )

  const [selectedObservers, setSelectedObservers] = useState(() => initializeSelectedObservers(sortedStudents))
  const [selectedStudents, setSelectedStudents] = useState(() => sortedStudents.map(s => s.id))

  const observerRecipientCount = isLoadingObservers
    ? 0
    : calculateObserverRecipientCount(selectedObservers)

  const totalObserverCount = observerCount(sortedStudents, observersByStudentID)
  const selectedObserverCount = Object.values(selectedObservers).reduce((acc, a) => acc + a.length, 0)

  const isDisabledStudentsCheckbox = sortedStudents.length === 0
  const isCheckedStudentsCheckbox = sortedStudents.length > 0 && selectedStudents.length === sortedStudents.length
  const isIndeterminateStudentsCheckbox = isLengthBetweenBoundaries(selectedStudents.length, sortedStudents.length)

  const isDisabledObserversCheckbox = totalObserverCount === 0
  const isCheckedObserversCheckbox = totalObserverCount > 0 && selectedObserverCount === totalObserverCount
  const isIndeterminateObserversCheckbox = isLengthBetweenBoundaries(selectedObserverCount, totalObserverCount)

  const isMessagePresent = message.trim().length > 0
  const areRecipientsPresent =
    selectedStudents.length + Object.values(selectedObservers).flat().length > 0
  const isFormDataValid = isMessagePresent && areRecipientsPresent

  const handleSendButton = () => {
    setIsSubmitted(true)
    if (!isFormDataValid) return

    const uniqueRecipientsIds = [
      ...new Set([...selectedStudents, ...Object.values(selectedObservers).flat()]),
    ]

    const args: SendMessageArgs = {
      recipientsIds: uniqueRecipientsIds,
      subject,
      body: message.trim(),
    }

    if (mediaUploadFile) {
      args.mediaFile = { id: mediaUploadFile.media_id, type: mediaUploadFile.media_type }
    }

    if (attachments?.length) {
      args.attachmentIds = attachments.map(a => a.id)
    }

    if (pendingUploads.length) {
      setPendingSendArgs(args)
      setSending(true)
    } else {
      onSend(args)
      close()
    }
  }

  const onReplaceAttachment = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    onDeleteAttachment?.(id)
    onAddAttachment?.(e)
  }

  const onRemoveMediaComment = () => {
    if (mediaPreviewURL) URL.revokeObjectURL(mediaPreviewURL)
    setMediaPreviewURL(null)
    setMediaUploadFile(null)
  }

  const onMediaUploadStart = (file: (DataTransferItem | File) & { title: string }) => {
    setMediaTitle(file.title)
  }

  const onMediaUploadComplete = (
    err: unknown,
    mediaData: { mediaObject?: { media_object: MediaUploadFile }; uploadedFile: File },
  ) => {
    if (!err && mediaData.mediaObject) {
      setMediaUploadFile(mediaData.mediaObject.media_object)
      setMediaPreviewURL(URL.createObjectURL(mediaData.uploadedFile))
    }
  }

  const toggleSelection = (id: string, array: string[]) => {
    const newArray = [...array]
    const index = newArray.indexOf(id)
    if (index === -1) newArray.push(id)
    else newArray.splice(index, 1)
    return newArray
  }

  const toggleStudentSelection = (id: string) => {
    setSelectedStudents(prev => toggleSelection(id, prev))
  }

  const toggleObserverSelection = (studentId: string, observerId: string) => {
    setSelectedObservers(prev => ({
      ...prev,
      [studentId]: toggleSelection(observerId, prev[studentId] ?? []),
    }))
  }

  const onStudentsCheckboxChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedStudents(e.target.checked ? sortedStudents.map(s => s.id) : [])
  }

  const onObserversCheckboxChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedObservers(
        sortedStudents.reduce(
          (map, student) => ({
            ...map,
            [student.id]: (observersByStudentID[student.id] ?? []).map(o => o.id),
          }),
          {} as Record<string, string[]>,
        ),
      )
    } else {
      setSelectedObservers(initializeSelectedObservers(students))
    }
  }

  return (
    <>
      <Modal
        open={open}
        label={t('Compose Message')}
        onDismiss={close}
        onExited={onClose}
        overflow="scroll"
        shouldCloseOnDocumentClick={false}
        size="large"
      >
        <Modal.Header>
          <CloseButton
            placement="end"
            offset="small"
            onClick={close}
            screenReaderLabel={t('Close')}
          />
          <Heading>{t('Compose Message')}</Heading>
        </Modal.Header>

        <Modal.Body>
          {isLoadingObservers ? (
            <Spinner renderTitle={t('Loading')} />
          ) : (
            <>
              <Flex>
                <Flex.Item>
                  <Text weight="bold">{t('Send Message To:')}</Text>
                </Flex.Item>
                <Flex.Item margin="0 0 0 medium">
                  <Checkbox
                    indeterminate={isIndeterminateStudentsCheckbox}
                    disabled={isDisabledStudentsCheckbox}
                    onChange={onStudentsCheckboxChanged}
                    checked={isCheckedStudentsCheckbox}
                    defaultChecked={true}
                    data-testid="total-student-checkbox"
                    label={
                      <Text weight="bold">
                        {t('{ studentCount } Students', { studentCount: selectedStudents.length })}
                      </Text>
                    }
                  />
                </Flex.Item>
                <Flex.Item margin="0 0 0 medium">
                  <Checkbox
                    indeterminate={isIndeterminateObserversCheckbox}
                    disabled={isDisabledObserversCheckbox}
                    onChange={onObserversCheckboxChanged}
                    checked={isCheckedObserversCheckbox}
                    data-testid="total-observer-checkbox"
                    label={
                      <Text weight="bold">
                        {t('{ observerCount } Observers', { observerCount: observerRecipientCount })}
                      </Text>
                    }
                  />
                </Flex.Item>
                <Flex.Item as="div" shouldGrow={true} textAlign="end">
                  <Link
                    onClick={() => setShowTable(prev => !prev)}
                    renderIcon={showTable ? <IconArrowOpenUpLine /> : <IconArrowOpenDownLine />}
                    iconPlacement="end"
                    data-testid="show_all_recipients"
                  >
                    {showTable ? t('Hide all recipients') : t('Show all recipients')}
                  </Link>
                </Flex.Item>
              </Flex>

              {!areRecipientsPresent && isSubmitted && (
                <View as="div" margin="0 xxx-small xx-small 0">
                  <Text size="small" color="danger">
                    <View textAlign="center">
                      <View as="div" display="inline-block" margin="0 xxx-small xx-small 0">
                        <IconWarningSolid />
                      </View>
                      {t('Please select at least one recipient.')}
                    </View>
                  </Text>
                </View>
              )}

              {showTable && (
                <Table caption={t('List of students and observers')}>
                  <Table.Head>
                    <Table.Row>
                      <Table.ColHeader id="students">{t('Students')}</Table.ColHeader>
                      <Table.ColHeader id="observers">{t('Observers')}</Table.ColHeader>
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    {sortedStudents.map(student => (
                      <Table.Row key={student.id}>
                        <Table.Cell>
                          <Pill
                            studentId={student.id}
                            text={student.name}
                            selected={selectedStudents.includes(student.id)}
                            onClick={toggleStudentSelection}
                          />
                        </Table.Cell>
                        <Table.Cell>
                          <Flex direction="row" margin="0 0 0 small" wrap="wrap">
                            {sortBy(
                              observersByStudentID[student.id] || [],
                              observer => observer.sortableName,
                            ).map(observer => (
                              <Flex.Item key={observer.id}>
                                <Pill
                                  studentId={student.id}
                                  observerId={observer.id}
                                  text={observer.name}
                                  selected={selectedObservers[student.id]?.includes(observer.id)}
                                  onClick={toggleObserverSelection}
                                />
                              </Flex.Item>
                            ))}
                          </Flex>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              )}

              <br />
              <TextInput
                data-testid="subject-input"
                renderLabel={t('Subject')}
                placeholder={t('Type Something…')}
                value={subject}
                onChange={(_event, value) => setSubject(value)}
              />
              <br />
              <TextArea
                data-testid="message-input"
                required={true}
                height="200px"
                label={t('Message')}
                placeholder={t('Type your message here…')}
                value={message}
                onChange={e => setMessage(e.target.value)}
                messages={
                  !isMessagePresent && isSubmitted
                    ? [
                      {
                        type: 'error',
                        text: (
                          <View textAlign="center">
                            <View as="div" display="inline-block" margin="0 xxx-small xx-small 0">
                              <IconWarningSolid />
                            </View>
                            {t('A message is required to send this message.')}
                          </View>
                        ),
                      },
                    ]
                    : []
                }
              />

              <Flex alignItems="start">
                {mediaUploadFile && mediaPreviewURL && (
                  <Flex.Item>
                    <MediaAttachment
                      file={{
                        mediaID: mediaUploadFile.media_id,
                        src: mediaPreviewURL,
                        title: mediaTitle || mediaUploadFile.title,
                        type: mediaUploadFile.media_type,
                      }}
                      onRemoveMediaComment={onRemoveMediaComment}
                    />
                  </Flex.Item>
                )}
                {onDeleteAttachment && onReplaceAttachment && (
                  <Flex.Item shouldShrink={true}>
                    <AttachmentDisplay
                      attachments={[...attachments, ...pendingUploads]}
                      onDeleteItem={onDeleteAttachment}
                      onReplaceItem={onReplaceAttachment}
                    />
                  </Flex.Item>)}
              </Flex>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Flex justifyItems="space-between" width="100%">
            <Flex.Item>
              {onAddAttachment && <FileAttachmentUpload onAddItem={onAddAttachment} />}
              {userId && (
                <Tooltip renderTip={t('Record an audio or video comment')} placement="top">
                  <IconButton
                    screenReaderLabel={t('Record an audio or video comment')}
                    onClick={() => setMediaUploadOpen(true)}
                    margin="xx-small"
                    data-testid="media-upload"
                    interaction={mediaUploadFile ? 'disabled' : 'enabled'}
                  >
                    <IconAttachMediaLine />
                  </IconButton>
                </Tooltip>
              )}
            </Flex.Item>
            <Flex.Item>
              <Flex>
                <Flex.Item>
                  <Button focusColor="info" color="primary-inverse" onClick={close}>
                    {t('Cancel')}
                  </Button>
                </Flex.Item>
                <Flex.Item margin="0 0 0 x-small">
                  <Button
                    data-testid="send-message-button"
                    color="primary"
                    onClick={handleSendButton}
                  >
                    {t('Send')}
                  </Button>
                </Flex.Item>
              </Flex>
            </Flex.Item>
          </Flex>
        </Modal.Footer>
      </Modal>

      <AttachmentUploadSpinner
        sendMessage={onSend}
        isMessageSending={sending}
        pendingUploads={pendingUploads}
        sendArgs={pendingSendArgs}
      />
      {userId && (
        <UploadMedia
          key={mediaUploadFile?.media_id}
          onStartUpload={onMediaUploadStart}
          onUploadComplete={onMediaUploadComplete}
          onDismiss={() => setMediaUploadOpen(false)}
          open={mediaUploadOpen}
          tabs={{ embed: false, record: true, upload: true }}
          uploadMediaTranslations={{ UploadMediaStrings, MediaCaptureStrings, SelectStrings }}
          liveRegion={() => document.getElementById('flash_screenreader_holder')}
          rcsConfig={{ contextId: userId, contextType: 'user' }}
          disableSubmitWhileUploading={true}
        />
      )}
    </>
  )
}

export default MessageStudentsWhoDialog
