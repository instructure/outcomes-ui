import t from 'format-message'
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  type PropsWithChildren,
} from 'react'
import {Select, type SelectProps} from '@instructure/ui-select'
import type {ViewProps} from '@instructure/ui-view'
import {Tag} from '@instructure/ui-tag'
import {matchComponentTypes} from '@instructure/ui-react-utils'
import {uniqueId, compact} from 'es-toolkit/compat'
import {Alert} from '@instructure/ui-alerts'
import {Spinner} from '@instructure/ui-spinner'
import type {FormMessage} from '@instructure/ui-form-field'
import {showFlashAlert} from '@/components/FlashAlert'

type OptionProps = {
  id: string
  value: string
  label?: React.ReactNode
  tagText?: string
  isSelected?: boolean
  group?: string
}

export type Size = 'small' | 'medium' | 'large'

const CanvasMultiSelectOption: React.FC<PropsWithChildren<OptionProps>> = () => <div />

function liveRegion(): HTMLElement {
  let div = document.getElementById('flash_screenreader_holder')
  if (!div) {
    div = document.createElement('div')
    div.id = 'flash_screenreader_holder'
    div.setAttribute('role', 'alert')
    div.setAttribute('aria-live', 'assertive')
    div.setAttribute('aria-relevant', 'additions')
    div.className = 'screenreader-only'
    document.body.appendChild(div)
  }
  return div
}

const NO_OPTIONS_OPTION_ID = '__no_option-'

type Props = {
  assistiveText?: string
  children: React.ReactNode
  customMatcher?: (option: OptionProps, term: string) => boolean
  customOnInputChange?: (value: string) => void
  customOnRequestHideOptions?: () => void
  customOnRequestSelectOption?: (ids: string[]) => void
  customOnRequestShowOptions?: () => void
  customRenderBeforeInput?: (tags: React.ReactNode[] | null) => React.ReactNode
  customOnBlur?: () => void
  disabled?: boolean
  id?: string
  isLoading?: boolean
  isShowingOptions?: boolean
  isRequired?: boolean
  label: React.ReactNode
  inputRef?: (inputElement: HTMLInputElement | null) => void
  inputValue?: SelectProps['inputValue']
  listRef?: (ref: HTMLUListElement | null) => void
  noOptionsLabel?: string
  onChange: (ids: string[]) => void
  placeholder?: string
  renderAfterInput?: React.ReactNode
  selectedOptionIds?: string[]
  size?: Size
  visibleOptionsCount?: number
  messages?: FormMessage[]
  onUpdateHighlightedOption?: (id: string) => void
  setInputRef?: (ref: HTMLInputElement | null) => void
}

