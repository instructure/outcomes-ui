import React from 'react'
import type { ReactNode } from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useLmgbUserDetails, type LmgbUserDetails } from '../useLmgbUserDetails'

describe('useLmgbUserDetails', () => {
  const courseId = '123'
  const studentId = '456'

  const mockUserDetails: LmgbUserDetails = {
    course: {
      name: 'Test Course',
    },
    user: {
      sections: [
        { id: 1, name: 'Section A' },
        { id: 2, name: 'Section B' },
      ],
      last_login: '2024-01-15T10:30:00Z',
    },
  }

  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })

    const Wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
    return Wrapper
  }

  describe('successful data fetching', () => {
    it('fetches and returns user details', async () => {
      const mockQueryHandler = jest.fn().mockResolvedValue(mockUserDetails)

      const { result } = renderHook(
        () =>
          useLmgbUserDetails({
            courseId,
            studentId,
            enabled: true,
            userDetailsQueryHandler: mockQueryHandler,
          }),
        {
          wrapper: createWrapper(),
        }
      )

      expect(result.current.isLoading).toBe(true)
      expect(result.current.data).toBeUndefined()

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockQueryHandler).toHaveBeenCalledWith(courseId, studentId)
      expect(result.current.data).toEqual(mockUserDetails)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })

    it('returns course name correctly', async () => {
      const mockQueryHandler = jest.fn().mockResolvedValue(mockUserDetails)

      const { result } = renderHook(
        () =>
          useLmgbUserDetails({
            courseId,
            studentId,
            enabled: true,
            userDetailsQueryHandler: mockQueryHandler,
          }),
        {
          wrapper: createWrapper(),
        }
      )

      await waitFor(() => {
        expect(result.current.data?.course.name).toBe('Test Course')
      })
    })

    it('returns user sections correctly', async () => {
      const mockQueryHandler = jest.fn().mockResolvedValue(mockUserDetails)

      const { result } = renderHook(
        () =>
          useLmgbUserDetails({
            courseId,
            studentId,
            enabled: true,
            userDetailsQueryHandler: mockQueryHandler,
          }),
        {
          wrapper: createWrapper(),
        }
      )

      await waitFor(() => {
        expect(result.current.data?.user.sections).toHaveLength(2)
        expect(result.current.data?.user.sections[0].name).toBe('Section A')
        expect(result.current.data?.user.sections[1].name).toBe('Section B')
      })
    })

    it('returns last login correctly', async () => {
      const mockQueryHandler = jest.fn().mockResolvedValue(mockUserDetails)

      const { result } = renderHook(
        () =>
          useLmgbUserDetails({
            courseId,
            studentId,
            enabled: true,
            userDetailsQueryHandler: mockQueryHandler,
          }),
        {
          wrapper: createWrapper(),
        }
      )

      await waitFor(() => {
        expect(result.current.data?.user.last_login).toBe('2024-01-15T10:30:00Z')
      })
    })

    it('handles null last_login', async () => {
      const detailsWithoutLogin: LmgbUserDetails = {
        ...mockUserDetails,
        user: {
          ...mockUserDetails.user,
          last_login: null,
        },
      }

      const mockQueryHandler = jest.fn().mockResolvedValue(detailsWithoutLogin)

      const { result } = renderHook(
        () =>
          useLmgbUserDetails({
            courseId,
            studentId,
            enabled: true,
            userDetailsQueryHandler: mockQueryHandler,
          }),
        {
          wrapper: createWrapper(),
        }
      )

      await waitFor(() => {
        expect(result.current.data?.user.last_login).toBeNull()
      })
    })

    it('handles empty sections array', async () => {
      const detailsWithoutSections: LmgbUserDetails = {
        ...mockUserDetails,
        user: {
          ...mockUserDetails.user,
          sections: [],
        },
      }

      const mockQueryHandler = jest.fn().mockResolvedValue(detailsWithoutSections)

      const { result } = renderHook(
        () =>
          useLmgbUserDetails({
            courseId,
            studentId,
            enabled: true,
            userDetailsQueryHandler: mockQueryHandler,
          }),
        {
          wrapper: createWrapper(),
        }
      )

      await waitFor(() => {
        expect(result.current.data?.user.sections).toEqual([])
      })
    })
  })

  describe('error handling', () => {
    it('handles query handler rejection', async () => {
      const mockError = new Error('Failed to fetch user details')
      const mockQueryHandler = jest.fn().mockRejectedValue(mockError)

      const { result } = renderHook(
        () =>
          useLmgbUserDetails({
            courseId,
            studentId,
            enabled: true,
            userDetailsQueryHandler: mockQueryHandler,
          }),
        {
          wrapper: createWrapper(),
        }
      )

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toBeTruthy()
      expect(result.current.data).toBeUndefined()
    })

    it('handles network-like errors', async () => {
      const mockQueryHandler = jest.fn().mockRejectedValue(new Error('Network error'))

      const { result } = renderHook(
        () =>
          useLmgbUserDetails({
            courseId,
            studentId,
            enabled: true,
            userDetailsQueryHandler: mockQueryHandler,
          }),
        {
          wrapper: createWrapper(),
        }
      )

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toBeTruthy()
    })
  })

  describe('enabled parameter', () => {
    it('does not fetch when enabled is false', async () => {
      const mockQueryHandler = jest.fn().mockResolvedValue(mockUserDetails)

      const { result } = renderHook(
        () =>
          useLmgbUserDetails({
            courseId,
            studentId,
            enabled: false,
            userDetailsQueryHandler: mockQueryHandler,
          }),
        {
          wrapper: createWrapper(),
        }
      )

      // Wait a bit to ensure no fetch happens
      await new Promise((resolve) => setTimeout(resolve, 100))

      expect(mockQueryHandler).not.toHaveBeenCalled()
      expect(result.current.data).toBeUndefined()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isFetching).toBe(false)
    })

    it('fetches when enabled changes from false to true', async () => {
      const mockQueryHandler = jest.fn().mockResolvedValue(mockUserDetails)

      const { result, rerender } = renderHook(
        ({ enabled }: { enabled: boolean }) =>
          useLmgbUserDetails({
            courseId,
            studentId,
            enabled,
            userDetailsQueryHandler: mockQueryHandler,
          }),
        {
          wrapper: createWrapper(),
          initialProps: { enabled: false },
        }
      )

      expect(mockQueryHandler).not.toHaveBeenCalled()

      rerender({ enabled: true })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockQueryHandler).toHaveBeenCalledTimes(1)
      expect(result.current.data).toEqual(mockUserDetails)
    })

    it('does not fetch when enabled is false and courseId is empty', async () => {
      const mockQueryHandler = jest.fn().mockResolvedValue(mockUserDetails)

      const { result } = renderHook(
        () =>
          useLmgbUserDetails({
            courseId: '',
            studentId,
            enabled: false,
            userDetailsQueryHandler: mockQueryHandler,
          }),
        {
          wrapper: createWrapper(),
        }
      )

      await new Promise((resolve) => setTimeout(resolve, 100))

      expect(mockQueryHandler).not.toHaveBeenCalled()
      expect(result.current.data).toBeUndefined()
    })

    it('does not fetch when enabled is false and studentId is empty', async () => {
      const mockQueryHandler = jest.fn().mockResolvedValue(mockUserDetails)

      const { result } = renderHook(
        () =>
          useLmgbUserDetails({
            courseId,
            studentId: '',
            enabled: false,
            userDetailsQueryHandler: mockQueryHandler,
          }),
        {
          wrapper: createWrapper(),
        }
      )

      await new Promise((resolve) => setTimeout(resolve, 100))

      expect(mockQueryHandler).not.toHaveBeenCalled()
      expect(result.current.data).toBeUndefined()
    })
  })

  describe('caching behavior', () => {
    it('caches data for 5 minutes (staleTime)', async () => {
      const mockQueryHandler = jest.fn().mockResolvedValue(mockUserDetails)
      const wrapper = createWrapper()

      const { result: result1 } = renderHook(
        () =>
          useLmgbUserDetails({
            courseId,
            studentId,
            enabled: true,
            userDetailsQueryHandler: mockQueryHandler,
          }),
        {
          wrapper,
        }
      )

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true)
      })

      expect(mockQueryHandler).toHaveBeenCalledTimes(1)

      // Second render with same params should use cache
      const { result: result2 } = renderHook(
        () =>
          useLmgbUserDetails({
            courseId,
            studentId,
            enabled: true,
            userDetailsQueryHandler: mockQueryHandler,
          }),
        {
          wrapper,
        }
      )

      await waitFor(() => {
        expect(result2.current.isSuccess).toBe(true)
      })

      // Should still only have 1 API call (cached)
      expect(mockQueryHandler).toHaveBeenCalledTimes(1)
      expect(result2.current.data).toEqual(mockUserDetails)
    })

    it('uses different cache keys for different students', async () => {
      const student1Id = '111'
      const student2Id = '222'

      const mockQueryHandler1 = jest.fn().mockResolvedValue({
        ...mockUserDetails,
        course: { name: 'Course 1' },
      })

      const mockQueryHandler2 = jest.fn().mockResolvedValue({
        ...mockUserDetails,
        course: { name: 'Course 2' },
      })

      const wrapper = createWrapper()

      const { result: result1 } = renderHook(
        () =>
          useLmgbUserDetails({
            courseId,
            studentId: student1Id,
            enabled: true,
            userDetailsQueryHandler: mockQueryHandler1,
          }),
        { wrapper }
      )

      await waitFor(() => {
        expect(result1.current.data?.course.name).toBe('Course 1')
      })

      const { result: result2 } = renderHook(
        () =>
          useLmgbUserDetails({
            courseId,
            studentId: student2Id,
            enabled: true,
            userDetailsQueryHandler: mockQueryHandler2,
          }),
        { wrapper }
      )

      await waitFor(() => {
        expect(result2.current.data?.course.name).toBe('Course 2')
      })

      expect(mockQueryHandler1).toHaveBeenCalledTimes(1)
      expect(mockQueryHandler2).toHaveBeenCalledTimes(1)
    })

    it('uses different cache keys for different courses', async () => {
      const course1Id = '100'
      const course2Id = '200'

      const mockQueryHandler1 = jest.fn().mockResolvedValue({
        ...mockUserDetails,
        course: { name: 'Math 101' },
      })

      const mockQueryHandler2 = jest.fn().mockResolvedValue({
        ...mockUserDetails,
        course: { name: 'History 201' },
      })

      const wrapper = createWrapper()

      const { result: result1 } = renderHook(
        () =>
          useLmgbUserDetails({
            courseId: course1Id,
            studentId,
            enabled: true,
            userDetailsQueryHandler: mockQueryHandler1,
          }),
        { wrapper }
      )

      await waitFor(() => {
        expect(result1.current.data?.course.name).toBe('Math 101')
      })

      const { result: result2 } = renderHook(
        () =>
          useLmgbUserDetails({
            courseId: course2Id,
            studentId,
            enabled: true,
            userDetailsQueryHandler: mockQueryHandler2,
          }),
        { wrapper }
      )

      await waitFor(() => {
        expect(result2.current.data?.course.name).toBe('History 201')
      })

      expect(mockQueryHandler1).toHaveBeenCalledTimes(1)
      expect(mockQueryHandler2).toHaveBeenCalledTimes(1)
    })
  })

  describe('query key generation', () => {
    it('passes correct parameters to query handler', async () => {
      const mockQueryHandler = jest.fn().mockResolvedValue(mockUserDetails)

      const { result } = renderHook(
        () =>
          useLmgbUserDetails({
            courseId,
            studentId,
            enabled: true,
            userDetailsQueryHandler: mockQueryHandler,
          }),
        {
          wrapper: createWrapper(),
        }
      )

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockQueryHandler).toHaveBeenCalledWith(courseId, studentId)
    })
  })

  describe('default parameters', () => {
    it('uses enabled=true by default', async () => {
      const mockQueryHandler = jest.fn().mockResolvedValue(mockUserDetails)

      const { result } = renderHook(
        () =>
          useLmgbUserDetails({
            courseId,
            studentId,
            userDetailsQueryHandler: mockQueryHandler,
          }),
        {
          wrapper: createWrapper(),
        }
      )

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockQueryHandler).toHaveBeenCalledTimes(1)
      expect(result.current.data).toEqual(mockUserDetails)
    })
  })

  describe('edge cases', () => {
    it('handles empty courseId gracefully', async () => {
      const mockQueryHandler = jest.fn().mockResolvedValue(mockUserDetails)

      const { result } = renderHook(
        () =>
          useLmgbUserDetails({
            courseId: '',
            studentId,
            userDetailsQueryHandler: mockQueryHandler,
          }),
        {
          wrapper: createWrapper(),
        }
      )

      await new Promise((resolve) => setTimeout(resolve, 100))

      expect(mockQueryHandler).not.toHaveBeenCalled()
      expect(result.current.data).toBeUndefined()
    })

    it('handles empty studentId gracefully', async () => {
      const mockQueryHandler = jest.fn().mockResolvedValue(mockUserDetails)

      const { result } = renderHook(
        () =>
          useLmgbUserDetails({
            courseId,
            studentId: '',
            userDetailsQueryHandler: mockQueryHandler,
          }),
        {
          wrapper: createWrapper(),
        }
      )

      await new Promise((resolve) => setTimeout(resolve, 100))

      expect(mockQueryHandler).not.toHaveBeenCalled()
      expect(result.current.data).toBeUndefined()
    })

    it('handles both courseId and studentId being empty', async () => {
      const mockQueryHandler = jest.fn().mockResolvedValue(mockUserDetails)

      const { result } = renderHook(
        () =>
          useLmgbUserDetails({
            courseId: '',
            studentId: '',
            userDetailsQueryHandler: mockQueryHandler,
          }),
        {
          wrapper: createWrapper(),
        }
      )

      await new Promise((resolve) => setTimeout(resolve, 100))

      expect(mockQueryHandler).not.toHaveBeenCalled()
      expect(result.current.data).toBeUndefined()
      expect(result.current.isLoading).toBe(false)
    })
  })
})
