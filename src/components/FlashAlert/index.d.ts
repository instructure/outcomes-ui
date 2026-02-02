export interface ShowFlashAlertProps {
  message: string
  err?: Error | unknown
  type?: 'info' | 'success' | 'warning' | 'error'
  timeout?: number
  srOnly?: boolean
}

export function showFlashAlert(props: ShowFlashAlertProps): void

export declare const defaultTimeout: number
