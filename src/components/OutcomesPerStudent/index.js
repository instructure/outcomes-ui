/** @jsx jsx */
import React from 'react'
import PropTypes from 'prop-types'
import { Billboard } from '@instructure/ui-billboard'
import { Pagination, PaginationButton } from '@instructure/ui-pagination'
import { Text } from '@instructure/ui-text'
import { Avatar } from '@instructure/ui-avatar'
import { Spinner } from '@instructure/ui-spinner'
import { IconOutcomesLine } from '@instructure/ui-icons'
import {
  PresentationContent,
  ScreenReaderContent
} from '@instructure/ui-a11y-content'
import shortid from 'shortid'
import t from 'format-message'
import _ from 'lodash'
import ExportCSVButton from './ExportCSVButton'
import Header from './Header'
import HeaderDetails from './HeaderDetails'
import Score from './Score'
import Early from '../../icons/Early.svg'
import NoReport from '../../icons/NoReport.svg'
import { REPORT_DOWNLOAD_FF } from '../../constants'
import { withStyle, jsx } from '@instructure/emotion'
import generateComponentTheme from '../theme'
import generateStyle from './styles'

const renderBillboard = (args, _foo) => {
  const boardProps = Object.assign(
    {
      headingLevel: 'h3',
      size: 'small',
      margin: 'medium'
    },
    args
  )
  return <Billboard {...boardProps} />
}

const renderLoading = (styles) => {
  return (
    <div css={styles.loadingSpinner}>
      <Spinner renderTitle={t('Loading')} />
    </div>
  )
}

const noOutcomes = () => {
  return {
    heading: t('There is no report here to show'),
    message: t(
      'The assessment has no outcomes aligned to it. Go to the Build tab to align outcomes.'
    ),
    hero: (
      <span aria-hidden="true">
        <NoReport />
      </span>
    )
  }
}

const noStudents = () => {
  return {
    heading: t("Looks like you're a little early"),
    message: t(
      'Students must finish the assessment before any outcome results will show here. ' +
        'Check back here after some students have completed the assessment.'
    ),
    hero: <Early />
  }
}

const renderCorner = (count, styles) => {
  const text = t(
    `{
    count, plural,
        one {1 Outcome Aligned}
      other {# Outcomes Aligned}
  }`,
    { count }
  )

  return (
    <div
      css={styles.corner}
      role="columnheader"
      data-automation="outcomesPerStudent__corner"
    >
      <IconOutcomesLine />
      <Text size="small">{text}</Text>
    </div>
  )
}

const renderStudentName = (student, styles) => {
  const studentNameId = shortid.generate()
  const studentNameElement = (
    <div css={styles.studentName} id={studentNameId} role="rowheader">
      <PresentationContent>
        <span
          css={styles.avatar}
          data-automation="outcomesPerStudent__avatar"
        >
          <Avatar
            size="small"
            name={student.full_name}
            src={student.avatar_url}
          />
        </span>
      </PresentationContent>
      <span css={styles.name} data-automation="outcomesPerStudent__name">
        <Text size="small">{student.full_name}</Text>
      </span>
    </div>
  )

  return { studentNameId, studentNameElement }
}

const renderPagination = ({
  artifactType,
  artifactId,
  currentPage,
  pageCount,
  loadPage,
  loadUsersOverride
}) => {
  if (currentPage !== null) {
    return (
      <Pagination
        margin="small"
        variant="compact"
        labelNext={t('Next Page')}
        labelPrev={t('Previous Page')}
      >
        {_.range(1, pageCount + 1).map((pageNumber) => {
          const current = pageNumber === currentPage
          const changePage = () =>
            loadPage(artifactType, artifactId, pageNumber, loadUsersOverride)
          return (
            <PaginationButton
              current={current}
              key={pageNumber}
              onClick={changePage}
            >
              {pageNumber}
            </PaginationButton>
          )
        })}
      </Pagination>
    )
  }
}
// eslint-disable-next-line immutable/no-mutation
renderPagination.propTypes = {
  artifactType: PropTypes.string.isRequired,
  artifactId: PropTypes.string.isRequired,
  pageCount: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  loadPage: PropTypes.func.isRequired,
  loadUsersOverride: PropTypes.func
}

renderPagination.defaultProps = {
  loadUsersOverride: void 0
}

@withStyle(generateStyle, generateComponentTheme)
class OutcomesPerStudentReport extends React.Component {
  // eslint-disable-next-line no-undef
  static propTypes = {
    users: PropTypes.array.isRequired,
    artifactType: PropTypes.string.isRequired,
    artifactId: PropTypes.string.isRequired,
    rollups: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    loadRemainingPages: PropTypes.func.isRequired,
    csvFetchingStatus: PropTypes.string.isRequired,
    formatCSVData: PropTypes.func.isRequired,
    loadPage: PropTypes.func.isRequired,
    loadUsersOverride: PropTypes.func,
    setError: PropTypes.func.isRequired,
    showRollups: PropTypes.bool,
    getReportOutcome: PropTypes.func.isRequired,
    hasAnyOutcomes: PropTypes.bool.isRequired,
    getScore: PropTypes.func.isRequired,
    viewReportAlignment: PropTypes.func.isRequired,
    isOpen: PropTypes.func.isRequired,
    closeReportAlignment: PropTypes.func.isRequired,
    features: PropTypes.array.isRequired,
    clearReportStore: PropTypes.func.isRequired,
    scope: PropTypes.string.isRequired,
    styles: PropTypes.object,
  }

