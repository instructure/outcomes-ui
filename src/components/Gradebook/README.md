# Gradebook Component

This folder contains the main entry point for the Outcomes UI package LMGB integration.

## Components

-   **GradebookApp**: The root React component to be imported and rendered by the consuming project.

## Usage

Import and render `GradebookApp` in your project:

```tsx
import { GradebookApp } from "@instructure/outcomes-ui/src/components/Gradebook";

<GradebookApp
    translationConfig={{
        language: "en",
        resourceOverrides: { en: { key: "value" } },
        i18nEnabled: true,
    }}
/>;
```

### Props

#### translationConfig

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
  translationConfig={{
    language: 'en',
    resourceOverrides: overrides,
    i18nEnabled: true,
  }}
/>
```