function CanvasMultiSelect(props: Props) {
  const {
    id: selectId,
    label: renderLabel,
    onChange,
    children,
    noOptionsLabel = '---',
    disabled = false,
    customRenderBeforeInput,
    customMatcher,
    customOnInputChange,
    customOnRequestShowOptions,
    customOnRequestHideOptions,
    customOnRequestSelectOption,
    customOnBlur,
    isLoading = false,
    isRequired,
    onUpdateHighlightedOption,
    setInputRef,
    inputValue: controlledInputValue,
    selectedOptionIds: controlledSelectedOptionIds,
    ...otherProps
  } = props

  const [internalInputValue, setInternalInputValue] = useState<string>('')
  const [internalSelectedOptionIds, setInternalSelectedOptionIds] = useState<string[]>([])
  const [isShowingOptions, setIsShowingOptions] = useState(false)
  const [highlightedOptionId, setHighlightedOptionId] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement | null>(null)
  const noOptionId = useRef(uniqueId(NO_OPTIONS_OPTION_ID))
  const noResultTimeoutRef = useRef<number | null>(null)

  // Use controlled value if provided, otherwise use internal state
  const isInputValueControlled = controlledInputValue !== undefined
  const inputValue = isInputValueControlled ? controlledInputValue : internalInputValue
  const setInputValue = isInputValueControlled ? () => {} : setInternalInputValue

  const isSelectedControlled = controlledSelectedOptionIds !== undefined
  const selectedOptionIds = isSelectedControlled ? controlledSelectedOptionIds : internalSelectedOptionIds
  const setSelectedOptionIds = isSelectedControlled ? () => {} : setInternalSelectedOptionIds

  if (inputRef && setInputRef) {
    setInputRef(inputRef.current)
  }

  const childProps: OptionProps[] = useMemo<
    {
      id: string
      value: string
      label: React.ReactNode
      tagText?: string
    }[]
  >(
    () =>
      React.Children.map(children, n => {
        if (!React.isValidElement(n)) return null
        return {
          id: n.props.id,
          value: n.props.value,
          label: n.props.children,
          tagText: n.props.tagText,
        }
      }) || [],
    [children],
  )

  const [filteredOptionIds, setFilteredOptionIds] = useState<string[] | null>(null)

  function getChildById(id?: string) {
    return childProps.find(c => c.id === id)
  }

  function renderChildren(): React.ReactNode | React.ReactNode[] {
    const groups: string[] = [
      ...new Set(
        React.Children.map(children, child => {
          if (!React.isValidElement(child)) return undefined
          return child.props.group
        }),
      ),
    ].filter((group: string) => group)

    function renderOption(child: {
      key: React.Key
      props: {id: string; children: React.ReactNode; key?: string; group: string; tagText?: string}
    }) {
      const {id, children, ...optionProps} = child.props
      delete optionProps.tagText
      return (
        <Select.Option
          id={id}
          key={child.key || id || uniqueId('multi-select-')}
          isHighlighted={id === highlightedOptionId}
          {...optionProps}
        >
          {children}
        </Select.Option>
      )
    }

    function renderNoOptionsOption() {
      return (
        <Select.Option id={noOptionId.current} isHighlighted={false} isSelected={false}>
          {isLoading ? <Spinner renderTitle="Loading" size="x-small" /> : noOptionsLabel}
        </Select.Option>
      )
    }

    const filteredChildren = compact(
      (Array.isArray(children) ? children : []).map(child => {
        if (
          matchComponentTypes(child, [CanvasMultiSelectOption]) &&
          (!filteredOptionIds || filteredOptionIds.includes(child.props.id)) &&
          !selectedOptionIds.includes(child.props.id)
        ) {
          return renderOption({
            ...child,
            key: child.key || uniqueId('multi-select-option-'),
          })
        }
        return null
      }),
    )

    function renderGroups() {
      const grouplessOptions = filteredChildren.filter(o => o.props.group === undefined)
      const groupsToRender = groups.filter(group =>
        filteredChildren.some(child => child.props.group === group),)
      const optionsToRender = grouplessOptions.map(isolatedOption =>
        renderOption({
          ...isolatedOption,
          key: isolatedOption.key ?? uniqueId('multi-select-option-'),
        }),)
      return [
        ...optionsToRender,
        ...groupsToRender.map(group => (
          <Select.Group key={group} renderLabel={group}>
            {filteredChildren
              // eslint-disable-next-line react/prop-types
              .filter(({props}) => props.group === group)
              .map(option =>
                renderOption({
                  ...option,
                  key: option.key || uniqueId('multi-select-group-option-'),
                }),)}
          </Select.Group>
        )),
      ]
    }

    if (filteredChildren.length === 0) return renderNoOptionsOption()

    return groups.length === 0 ? filteredChildren : renderGroups()
  }

  function dismissTag(e: React.MouseEvent<ViewProps, MouseEvent>, id: string, label: string) {
    e.stopPropagation()
    e.preventDefault()
    setAnnouncement(t('{label} removed.', {label}))
    const newSelectedIds = selectedOptionIds.filter(x => x !== id)
    setSelectedOptionIds(newSelectedIds)
    onChange(newSelectedIds)
    inputRef?.current?.focus()
  }

  function renderTags() {
    if (!Array.isArray(children)) return null
    const options = children

    return compact(
      selectedOptionIds.map(id => {
        const opt = options.find(c => c.props.id === id)
        if (!opt) return null
        const tagText = opt.props.tagText || opt.props.children || opt.props.label
        return (
          <Tag
            dismissible={true}
            key={opt.key}
            text={tagText}
            margin="0 xxx-small"
            onClick={(e: React.MouseEvent<ViewProps, MouseEvent>) => dismissTag(e, id, tagText)}
          />
        )
      }),
    )
  }

  function contentBeforeInput() {
    const tags = selectedOptionIds.length > 0 ? renderTags() : null
    return customRenderBeforeInput ? customRenderBeforeInput(tags) : tags
  }

  const memoizedChildprops = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return childProps.map(({label: _label, ...props}) => props)
  }, [childProps])

  useEffect(() => {
    if (inputValue !== '') {
      filterOptions(inputValue)
    }
  }, [JSON.stringify(memoizedChildprops)])

  const clearPendingTimeout = () => {
    if (noResultTimeoutRef.current) {
      window.clearTimeout(noResultTimeoutRef.current)
      noResultTimeoutRef.current = null
    }
  }

  const handleNoMatchResult = () => {
    clearPendingTimeout()

    // Debounce the flash alert to avoid showing it while user is still typing
    noResultTimeoutRef.current = window.setTimeout(() => {
      showFlashAlert({message: t('No result found'), type: 'info', timeout: 3000})
      noResultTimeoutRef.current = null
    }, 500)
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    clearPendingTimeout()

    const {value} = e.target
    filterOptions(value)
    if (value === '') {
      setFilteredOptionIds(null)
    }

    // Update state based on controlled/uncontrolled mode
    if (!isInputValueControlled) {
      setInternalInputValue(value)
    }

    customOnInputChange?.(value)
  }

  function filterOptions(value: string) {
    const defaultMatcher = (option: OptionProps, term: string) => {
      const labelText = typeof option.label === 'string' ? option.label : String(option.label || '')
      return labelText.toLowerCase().startsWith(term.toLowerCase())
    }
    const matcher = customMatcher || defaultMatcher
    const filtered = childProps.filter(
      child => matcher(child, value.trim()) && !selectedOptionIds.includes(child.id),
    )
    let message =
      // if number of options has changed, announce the new total.
      filtered.length !== filteredOptionIds?.length
        ? t('{count, plural, one {One option available.} other {# options available.}}', {
          count: filtered.length,
        })
        : null
    if (message && filtered.length > 0 && highlightedOptionId !== filtered[0].id) {
      const child = getChildById(filtered[0].id)
      if (child) message = primaryLabel(child) + '. ' + message
    }

    setFilteredOptionIds(filtered.map(f => f.id))

    if (filtered.length > 0) {
      setHighlightedOptionId(filtered[0].id)
    } else {
      handleNoMatchResult()
    }

    setIsShowingOptions(true)
    setAnnouncement(message)
  }

  const primaryLabel = (option: OptionProps) => option.tagText || (option.label as string)

  function onRequestShowOptions() {
    setIsShowingOptions(true)
    customOnRequestShowOptions?.()
  }

  function onRequestHideOptions() {
    setIsShowingOptions(false)
    customOnRequestHideOptions?.()
    if (!highlightedOptionId) return
    setInputValue('')
    if (filteredOptionIds?.length === 1) {
      const option = getChildById(filteredOptionIds[0])
      setAnnouncement(
        t('{label} selected. List collapsed.', {label: option ? primaryLabel(option) : ''}),
      )
      const newSelectedIds = [...selectedOptionIds, filteredOptionIds[0]]
      setSelectedOptionIds(newSelectedIds)
      onChange(newSelectedIds)
    }
    setFilteredOptionIds(null)
  }

  function onRequestHighlightOption(e: React.SyntheticEvent<Element, Event>, {id}: {id?: string}) {
    e.persist()
    const option = getChildById(id)
    if (!id || typeof option === 'undefined') return
    if (e.type === 'keydown') setInputValue(primaryLabel(option))
    setHighlightedOptionId(id)
    setAnnouncement(primaryLabel(option))
    onUpdateHighlightedOption?.(id)
  }

  function onRequestSelectOption(e: React.SyntheticEvent, {id}: {id?: string}): void {
    const option = getChildById(id)
    setInputValue('')
    setFilteredOptionIds(null)
    setIsShowingOptions(false)
    if (!id || typeof option === 'undefined') return

    // Delay announcement to ensure it comes after Select's internal "collapsed" announcement
    setTimeout(() => {
      setAnnouncement(t('{label} selected. List collapsed.', {label: primaryLabel(option)}))
    }, 100)

    const newSelectedIds = [...selectedOptionIds, id]
    setSelectedOptionIds(newSelectedIds)
    onChange(newSelectedIds)
    customOnRequestSelectOption?.(newSelectedIds)
  }

  // if backspace is pressed and there's no input to backspace over, remove the
  // last selected option if there is one
  function onKeyDown(e: React.KeyboardEvent) {
    if (
      e.key === 'Backspace' &&
      inputValue.length === 0 &&
      selectedOptionIds.length > 0
    ) {
      const option = getChildById(selectedOptionIds.slice(-1)[0])
      setAnnouncement(t('{label} removed.', {label: option ? primaryLabel(option) : ''}))
      const newSelectedIds = selectedOptionIds.slice(0, -1)
      setSelectedOptionIds(newSelectedIds)
      onChange(newSelectedIds)
    }
  }

  function onBlur() {
    setHighlightedOptionId(null)
    customOnBlur?.()
  }

  return (
    <>
      <Select
        id={selectId}
        disabled={disabled}
        renderLabel={renderLabel}
        inputValue={inputValue}
        inputRef={ref => {
          inputRef.current = ref
        }}
        onInputChange={onInputChange}
        onRequestShowOptions={onRequestShowOptions}
        onRequestHideOptions={onRequestHideOptions}
        isShowingOptions={isShowingOptions}
        onRequestHighlightOption={onRequestHighlightOption}
        onRequestSelectOption={onRequestSelectOption}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        assistiveText={t(
          'Type or use arrow keys to navigate. Multiple selections are allowed.',
        )}
        renderBeforeInput={contentBeforeInput()}
        isRequired={isRequired && selectedOptionIds.length === 0}
        data-testid="multi-select-input"
        {...otherProps}
      >
        {renderChildren()}
      </Select>
      {announcement && (
        <Alert liveRegion={liveRegion} liveRegionPoliteness="assertive" screenReaderOnly={true}>
          {announcement}
        </Alert>
      )}
    </>
  )
}

CanvasMultiSelect.Option = CanvasMultiSelectOption

export default CanvasMultiSelect
