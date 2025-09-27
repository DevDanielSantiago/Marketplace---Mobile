export function priceToCents(price: string): number {
  const formattedPrice = price.replace(/\./g, '').replace(',', '.')

  return parseFloat(formattedPrice) * 100
}
