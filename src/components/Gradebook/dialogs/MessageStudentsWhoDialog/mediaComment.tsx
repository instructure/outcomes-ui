import t from 'format-message'
import React from 'react'
import {RemovableItem} from './messageAttachments'

export type MediaUploadFile = {
  media_id: string
  title: string
  media_type: string
  media_tracks?: {id: string; src: string; label: string; type: string; language: string}[]
}

type MediaAttachmentProps = {
  file: {
    mediaID: string
    src?: string
    title: string
    type?: string
  }
  onRemoveMediaComment?: () => void
}

export const MediaAttachment: React.FC<MediaAttachmentProps> = ({file, onRemoveMediaComment}) => {
  const isAudio = file.type?.startsWith('audio')
  const player = isAudio ? (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <audio src={file.src} controls style={{width: '20rem'}} />
  ) : (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <video src={file.src} controls style={{width: '20rem', height: '11.25rem'}} />
  )

  if (onRemoveMediaComment) {
    return (
      <RemovableItem
        onRemove={onRemoveMediaComment}
        screenReaderLabel={t('Remove media comment')}
        childrenAriaLabel={t('Media comment content')}
      >
        {player}
      </RemovableItem>
    )
  }
  return player
}

export const UploadMediaStrings = {
  LOADING_MEDIA: t('Loading Media'),
  PROGRESS_LABEL: t('Uploading media Progress'),
  ADD_CLOSED_CAPTIONS_OR_SUBTITLES: t('Add CC/Subtitle'),
  COMPUTER_PANEL_TITLE: t('Computer'),
  DRAG_FILE_TEXT: t('Drag a File Here'),
  RECORD_PANEL_TITLE: t('Record'),
  EMBED_PANEL_TITLE: t('Embed'),
  SUBMIT_TEXT: t('Submit'),
  CLOSE_TEXT: t('Close'),
  UPLOAD_MEDIA_LABEL: t('Upload Media'),
  CLEAR_FILE_TEXT: t('Remove'),
  INVALID_FILE_TEXT: t('Invalid file type'),
  DRAG_DROP_CLICK_TO_BROWSE: t('Drag and drop, or click to browse your computer'),
  UPLOADING_ERROR: t('Error uploading video/audio recording'),
}

export const MediaCaptureStrings = {
  ARIA_VIDEO_LABEL: t('Video Player'),
  ARIA_VOLUME: t('Current Volume Level'),
  ARIA_RECORDING: t('Recording'),
  DEFAULT_ERROR: t('Something went wrong accessing your mic or webcam.'),
  DEVICE_AUDIO: t('Mic'),
  DEVICE_VIDEO: t('Webcam'),
  FILE_PLACEHOLDER: t('Untitled'),
  FINISH: t('Finish'),
  NO_WEBCAM: t('No Video'),
  NOT_ALLOWED_ERROR: t('Please allow Canvas to access your microphone and webcam.'),
  NOT_READABLE_ERROR: t('Your webcam may already be in use.'),
  PLAYBACK_PAUSE: t('Pause'),
  PLAYBACK_PLAY: t('Play'),
  PREVIEW: t('PREVIEW'),
  SAVE: t('Save'),
  SR_FILE_INPUT: t('File name'),
  START: t('Start Recording'),
  START_OVER: t('Start Over'),
}

export const SelectStrings = {
  USE_ARROWS: t('Use Arrows'),
  LIST_COLLAPSED: t('List Collapsed'),
  LIST_EXPANDED: t('List Expanded'),
  OPTION_SELECTED: t('{option} Selected'),
}
