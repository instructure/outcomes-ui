import t from 'format-message'
import React, { useState, useRef } from 'react'
import { IconButton } from '@instructure/ui-buttons'
import { Flex } from '@instructure/ui-flex'
import {
  IconAttachMediaLine,
  IconCodeLine,
  IconDocumentLine,
  IconFolderLine,
  IconFolderLockedLine,
  IconImageLine,
  IconMsExcelLine,
  IconMsPptLine,
  IconPaperclipLine,
  IconPdfLine,
  IconXSolid,
  IconZippedLine,
} from '@instructure/ui-icons'
import { Modal } from '@instructure/ui-modal'
import { Spinner } from '@instructure/ui-spinner'
import { Text } from '@instructure/ui-text'
import { Tooltip } from '@instructure/ui-tooltip'
import { TruncateText } from '@instructure/ui-truncate-text'
import { View } from '@instructure/ui-view'
import type { SendMessageArgs } from './types'

export type Attachment = {
  id: string
  display_name?: string
  mime_class?: string
  thumbnail_url?: string
  isLoading?: boolean
}

const MIME_ICONS: Record<string, React.ReactElement> = {
  audio: <IconAttachMediaLine title={t('Audio File')} />,
  code: <IconCodeLine title={t('Code File')} />,
  doc: <IconDocumentLine title={t('Doc File')} />,
  'folder-locked': <IconFolderLockedLine title={t('Folder Locked')} />,
  folder: <IconFolderLine title={t('Folder')} />,
  html: <IconCodeLine title={t('HTML File')} />,
  image: <IconImageLine title={t('Image File')} />,
  pdf: <IconPdfLine title={t('PDF File')} />,
  ppt: <IconMsPptLine title={t('PowerPoint File')} />,
  text: <IconDocumentLine title={t('Text File')} />,
  video: <IconAttachMediaLine title={t('Video File')} />,
  xls: <IconMsExcelLine title={t('Excel File')} />,
  zip: <IconZippedLine title={t('Zip File')} />,
}

const DEFAULT_FILE_ICON = <IconPaperclipLine title={t('File')} />

function getFileIcon(attachment: Attachment): React.ReactElement {
  if (attachment.mime_class === 'image' && attachment.thumbnail_url) {
    return (
      <img
        alt={t('{ filename } preview', {filename: attachment.display_name})}
        src={attachment.thumbnail_url}
        style={{height: '3rem', width: '3rem'}}
      />
    )
  }
  return attachment.mime_class ? (MIME_ICONS[attachment.mime_class] ?? DEFAULT_FILE_ICON) : DEFAULT_FILE_ICON
}

type RemovableItemProps = {
  onRemove: () => void
  screenReaderLabel: string
  childrenAriaLabel: string
  children: React.ReactNode
}

export const RemovableItem: React.FC<RemovableItemProps> = ({
  onRemove,
  screenReaderLabel,
  childrenAriaLabel,
  children,
}) => {
  const [showRemove, setShowRemove] = useState(false)
  const blurTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleInteraction = () => {
    if (blurTimeout.current) clearTimeout(blurTimeout.current)
    setShowRemove(true)
  }
  const handleExit = () => {
    blurTimeout.current = setTimeout(() => setShowRemove(false))
  }

  return (
    <View position="relative" display="inline-block">
      <View
        onMouseEnter={handleInteraction}
        onMouseLeave={handleExit}
        onFocus={handleInteraction}
        onBlur={handleExit}
        tabIndex={0}
        role="button"
        aria-label={childrenAriaLabel}
        data-testid="removable-item"
      >
        {children}
      </View>
      {showRemove && (
        <div style={{ position: 'absolute', right: 0, top: 0 }}>
          <IconButton
            size="small"
            shape="circle"
            screenReaderLabel={screenReaderLabel}
            onClick={onRemove}
            onMouseEnter={handleInteraction}
            onMouseLeave={handleExit}
            onFocus={handleInteraction}
            onBlur={handleExit}
            data-testid="remove-button"
          >
            <IconXSolid />
          </IconButton>
        </div>
      )}
    </View>
  )
}

