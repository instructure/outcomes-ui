# Gradebook Component

This folder contains the main entry point for the Outcomes UI package LMGB integration.

## Components

-   **GradebookApp**: The root React component to be imported and rendered by the consuming project.

## Usage

Import and render `GradebookApp` in your project:

```tsx
import { GradebookApp } from "@instructure/outcomes-ui/src/components/Gradebook";

<GradebookApp
    config={{
        components: {
            StudentPopover: MyStudentPopover,
            SettingsTrayContent: MySettings,
        },
    }}
    settings={{
        settings: mySettings,
        onSave: handleSaveSettings,
    }}
    translations={{
        language: "en",
        resourceOverrides: { en: { key: "value" } },
        i18nEnabled: true,
    }}
/>;
```

### Props

#### config

-   `components` (object): Required components for the gradebook.
    -   `StudentPopover`: Component for displaying student details
    -   `SettingsTrayContent`: Component for rendering settings form fields
-   `masteryLevelConfig` (object): Optional mastery level configuration.

#### settings

-   `settings` (TSettings): The current settings object.
-   `onSave` (function): Handler that persists settings, returns Promise<SaveSettingsResult>.

#### translations

-   `language` (string): The current language code (required if `i18nEnabled` is true or omitted).
-   `resourceOverrides` (object): Optional translation overrides for any language.
-   `i18nEnabled` (boolean): Enable or disable i18n. If `false`, language and resourceOverrides are ignored.

## Best Practices

-   Memoize `resourceOverrides` in the consuming project to avoid unnecessary rerenders.
-   Pass the current language and overrides explicitly from your app's state or context.

### Example

```tsx
const overrides = useMemo(() => ({ en: { hello: 'Hi!' } }), [])

<GradebookApp
  config={myGradebookConfig}
  settings={{
    settings: mySettings,
    onSave: handleSaveSettings
  }}
  translations={{
    language: 'en',
    resourceOverrides: overrides,
    i18nEnabled: true,
  }}
/>
```
