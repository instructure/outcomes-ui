export interface MasteryBucket {
  name: string
  icon: MasteryLevel
  count: number
}

export interface StudentMasteryScores {
  grossAverage: number | null
  averageIcon: MasteryLevel
  averageText: string
  buckets: {
    [key: string]: MasteryBucket
  }
}

export type MasteryLevel =
  | 'exceeds_mastery'
  | 'mastery'
  | 'near_mastery'
  | 'remediation'
  | 'unassessed'
  | 'no_evidence'

export interface Pagination {
  currentPage: number
  perPage: number
  totalPages: number
  totalCount: number
}
