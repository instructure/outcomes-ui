import React, {useCallback, useState} from 'react'
import {Button, CloseButton} from '@instructure/ui-buttons'
import {View} from '@instructure/ui-view'
import {Flex} from '@instructure/ui-flex'
import {Text} from '@instructure/ui-text'
import {Tray} from '@instructure/ui-tray'
import {showFlashAlert} from '@/components/FlashAlert'
import t from 'format-message'
import {colors} from '@instructure/canvas-theme'
import { useGradebookConfig } from '@/components/Gradebook/context/GradebookConfigContext'

export interface SettingsTrayProps {
  open: boolean
  onDismiss: () => void
  isSavingSettings?: boolean
}

/**
 * SettingsTray component that works with any settings type.
 * The settings content is provided via renderSettingsContent in the config.
 * This component handles:
 * - Tray header, footer, layout
 * - Form state management (local copy of settings)
 * - Save/cancel flow
 * - Success/error messaging
 */
export const SettingsTray: React.FC<SettingsTrayProps> = ({
  open,
  onDismiss,
  isSavingSettings = false,
}) => {
  const {
    settingsConfig:
    {
      settings: contextSettings,
      onSaveSettings,
      renderSettingsContent,
      setSettings
    }
  } = useGradebookConfig()
  const [localSettings, setLocalSettings] = useState(contextSettings)

  // Update local settings when context settings change
  React.useEffect(() => {
    if (open) {
      setLocalSettings(contextSettings)
    }
  }, [open, contextSettings])

  const resetForm = useCallback(() => {
    setLocalSettings(contextSettings)
  }, [contextSettings])

  const saveSettings = async () => {
    const result = await onSaveSettings(localSettings)

    if (result?.success) {
      // Update context with new settings - triggers re-render throughout the tree
      setSettings(localSettings)
      onDismiss()
      showFlashAlert({type: 'success', message: t('Your settings have been saved.')})
    } else {
      resetForm()
      showFlashAlert({
        type: 'error',
        message: t('There was an error saving your settings. Please try again.'),
      })
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
            {/* Render consumer-provided settings content */}
            {renderSettingsContent({
              settings: localSettings,
              onChange: setLocalSettings,
            })}
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
                  data-testid="lmgb-cancel-settings-button"
                >
                  {t('Cancel')}
                </Button>
              </Flex.Item>
              <Flex.Item>
                <Button
                  color="primary"
                  onClick={saveSettings}
                  disabled={isSavingSettings}
                  data-testid="lmgb-save-settings-button">
                  {t('Save')}
                </Button>
              </Flex.Item>
            </Flex>
          </View>
        </Flex.Item>
      </Flex>
    </Tray>
  )
}