  // eslint-disable-next-line no-undef
  static defaultProps = {
    loadUsersOverride: void 0,
    showRollups: true
  }

  componentWillMount() {
    const { artifactType, artifactId, loadPage, setError, loadUsersOverride } =
      this.props
    loadPage(artifactType, artifactId, 1, loadUsersOverride).catch((e) => setError(e))
  }

  componentWillUnmount() {
    this.props.clearReportStore()
  }

  renderReportTable() {
    const headerIds = []
    const {
      rollups,
      getReportOutcome,
      getScore,
      viewReportAlignment,
      isOpen,
      closeReportAlignment,
      users,
      showRollups,
      scope
    } = this.props
    return (
      <div
        css={this.props.styles.reportWrapper}
        data-automation="outcomesPerStudent__reportWrapper"
      >
        <div css={this.props.styles.table} role="grid">
          <div
            css={this.props.styles.headerRow}
            role="row"
            data-automation="outcomesPerStudent__headerRow"
          >
            {renderCorner(rollups.length, this.props.styles)}
            {rollups.map((rollup, i) => {
              headerIds[i] = shortid.generate() // eslint-disable-line immutable/no-mutation
              return (
                // FIXME: use stable keys here
                <div
                  id={headerIds[i]}
                  key={headerIds[i]}
                  role="columnheader"
                  css={this.props.styles.headerCell}
                  data-automation="outcomesPerStudent__headerCell"
                >
                  <Header
                    outcomeResult={rollup}
                    getReportOutcome={getReportOutcome}
                    viewReportAlignment={() =>
                      viewReportAlignment(rollup.outcomeId)
                    }
                    isOpen={isOpen(rollup.outcomeId)}
                    closeReportAlignment={closeReportAlignment}
                    showRollups={showRollups}
                    scope={scope}
                  />
                </div>
              )
            })}
          </div>
          <div role="row">
            <div role="rowheader">
              <ScreenReaderContent>{t('Details')}</ScreenReaderContent>
            </div>
            {rollups.map((rollup, i) => {
              return (
                // FIXME: use stable keys here
                <div key={headerIds[i]} role="gridcell">
                  <ScreenReaderContent>
                    <HeaderDetails
                      outcomeResult={rollup}
                      showRollups={showRollups}
                    />
                  </ScreenReaderContent>
                </div>
              )
            })}
          </div>
          {users.map((student) => {
            const { studentNameElement } = renderStudentName(student, this.props.styles)
            return (
              <div
                key={student.uuid}
                css={this.props.styles.studentRow}
                role="row"
                data-automation="outcomesPerStudent__studentRow"
              >
                {studentNameElement}
                {rollups.map((rollup, i) => (
                  <div
                    key={rollup.outcomeId}
                    css={this.props.styles.scoreCell}
                    role="gridcell"
                    data-automation="outcomesPerStudent__scoreCell"
                  >
                    <Score
                      score={getScore(rollup.outcomeId, student.uuid)}
                      outcome={getReportOutcome(rollup.outcomeId)}
                    />
                  </div>
                ))}
              </div>
            )
          })}
        </div>
        {renderPagination(this.props)}
      </div>
    )
  }

  renderExportButton = (hasAnyStudents, focusedElement) => {
    const {
      hasAnyOutcomes,
      loading,
      loadUsersOverride,
      loadRemainingPages,
      csvFetchingStatus,
      formatCSVData,
      artifactType,
      artifactId,
      features
    } = this.props
    const reportDownloadEnabled = features.includes(REPORT_DOWNLOAD_FF)
    const fetchCSVData = () => loadRemainingPages(artifactType, artifactId, loadUsersOverride)
    if (reportDownloadEnabled && !loading && hasAnyOutcomes && hasAnyStudents) {
      return (
        <ExportCSVButton
          fetchCSVData={fetchCSVData}
          formatCSVData={formatCSVData}
          fetchingStatus={csvFetchingStatus}
          artifactId={artifactId}
          focusedElement={focusedElement}
        />
      )
    }
  }

  render() {
    const { users, hasAnyOutcomes, loading } = this.props
    const hasAnyStudents = users && users.length > 0
    const focusedElement = document.activeElement
    const renderReportContent = () => {
      if (loading) {
        return renderLoading(this.props.styles)
      } else if (!hasAnyOutcomes) {
        return renderBillboard(noOutcomes())
      } else if (!hasAnyStudents) {
        return renderBillboard(noStudents())
      } else {
        return this.renderReportTable()
      }
    }
    return (
      <div css={this.props.styles.background}>
        {this.renderExportButton(hasAnyStudents, focusedElement)}
        {renderReportContent()}
      </div>
    )
  }
}

export default OutcomesPerStudentReport
