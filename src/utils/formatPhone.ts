export function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '')

  if (digits.length === 0) {
    return ''
  }

  if (digits.length < 3) {
    return `(${digits}`
  }

  if (digits.length < 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  }

  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
}
