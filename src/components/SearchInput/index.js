import React from 'react'
import PropTypes from 'prop-types'
import t from 'format-message'

import { themeable } from '@instructure/ui-themeable'
import { ScreenReaderContent } from '@instructure/ui-a11y'
import { IconButton } from '@instructure/ui-buttons'
import { IconEndSolid, IconSearchLine } from '@instructure/ui-icons'
import { TextInput } from '@instructure/ui-text-input'

import theme from '../theme'
import styles from './styles.css'

@themeable(theme, styles)
export default class SearchInput extends React.Component {
  // eslint-disable-next-line no-undef
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    searchText: PropTypes.string.isRequired
  }

  renderClearSearchButton() {
    const {
      onClear
    } = this.props

    return (
      <IconButton
        size='small'
        withBackground={false}
        withBorder={false}
        onClick={onClear}
        screenReaderLabel={t('Clear search field')}
      >
        <IconEndSolid size='x-small'/>
      </IconButton>
    )
  }

  render () {
    const {
      onChange,
      searchText
    } = this.props

    return (
      <span className={styles.search}>
        <TextInput
          type="search"
          label={<ScreenReaderContent>{t('Search outcomes')}</ScreenReaderContent>}
          placeholder={t('Search Outcomes')}
          value={searchText}
          onChange={onChange}
          size="medium"
          renderAfterInput={
            searchText ?
              this.renderClearSearchButton()
              :
              <IconSearchLine size="x-small"/>
          }
        />
      </span>
    )
  }
}
