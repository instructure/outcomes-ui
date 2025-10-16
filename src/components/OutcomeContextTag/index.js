/** @jsx jsx */
import PropTypes from 'prop-types'
import { Flex } from '@instructure/ui-flex'
import { Text } from '@instructure/ui-text'
import { Tag } from '@instructure/ui-tag'
import { View } from '@instructure/ui-view'
import { IconCoursesLine } from '@instructure/ui-icons'
import { jsx } from '@instructure/emotion'
import t from 'format-message'
import { colors } from '@instructure/canvas-theme'
import IconInstitution from './IconInstitution'

const CONTEXT_TYPES = {
  ACCOUNT: 'account',
  COURSE: 'course',
}

const OutcomeContextTag = ({ outcomeContextType, margin }) => {
  const trimmedContextType = outcomeContextType?.trim() || ''

  if (!trimmedContextType) {
    return null
  }

  const normalizedContextType = trimmedContextType.toLowerCase()
  const isAccount = normalizedContextType === CONTEXT_TYPES.ACCOUNT
  const isCourse = normalizedContextType === CONTEXT_TYPES.COURSE

  if (!isAccount && !isCourse) {
    return null
  }

  const contextLabel = isAccount ? t('Institution') : t('Course')

  const ariaLabel = isAccount
    ? t('This is an institution-level outcome')
    : t('This is a course-level outcome')

  const icon = isAccount ? (
    <IconInstitution
      size="x-small"
      color="white"
      style={{ transform: 'scale(0.6)', marginInlineStart: '-2px', marginInlineEnd: '-1px' }}
    />
  ) : (
    <IconCoursesLine
      size="x-small"
      color="primary-inverse"
      style={{
        transform: 'scale(0.55)',
        marginTop: '-2px',
        marginBottom: '-2px',
        marginInlineStart: '-3px',
        marginInlineEnd: '-2px',
      }}
    />
  )

  const backgroundColor = isAccount
    ? colors.additionalPrimitives.violet90
    : colors.additionalPrimitives.copper45

  return (
    <View as="div" margin={margin}>
      <Tag
        size="small"
        text={
          <Flex gap="xxx-small" padding="xxx-small 0">
            {icon}
            <Text color="primary-inverse" size="x-small" weight="normal" lineHeight="condensed">
              {contextLabel}
            </Text>
          </Flex>
        }
        themeOverride={{
          defaultBackground: backgroundColor,
          defaultBorderStyle: 'none',
        }}
        aria-label={ariaLabel}
        data-testid="outcome-context-tag"
      />
    </View>
  )
}

OutcomeContextTag.propTypes = {
  outcomeContextType: PropTypes.oneOf(['account', 'course', 'Account', 'Course']),
  margin: PropTypes.string,
}

OutcomeContextTag.defaultProps = {
  outcomeContextType: null,
  margin: '0',
}

export default OutcomeContextTag
