import React, { useCallback, useState } from 'react'
import { Button, CloseButton } from '@instructure/ui-buttons'
import { View } from '@instructure/ui-view'
import { Flex } from '@instructure/ui-flex'
import { Text } from '@instructure/ui-text'
import { Tray } from '@instructure/ui-tray'
import t from 'format-message'
import {colors} from '@instructure/canvas-theme'
import { useGradebookConfig } from '@/components/Gradebook/context/GradebookConfigContext'
import { useGradebookApp } from '@/components/Gradebook/context/GradebookAppContext'
import { showFlashAlert } from '@/components/FlashAlert'

export interface SettingsTrayProps {
  open: boolean
  onDismiss: () => void
}

/**
 * SettingsTray component that provides the tray chrome and renders the SettingsTrayContent.
 * This component handles:
 * - Tray header, footer, layout
 * - Form state management (local copy of settings)
 * - Save/cancel flow with async persistence
 * - Loading states and error handling
 * The SettingsTrayContent is purely presentational and renders the form fields.
 */
export const SettingsTray: React.FC<SettingsTrayProps> = ({
  open,
  onDismiss,
}) => {
  const { components } = useGradebookConfig()
  const { settings: { settings: contextSettings, setSettings, onSave } } = useGradebookApp()
  const { SettingsTrayContent } = components
  const [ localSettings, setLocalSettings ] = useState(contextSettings)
  const [ isSaving, setIsSaving ] = useState(false)

  // Update local settings when context settings change or tray opens
  React.useEffect(() => {
    if (open) {
      setLocalSettings(contextSettings)
    }
  }, [open, contextSettings])

  const resetForm = useCallback(() => {
    setLocalSettings(contextSettings)
  }, [contextSettings])

  const saveSettings = async () => {
    setIsSaving(true)
    try {
      const result = await onSave(localSettings)

      if (result.success) {
        setSettings(localSettings)
        showFlashAlert({
          message: t('Your settings have been saved.'),
          type: 'success',
        })
        onDismiss()
      } else {
        showFlashAlert({
          message: result.error || t('There was an error saving your settings. Please try again.'),
          type: 'error',
        })
      }
    } catch (error) {
      showFlashAlert({
        message: t('An unexpected error occurred while saving settings'),
        type: 'error',
        err: error,
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Tray
      label={t('Settings Tray')}
      placement="end"
      size="small"
      open={open}
      onDismiss={onDismiss}
      data-testid="lmgb-settings-tray"
    >
      <Flex direction="column" height="100vh" justifyItems="space-between">
        <Flex.Item>
          <Flex direction="column" padding="medium">
            <Flex
              alignItems="center"
              justifyItems="space-between"
              data-testid="lmgb-settings-header"
            >
              <Text size="x-large" weight="bold">
                {t('Settings')}
              </Text>
              <CloseButton
                size="medium"
                screenReaderLabel={t('Close Settings Tray')}
                onClick={onDismiss}
                data-testid="lmgb-close-settings-button"
              />
            </Flex>
            <hr style={{marginBottom: '0', marginTop: '16px'}} />
          </Flex>
          <Flex direction="column" padding="small medium" alignItems="stretch" gap="medium">
            {/* Render consumer-provided settings component */}
            <SettingsTrayContent settings={localSettings} onChange={setLocalSettings} />
          </Flex>
        </Flex.Item>
        <Flex.Item>
          <View
            as="div"
            background="secondary"
            borderColor={colors.primitives.grey14}
            borderWidth="small none none none"
            padding="small"
            margin="large none none none"
          >
            <Flex gap="x-small" justifyItems="end">
              <Flex.Item>
                <Button
                  onClick={() => {
                    resetForm()
                    onDismiss()
                  }}
                  color="secondary"
                  disabled={isSaving}
                  data-testid="lmgb-cancel-settings-button"
                >
                  {t('Cancel')}
                </Button>
              </Flex.Item>
              <Flex.Item>
                <Button
                  color="primary"
                  onClick={saveSettings}
                  disabled={isSaving}
                  data-testid="lmgb-save-settings-button"
                >
                  {isSaving ? t('Saving') : t('Save')}
                </Button>
              </Flex.Item>
            </Flex>
          </View>
        </Flex.Item>
      </Flex>
    </Tray>
  )
}
