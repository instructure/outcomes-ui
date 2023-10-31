import React from 'react'
import PropTypes from 'prop-types'
import t from 'format-message'
import { Flex } from '@instructure/ui-flex'
import { Table } from '@instructure/ui-table'
import { Text } from '@instructure/ui-text'
import { View } from '@instructure/ui-view'
import {
  ScreenReaderContent,
  PresentationContent
} from '@instructure/ui-a11y-content'
import { scoringTierShape } from '../../store/shapes'

const Ratings = ({ ratings, masteryPercent, pointsPossible, isTray }) => {
  // This will ensure that the points is calculated to at most 2 decimal points
  const percentToPoints = (percent) =>
    Math.round(percent * pointsPossible * 100) / 100

  const renderRatingDescription = (description, position) => (
    <Text>
      <ScreenReaderContent>
        {t('Description for mastery level {position}: {description}', {
          position,
          description
        })}
      </ScreenReaderContent>

      <PresentationContent>{description}</PresentationContent>
    </Text>
  )

  const renderRatingsPoints = (points, position) => (
    <View display={isTray ? 'inline-block' : 'auto'}>
      <View margin={isTray ? '0' : '0 0 0 small'}>
        <ScreenReaderContent>
          {t('Points for mastery level {position}: {points}', {
            position,
            points
          })}
        </ScreenReaderContent>

        <PresentationContent>
          {isTray ? t('{points} points', { points }) : points}

          {!isTray && <div style={{ display: 'none' }}>{t('points')}</div>}
        </PresentationContent>
      </View>
    </View>
  )

  const renderDisplayMasteryPoints = () => {
    const masteryPoints = percentToPoints(masteryPercent)
    return (
      <Flex
        wrap="wrap"
        direction={isTray ? 'column' : 'row'}
        padding={isTray ? 'none small small none' : 'x-small small small none'}
      >
        <Flex.Item as="div" padding="none xx-small none none">
          <Text weight="bold">{t('Mastery at:')}</Text>
        </Flex.Item>
        <Flex.Item padding={isTray ? 'small none none' : 'none'}>
          <Text color="primary">
            {t('{masteryPoints} points', { masteryPoints })}
          </Text>
        </Flex.Item>
      </Flex>
    )
  }

  return (
    <Flex width="100%" direction="column">
      <Flex width={isTray ? '100%' : '65%'} padding="x-small 0">
        <Table caption={t('Ratings table')} layout="fixed">
          <Table.Head>
            <Table.Row themeOverride={{ borderColor: 'white' }}>
              <Table.ColHeader
                id="rating"
                themeOverride={{ padding: '0.5rem 0rem' }}
              >
                {t('Proficiency Rating')}
              </Table.ColHeader>
              {!isTray && (
                <Table.ColHeader
                  id="points"
                  textAlign="end"
                  themeOverride={{ padding: '0.5rem 0rem' }}
                >
                  {t('Points')}
                </Table.ColHeader>
              )}
            </Table.Row>
          </Table.Head>
          {ratings?.map(({ description, percent }, index) => (
            <Table.Body key={index}>
              <Table.Row themeOverride={{ borderColor: 'white' }}>
                <Table.Cell themeOverride={{ padding: '0.5rem 0rem' }}>
                  {renderRatingDescription(description, index + 1)}
                </Table.Cell>
                {!isTray && (
                  <Table.Cell
                    textAlign="end"
                    themeOverride={{ padding: '0rem 2.25rem' }}
                  >
                    {renderRatingsPoints(percentToPoints(percent), index + 1)}
                  </Table.Cell>
                )}
              </Table.Row>
              {isTray && (
                <Table.Row
                  themeOverride={{ borderColor: 'white', padding: '0rem 0rem' }}
                >
                  <Table.Cell themeOverride={{ padding: '0.5rem 0rem' }}>
                    {renderRatingsPoints(percentToPoints(percent), index + 1)}
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          ))}
        </Table>
      </Flex>
      {renderDisplayMasteryPoints()}
    </Flex>
  )
}

Ratings.propTypes = {
  ratings: PropTypes.arrayOf(scoringTierShape).isRequired,
  masteryPercent: PropTypes.number.isRequired,
  pointsPossible: PropTypes.number.isRequired,
  isTray: PropTypes.bool
}

Ratings.defaultProps = {
  ratings: [],
  masteryPercent: null,
  pointsPossible: null,
  isTray: false
}

export default Ratings
