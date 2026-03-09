import type { StudentMasteryScores } from '@/types/gradebook'

export const mockCaptionDefault = {
  description: 'Introduction to Computer Science',
  metadata: 'Section A, Section B',
}

export const mockCaptionSingleSection = {
  description: 'Advanced Mathematics',
  metadata: 'Honors Section',
}

export const mockCaptionManySections = {
  description: 'World History',
  metadata: 'Section A - Morning, Section B - Afternoon, Section C - Evening, Section D - Online',
}

export const mockCaptionLongCourseName = {
  description: 'Advanced Placement European History: Renaissance to Modern Era',
  metadata: 'AP Section',
}

export const mockCaptionNoSections = {
  description: 'Independent Study',
}

const mixedPerformanceAverage = {
  averageScore: 3,
  averageMasteryLevel: 'near_mastery' as const,
}

const highPerformanceAverage = {
  averageScore: 4.67,
  averageMasteryLevel: 'exceeds_mastery' as const,
}

const lowPerformanceAverage = {
  averageScore: 1.67,
  averageMasteryLevel: 'remediation' as const,
}

export const mockMasteryScores: StudentMasteryScores = {
  grossAverage: mixedPerformanceAverage.averageScore,
  averageIcon: mixedPerformanceAverage.averageMasteryLevel,
  averageText: 'Mixed Performance',
  buckets: {
    exceeds_mastery: { name: 'Exceeds Mastery', icon: 'exceeds_mastery', count: 2 },
    mastery: { name: 'Mastery', icon: 'mastery', count: 3 },
    near_mastery: { name: 'Near Mastery', icon: 'near_mastery', count: 1 },
    remediation: { name: 'Remediation', icon: 'remediation', count: 4 },
  },
}

export const highMasteryScores: StudentMasteryScores = {
  grossAverage: highPerformanceAverage.averageScore,
  averageIcon: highPerformanceAverage.averageMasteryLevel,
  averageText: 'Exceeds Mastery',
  buckets: {
    exceeds_mastery: { name: 'Exceeds Mastery', icon: 'exceeds_mastery', count: 5 },
    mastery: { name: 'Mastery', icon: 'mastery', count: 2 },
    near_mastery: { name: 'Near Mastery', icon: 'near_mastery', count: 1 },
    remediation: { name: 'Remediation', icon: 'remediation', count: 0 },
  },
}

export const lowMasteryScores: StudentMasteryScores = {
  grossAverage: lowPerformanceAverage.averageScore,
  averageIcon: lowPerformanceAverage.averageMasteryLevel,
  averageText: 'Remediation',
  buckets: {
    exceeds_mastery: { name: 'Exceeds Mastery', icon: 'exceeds_mastery', count: 0 },
    mastery: { name: 'Mastery', icon: 'mastery', count: 1 },
    near_mastery: { name: 'Near Mastery', icon: 'near_mastery', count: 2 },
    remediation: { name: 'Remediation', icon: 'remediation', count: 5 },
  },
}

export const unassessedMasteryScores: StudentMasteryScores = {
  grossAverage: null,
  averageIcon: 'unassessed',
  averageText: 'Unassessed',
  buckets: {
    exceeds_mastery: { name: 'Exceeds Mastery', icon: 'exceeds_mastery', count: 0 },
    mastery: { name: 'Mastery', icon: 'mastery', count: 0 },
    near_mastery: { name: 'Near Mastery', icon: 'near_mastery', count: 0 },
    remediation: { name: 'Remediation', icon: 'remediation', count: 0 },
  },
}
