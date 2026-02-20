import React from 'react'
import GradebookApp, { type GradebookAppProps } from './index'
import { type Translations } from 'format-message'
import type { Meta, StoryObj } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import type { GradebookConfig } from './context/GradebookConfigContext'
import type { SaveSettingsResult } from './context/GradebookAppContext'

// Example minimal settings type
interface ExampleSettings {
  option1: boolean
}

const meta: Meta<typeof GradebookApp<ExampleSettings>> = {
  title: 'Gradebook/GradebookApp',
  component: GradebookApp,
}

export default meta

type Story = StoryObj<GradebookAppProps<ExampleSettings>>

const defaultConfig: GradebookConfig<ExampleSettings> = {
  components: {
    StudentPopover: () => <div>Student Popover</div>,
    SettingsTrayContent: () => <div>Settings Content</div>,
  },
}

const defaultSettings = {
  settings: {
    option1: true,
  },
  onSave: async (settings: ExampleSettings): Promise<SaveSettingsResult> => {
    action('onSave')(settings)
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { success: true }
  },
}

const resourceOverrides: Translations = {
  en: {
    'align_new_outcomes_2a2d3d48': 'Align new outcomes',
    'failed_to_load_user_details_7221befa': 'Failed to load user details',
    'loading_user_details_53ede5bb': 'Loading user details',
    'message_5c38209d': 'Message',
    'student_details_for_cc4a4206': 'Student Details',
    'view_mastery_report_7b7c9bc7': 'View Mastery Report',
    'export_de71cd8e': 'Export',
    'error_exporting_gradebook_b6558e60': 'Error exporting gradebook',
    'count_plural_one_one_option_available_other_option_e3576eb7': '{ count, plural,\n    one {One option available.}\n  other {# options available.}\n}',
    'label_removed_436b4303': '{ label } removed.',
    'label_selected_list_collapsed_8af3a06b': '{ label } selected. List collapsed.',
    'no_result_found_3d3fc3e3': 'No result found',
    'type_or_use_arrow_keys_to_navigate_multiple_select_ec56e29c': 'Type or use arrow keys to navigate. Multiple selections are allowed.',
    'alphabetical_55b5b4e0': 'Alphabetical',
    'arrange_outcomes_by_686d3753': 'Arrange Outcomes by',
    'avatars_in_student_list_59c74330': 'Avatars in student list',
    'close_settings_tray_7b3084c2': 'Close Settings Tray',
    'custom_6979cd81': 'Custom',
    'display_e6546241': 'Display',
    'first_name_last_name_2ae30a4b': 'First Name Last Name',
    'icons_descriptor_32dde915': 'Icons + Descriptor',
    'icons_only_f3ac5009': 'Icons Only',
    'icons_points_987265a4': 'Icons + Points',
    'integration_id_8a20b328': 'Integration ID',
    'last_name_first_name_f3796e59': 'Last Name, First Name',
    'login_id_12109693': 'Login ID',
    'name_display_format_c61848ad': 'Name Display Format',
    'none_3b5e34d2': 'None',
    'outcomes_with_no_results_7fbb5bb5': 'Outcomes with no results',
    'save_11a80ec3': 'Save',
    'scoring_91f3b228': 'Scoring',
    'secondary_info_835a07dd': 'Secondary info',
    'settings_5aa0fd0c': 'Settings',
    'settings_tray_d3fa9e57': 'Settings Tray',
    'sis_id_4495a887': 'SIS ID',
    'students_with_no_results_6bd5424b': 'Students with no results',
    'there_was_an_error_saving_your_settings_please_try_4fded25e': 'There was an error saving your settings. Please try again.',
    'unpublished_assignments_9cdbcc87': 'Unpublished Assignments',
    'upload_order_513421ce': 'Upload Order',
    'you_may_drag_drop_columns_to_re_arrange_bdb837da': '(You may drag & drop columns to re-arrange)',
    'your_settings_have_been_saved_aa46c66c': 'Your settings have been saved.',
    'view_contributing_score_details_7bc242ac': 'View Contributing Score Details',
  },
}

export const Default: Story = {
  args: {
    config: defaultConfig,
    settings: defaultSettings,
    translations: {
      language: 'en',
      resourceOverrides,
      i18nEnabled: true,
    },
  },
}
