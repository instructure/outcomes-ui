import type { LmgbUserDetails } from '@/hooks/gradebook/useLmgbUserDetails'
import type { Student, Outcome, StudentRollupData } from '@/types/gradebook/rollup'

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

export const createRollups = (
  studentId: string,
  outcomeRollups: StudentRollupData['outcomeRollups'],
  averageMasteryLevel?: StudentRollupData['averageMasteryLevel'],
  averageScore?: StudentRollupData['averageScore']
): StudentRollupData[] => [
  {
    studentId,
    outcomeRollups,
    averageMasteryLevel,
    averageScore,
  },
]

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
// Outcomes mock data
// ============================================

export const mockOutcomes: Outcome[] = [
  {
    id: '1',
    title: 'Mathematical Problem Solving',
    calculation_method: 'decaying_average',
    points_possible: 5,
    mastery_points: 3,
    ratings: [
      { points: 5, color: '#127A1B', description: 'Exceeds Mastery', mastery: false },
      { points: 4, color: '#00AC18', description: 'Mastery', mastery: true },
      { points: 3, color: '#FAB901', description: 'Near Mastery', mastery: false },
      { points: 2, color: '#FD5D10', description: 'Below Mastery', mastery: false },
      { points: 1, color: '#E0061F', description: 'Well Below Mastery', mastery: false },
    ],
  },
  {
    id: '2',
    title: 'Critical Thinking',
    calculation_method: 'highest',
    points_possible: 4,
    mastery_points: 3,
    ratings: [
      { points: 4, color: '#127A1B', description: 'Exemplary', mastery: true },
      { points: 3, color: '#00AC18', description: 'Proficient', mastery: false },
      { points: 2, color: '#FAB901', description: 'Developing', mastery: false },
      { points: 1, color: '#E0061F', description: 'Beginning', mastery: false },
    ],
  },
  {
    id: '3',
    title: 'Communication Skills',
    calculation_method: 'latest',
    points_possible: 5,
    mastery_points: 3,
    ratings: [
      { points: 5, color: '#127A1B', description: 'Expert', mastery: false },
      { points: 4, color: '#00AC18', description: 'Advanced', mastery: false },
      { points: 3, color: '#FAB901', description: 'Proficient', mastery: true },
      { points: 2, color: '#FD5D10', description: 'Basic', mastery: false },
      { points: 1, color: '#E0061F', description: 'Novice', mastery: false },
    ],
  },
]

// ============================================
// Rollup patterns
// ============================================

export const mixedPerformanceRollups: StudentRollupData['outcomeRollups'] = [
  {
    outcomeId: '1',
    score: 4,
    masteryLevel: 'mastery',
    rating: { points: 4, color: '#00AC18', description: 'Mastery' },
  },
  {
    outcomeId: '2',
    score: 2,
    masteryLevel: 'near_mastery',
    rating: { points: 2, color: '#FAB901', description: 'Developing' },
  },
]

export const highPerformanceRollups: StudentRollupData['outcomeRollups'] = [
  {
    outcomeId: '1',
    score: 5,
    masteryLevel: 'exceeds_mastery',
    rating: { points: 5, color: '#127A1B', description: 'Exceeds Mastery' },
  },
  {
    outcomeId: '2',
    score: 4,
    masteryLevel: 'exceeds_mastery',
    rating: { points: 4, color: '#127A1B', description: 'Exemplary' },
  },
  {
    outcomeId: '3',
    score: 5,
    masteryLevel: 'exceeds_mastery',
    rating: { points: 5, color: '#127A1B', description: 'Expert' },
  },
]

export const lowPerformanceRollups: StudentRollupData['outcomeRollups'] = [
  {
    outcomeId: '1',
    score: 2,
    masteryLevel: 'remediation',
    rating: { points: 2, color: '#FD5D10', description: 'Below Mastery' },
  },
  {
    outcomeId: '2',
    score: 1,
    masteryLevel: 'remediation',
    rating: { points: 1, color: '#E0061F', description: 'Beginning' },
  },
  {
    outcomeId: '3',
    score: 2,
    masteryLevel: 'remediation',
    rating: { points: 2, color: '#FD5D10', description: 'Basic' },
  },
]

export const nearMasteryRollups: StudentRollupData['outcomeRollups'] = [
  {
    outcomeId: '1',
    score: 3,
    masteryLevel: 'near_mastery',
    rating: { points: 3, color: '#FAB901', description: 'Near Mastery' },
  },
]

// ============================================
// Rollup averages for complete StudentRollupData
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
