
export function getTotalAmount(list, currency) {
  const filteredByCurrency = list.filter(item => {
    return item.currency_code == currency
  })
  let total = 0
  filteredByCurrency.forEach(element => {
    total += parseFloat(element.value) * parseFloat(element.amount)
  })
  return total
}
