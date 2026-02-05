export const COLUMN_WIDTH: number = 160
export const CELL_HEIGHT: number = 48

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export enum SortBy {
  Outcome = 'outcome',
}

export enum SecondaryInfoDisplay {
  NONE = 'none',
  SIS_ID = 'sis_id',
  INTEGRATION_ID = 'integration_id',
  LOGIN_ID = 'login_id',
}

export enum DisplayFilter {
  SHOW_UNPUBLISHED_ASSIGNMENTS = 'show_unpublished_assignments',
  SHOW_STUDENTS_WITH_NO_RESULTS = 'show_students_with_no_results',
  SHOW_OUTCOMES_WITH_NO_RESULTS = 'show_outcomes_with_no_results',
  SHOW_STUDENT_AVATARS = 'show_student_avatars',
}

export enum NameDisplayFormat {
  FIRST_LAST = 'first_last',
  LAST_FIRST = 'last_first',
}

export enum ScoreDisplayFormat {
  ICON_ONLY = 'icon_only',
  ICON_AND_POINTS = 'icon_and_points',
  ICON_AND_LABEL = 'icon_and_label',
}

export enum OutcomeArrangement {
  ALPHABETICAL = 'alphabetical',
  CUSTOM = 'custom',
  UPLOAD_ORDER = 'upload_order',
}
