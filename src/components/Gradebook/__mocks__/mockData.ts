import type { LmgbUserDetails, Student, StudentMasteryScores } from '@/types/gradebook'

// ============================================
// Helper functions
// ============================================

export const createStudent = (id: string, firstName: string, lastName: string): Student => ({
  id,
  name: `${firstName} ${lastName}`,
  display_name: `${firstName} ${lastName}`,
  sortable_name: `${lastName}, ${firstName}`,
  sis_id: 'SIS123456',
  integration_id: 'INT789',
  login_id: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
  status: 'active',
})

// ============================================
// User details mocks (for MSW handlers)
// ============================================

export const mockUserDetailsDefault: LmgbUserDetails = {
  course: {
    name: 'Introduction to Computer Science',
  },
  user: {
    sections: [
      { id: 1, name: 'Section A' },
      { id: 2, name: 'Section B' },
    ],
    last_login: '2024-01-15T10:30:00Z',
  },
}

export const mockUserDetailsSingleSection: LmgbUserDetails = {
  course: {
    name: 'Advanced Mathematics',
  },
  user: {
    sections: [{ id: 1, name: 'Honors Section' }],
    last_login: '2024-02-08T14:20:00Z',
  },
}

export const mockUserDetailsManySections: LmgbUserDetails = {
  course: {
    name: 'World History',
  },
  user: {
    sections: [
      { id: 1, name: 'Section A - Morning' },
      { id: 2, name: 'Section B - Afternoon' },
      { id: 3, name: 'Section C - Evening' },
      { id: 4, name: 'Section D - Online' },
    ],
    last_login: '2024-02-09T09:15:00Z',
  },
}

export const mockUserDetailsNoLogin: LmgbUserDetails = {
  course: {
    name: 'Biology 101',
  },
  user: {
    sections: [{ id: 1, name: 'Lab Section' }],
    last_login: null,
  },
}

export const mockUserDetailsLongCourseName: LmgbUserDetails = {
  course: {
    name: 'Advanced Placement European History: Renaissance to Modern Era',
  },
  user: {
    sections: [{ id: 1, name: 'AP Section' }],
    last_login: '2024-02-01T16:45:00Z',
  },
}

export const mockUserDetailsNoSections: LmgbUserDetails = {
  course: {
    name: 'Independent Study',
  },
  user: {
    sections: [],
    last_login: '2024-01-20T11:30:00Z',
  },
}

// ============================================
// Rollup averages
// ============================================

export const mixedPerformanceAverage = {
  averageScore: 3,
  averageMasteryLevel: 'near_mastery' as const,
}

export const highPerformanceAverage = {
  averageScore: 4.67,
  averageMasteryLevel: 'exceeds_mastery' as const,
}

export const lowPerformanceAverage = {
  averageScore: 1.67,
  averageMasteryLevel: 'remediation' as const,
}

export const nearMasteryAverage = {
  averageScore: 3,
  averageMasteryLevel: 'near_mastery' as const,
}

// ============================================
// Common students
// ============================================

export const mockStudent = createStudent('1', 'John', 'Smith')
export const mockStudentLongName = createStudent('2', 'Alexander Montgomery Wellington Junior', 'III')

// ============================================
// Mastery Scores
// ============================================

export const mockMasteryScores: StudentMasteryScores = {
  grossAverage: mixedPerformanceAverage.averageScore,
  averageIcon: mixedPerformanceAverage.averageMasteryLevel,
  averageText: 'Mixed Performance',
  buckets: {
    exceeds_mastery: {
      name: 'Exceeds Mastery',
      icon: 'exceeds_mastery',
      count: 2,
    },
    mastery: {
      name: 'Mastery',
      icon: 'mastery',
      count: 3,
    },
    near_mastery: {
      name: 'Near Mastery',
      icon: 'near_mastery',
      count: 1,
    },
    remediation: {
      name: 'Remediation',
      icon: 'remediation',
      count: 4,
    },
  },
}

export const highMasteryScores: StudentMasteryScores = {
  grossAverage: highPerformanceAverage.averageScore,
  averageIcon: highPerformanceAverage.averageMasteryLevel,
  averageText: 'Exceeds Mastery',
  buckets: {
    exceeds_mastery: {
      name: 'Exceeds Mastery',
      icon: 'exceeds_mastery',
      count: 5,
    },
    mastery: {
      name: 'Mastery',
      icon: 'mastery',
      count: 2,
    },
    near_mastery: {
      name: 'Near Mastery',
      icon: 'near_mastery',
      count: 1,
    },
    remediation: {
      name: 'Remediation',
      icon: 'remediation',
      count: 0,
    },
  },
}

export const lowMasteryScores: StudentMasteryScores = {
  grossAverage: lowPerformanceAverage.averageScore,
  averageIcon: lowPerformanceAverage.averageMasteryLevel,
  averageText: 'Remediation',
  buckets: {
    exceeds_mastery: {
      name: 'Exceeds Mastery',
      icon: 'exceeds_mastery',
      count: 0,
    },
    mastery: {
      name: 'Mastery',
      icon: 'mastery',
      count: 1,
    },
    near_mastery: {
      name: 'Near Mastery',
      icon: 'near_mastery',
      count: 2,
    },
    remediation: {
      name: 'Remediation',
      icon: 'remediation',
      count: 5,
    },
  },
}

export const unassessedMasteryScores: StudentMasteryScores = {
  grossAverage: null,
  averageIcon: 'unassessed',
  averageText: 'Unassessed',
  buckets: {
    exceeds_mastery: {
      name: 'Exceeds Mastery',
      icon: 'exceeds_mastery',
      count: 0,
    },
    mastery: {
      name: 'Mastery',
      icon: 'mastery',
      count: 0,
    },
    near_mastery: {
      name: 'Near Mastery',
      icon: 'near_mastery',
      count: 0,
    },
    remediation: {
      name: 'Remediation',
      icon: 'remediation',
      count: 0,
    },
  },
}
