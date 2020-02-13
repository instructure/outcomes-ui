import t from 'format-message'
import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@instructure/ui-buttons'
import { Link, Text } from '@instructure/ui-elements'
import { IconTrashLine, IconOutcomesLine } from '@instructure/ui-icons'
import { View } from '@instructure/ui-layout'
import { themeable } from '@instructure/ui-themeable'
import OutcomeViewModal from '../OutcomeViewModal'
import theme from '../theme'
import styles from './styles.css'

@themeable(theme, styles)
export default class Alignment extends React.Component {
  // eslint-disable-next-line no-undef
  static propTypes = {
    outcome: PropTypes.shape({
      label: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    }).isRequired,
    removeAlignment: PropTypes.func.isRequired,
    viewAlignment: PropTypes.func.isRequired,
    closeAlignment: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    readOnly: PropTypes.bool.isRequired,
    artifactTypeName: PropTypes.string,
    displayMasteryDescription: PropTypes.bool,
    displayMasteryPercentText: PropTypes.bool,
  }

  static defaultProps = {
    artifactTypeName: null,
    displayMasteryDescription: false,
    displayMasteryPercentText: false,
  }

  focus () {
    this.focusLink.focus()
  }

  render () {
    const {
      outcome,
      removeAlignment,
      viewAlignment,
      closeAlignment,
      isOpen,
      artifactTypeName,
      displayMasteryDescription,
      displayMasteryPercentText,
      readOnly,
    } = this.props
    const removeMessage = t({
      default: 'Remove {title}',
      description: 'Screen reader caption for button that removes an alignment'
    }, {
      title: outcome.title
    })
    return (
      <li className={styles.item} data-automation="outcomeAlignment__item">
        <span className={styles.outcome}>
          <Text size="large">
            <IconOutcomesLine />
          </Text>
        </span>
        <span className={styles.link}>
          <span className={styles.linkText}>
            <span className={styles.innerLinkText}>
              <View as='div' margin='xx-small'>
                <Link
                  onClick={viewAlignment}
                  ref={(link) => { this.focusLink = link }} // eslint-disable-line immutable/no-mutation
                >
                  <Text weight="bold">{outcome.title}</Text>
                </Link>
              </View>
            </span>
          </span>
        </span>
        {!readOnly &&
          <span className={styles.delete} data-automation="alignment-delete">
            <Button variant="icon" onClick={removeAlignment}>
              <IconTrashLine title={removeMessage} />
            </Button>
          </span>
        }
        <OutcomeViewModal
          outcome={outcome}
          closeAlignment={closeAlignment}
          isOpen={isOpen}
          artifactTypeName={artifactTypeName}
          displayMasteryDescription={displayMasteryDescription}
          displayMasteryPercentText={displayMasteryPercentText}
        />
      </li>
    )
  }
}
