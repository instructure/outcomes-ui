export interface Student {
  id: string
  name: string
  display_name: string
  sortable_name: string
  sis_id?: string
  integration_id?: string
  login_id?: string
  avatar_url?: string
  status?: string
}

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

export interface Section {
  id: number
  name: string
}

export interface LmgbUserDetails {
  course: {
    name: string
  }
  user: {
    sections: Section[]
    last_login: string | null
  }
}

export interface Pagination {
  currentPage: number
  perPage: number
  totalPages: number
  totalCount: number
}
