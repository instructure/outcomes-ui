export type ObserverUser = {
  id: string
  name: string
  sortableName: string
}

export type Student = {
  id: string
  grade?: string | null
  name: string
  redoRequest?: boolean
  score?: number | null
  currentScore?: number
  sortableName: string
  submittedAt: null | Date
  excused?: boolean
  workflowState: string
}

export type SendMessageArgs = {
  attachmentIds?: string[]
  recipientsIds: string[]
  subject: string
  body: string
  mediaFile?: {
    id: string
    type: string
  }
}
