import { useQuery } from '@tanstack/react-query'

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

interface UseLmgbUserDetailsProps {
  courseId: string
  studentId: string
  enabled?: boolean
  userDetailsQueryHandler: (courseId: string, studentId: string) => Promise<LmgbUserDetails>
}

export const useLmgbUserDetails = ({
  courseId,
  studentId,
  enabled = true,
  userDetailsQueryHandler,
}: UseLmgbUserDetailsProps) => {
  return useQuery({
    queryKey: ['lmgbUserDetails', courseId, studentId],
    queryFn: async (): Promise<LmgbUserDetails> => {
      return await userDetailsQueryHandler(courseId, studentId)
    },
    enabled: enabled && !!courseId && !!studentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
