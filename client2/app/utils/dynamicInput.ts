export interface dynamicInputInterface {
  className?: string
  type?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
}