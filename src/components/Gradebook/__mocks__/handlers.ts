import { http, HttpResponse } from 'msw'
import {
  mockUserDetailsDefault,
  mockUserDetailsSingleSection,
  mockUserDetailsManySections,
  mockUserDetailsNoLogin,
  mockUserDetailsLongCourseName,
  mockUserDetailsNoSections,
} from './mockData'

export const studentPopoverHandlers = [
  http.get('/api/courses/:courseId/students/:studentId/details', ({ params }) => {
    //const courseId = params.courseId as string
    const studentId = params.studentId as string

    if (studentId === '404') {
      return HttpResponse.json(
        { message: 'Student not found' },
        { status: 404 }
      )
    }

    if (studentId === '2') {
      return HttpResponse.json(mockUserDetailsSingleSection)
    }

    if (studentId === '3') {
      return HttpResponse.json(mockUserDetailsManySections)
    }

    if (studentId === '4') {
      return HttpResponse.json(mockUserDetailsLongCourseName)
    }

    if (studentId === '5') {
      return HttpResponse.json(mockUserDetailsNoLogin)
    }

    if (studentId === '6') {
      return HttpResponse.json(mockUserDetailsNoSections)
    }

    // Default response for student ID '1' and others
    return HttpResponse.json(mockUserDetailsDefault)
  }),
]
