export function formatCurrency(value: string): string {
  const digits = Number(value.replace(/\D/g, ''))

  if (!digits) {
    return ''
  }

  const centsValue = digits / 100

  return centsValue.toLocaleString('pt-BR', {
    currency: 'BRL',
    minimumFractionDigits: 2,
  })
}