type AttachmentItemProps = {
  attachment: Attachment
  onReplace: (e: React.ChangeEvent<HTMLInputElement>) => void
  onDelete: () => void
}

export const AttachmentItem: React.FC<AttachmentItemProps> = ({ attachment, onReplace, onDelete }) => {
  const inputRef = useRef<HTMLInputElement>(null)

  if (attachment.isLoading) {
    return <Spinner renderTitle={t('Loading')} size="medium" />
  }

  const displayName = attachment.display_name ?? attachment.id

  return (
    <RemovableItem
      onRemove={onDelete}
      screenReaderLabel={t('Remove Attachment')}
      childrenAriaLabel={t('Replace { name } button', { name: displayName })}
    >
      <Flex direction="column" padding="xx-small small" width="80px">
        <Flex.Item margin="none xx-small xxx-small xx-small" align="center">
          {getFileIcon(attachment)}
        </Flex.Item>
        <Flex.Item>
          <Text size="small">
            <TruncateText position="middle" maxLines={3}>
              {displayName}
            </TruncateText>
          </Text>
        </Flex.Item>
      </Flex>
      <input
        data-testid="replacement-input"
        ref={inputRef}
        type="file"
        style={{ display: 'none' }}
        aria-hidden={true}
        onChange={onReplace}
      />
    </RemovableItem>
  )
}

type AttachmentDisplayProps = {
  attachments: Attachment[]
  onDeleteItem: (id: string) => void
  onReplaceItem: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void
}

export const AttachmentDisplay: React.FC<AttachmentDisplayProps> = ({
  attachments,
  onDeleteItem,
  onReplaceItem,
}) => (
  <Flex alignItems="start" wrap="wrap">
    {attachments.map(a => (
      <Flex.Item key={a.id}>
        <AttachmentItem
          attachment={a}
          onDelete={() => onDeleteItem(a.id)}
          onReplace={e => onReplaceItem(a.id, e)}
        />
      </Flex.Item>
    ))}
  </Flex>
)

type FileAttachmentUploadProps = {
  onAddItem: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const FileAttachmentUpload: React.FC<FileAttachmentUploadProps> = ({ onAddItem }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <>
      <Tooltip renderTip={t('Add an attachment')} placement="top">
        <IconButton
          screenReaderLabel={t('Add an attachment')}
          onClick={() => inputRef.current?.click()}
          margin="xx-small"
          data-testid="attachment-upload"
        >
          <IconPaperclipLine />
        </IconButton>
      </Tooltip>
      <input
        data-testid="attachment-input"
        ref={inputRef}
        type="file"
        style={{ display: 'none' }}
        aria-hidden={true}
        onChange={onAddItem}
        multiple={true}
      />
    </>
  )
}

type AttachmentUploadSpinnerProps = {
  sendMessage: (args: SendMessageArgs) => void
  isMessageSending: boolean
  pendingUploads: Attachment[]
  sendArgs: SendMessageArgs | null
}

export const AttachmentUploadSpinner: React.FC<AttachmentUploadSpinnerProps> = ({
  sendMessage,
  isMessageSending,
  pendingUploads,
  sendArgs,
}) => {
  const label = t('Uploading Files')
  return (
    <Modal
      open={isMessageSending && pendingUploads.length > 0}
      label={label}
      shouldCloseOnDocumentClick={false}
      onExited={() => {
        if (sendArgs) sendMessage(sendArgs)
      }}
    >
      <Modal.Body>
        <Flex direction="column" textAlign="center">
          <Flex.Item>
            <Spinner renderTitle={label} size="large" />
          </Flex.Item>
          <Flex.Item>
            <Text>{t('Please wait while we upload attachments.')}</Text>
          </Flex.Item>
        </Flex>
      </Modal.Body>
    </Modal>
  )
}
