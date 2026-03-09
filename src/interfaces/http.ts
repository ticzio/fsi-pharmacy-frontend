export type ShowErrorFn = (message: string) => void

export interface IValidationErrors {
  [field: string]: string[]
}
