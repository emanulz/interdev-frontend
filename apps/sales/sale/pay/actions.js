// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
// import alertify from 'alertifyjs'

// Finds a code in the cart and sends a dispatch to remove it from cart based on index
export function updateStoreCashAmount(amount, saleTotal, client, payObject, dispatch, isCredit) {

  const res = (amount) // if its a value
    ? {
      type: 'UPDATE_CASH_AMOUNT',
      payload: parseFloat(amount)
    }
    : {
      type: 'UPDATE_CASH_AMOUNT',
      payload: 0
    }
  if (isCredit) {
    autoUpdateCreditAmount('CASH', amount, saleTotal, client.client, payObject, dispatch)
  }
  return res
}

export function updateStoreCardAuth(number) {

  const res = (number) // if its a value
    ? {
      type: 'UPDATE_CARD_AUTH',
      payload: number
    }
    : {
      type: 'UPDATE_CARD_AUTH',
      payload: ''
    }

  return res
}

export function updateStoreCardDigits(number) {

  const res = (number) // if its a value
    ? {
      type: 'UPDATE_CARD_DIGITS',
      payload: number
    }
    : {
      type: 'UPDATE_CARD_DIGITS',
      payload: ''
    }

  return res
}

export function updateStoreCardAmount(amount, saleTotal, client, payObject, dispatch, isCredit) {

  const res = (amount) // if its a value
    ? {
      type: 'UPDATE_CARD_AMOUNT',
      payload: parseFloat(amount)
    }
    : {
      type: 'UPDATE_CARD_AMOUNT',
      payload: 0
    }

  if (isCredit) {
    autoUpdateCreditAmount('CARD', amount, saleTotal, client.client, payObject, dispatch)
  }

  return res
}

export function updateStoreCreditAmount(amount) {

  const res = (amount) // if its a value
    ? {
      type: 'UPDATE_CREDIT_AMOUNT',
      payload: parseFloat(amount)
    }
    : {
      type: 'UPDATE_CREDIT_AMOUNT',
      payload: 0
    }

  return res
}

export function updateStoreTransferAmount(amount, saleTotal, client, payObject, dispatch, isCredit) {

  const res = (amount) // if its a value
    ? {
      type: 'UPDATE_TRANSFER_AMOUNT',
      payload: parseFloat(amount)
    }
    : {
      type: 'UPDATE_TRANSFER_AMOUNT',
      payload: 0
    }

  if (isCredit) {
    autoUpdateCreditAmount('TRAN', amount, saleTotal, client.client, payObject, dispatch)
  }

  return res
}

export function updateStoreTransferBank(number) {

  const res = (number) // if its a value
    ? {
      type: 'UPDATE_TRANSFER_BANK',
      payload: number
    }
    : {
      type: 'UPDATE_TRANSFER_BANK',
      payload: ''
    }

  return res
}

export function updateStoreTransferNumber(number) {

  const res = (number) // if its a value
    ? {
      type: 'UPDATE_TRANSFER_NUMBER',
      payload: number
    }
    : {
      type: 'UPDATE_TRANSFER_NUMBER',
      payload: ''
    }

  return res
}

export function updateStoreVoucherAmount(checked, id, amount, saleTotal, client, payObject, dispatch, isCredit) {

  const payload = {
    voucherNumber: id,
    amount: parseFloat(amount),
    type: 'VOUC'
  }

  const res = (checked) // if its a value
    ? {
      type: 'ADD_TO_VOUCHER_ARRAY',
      payload: payload
    }
    : {
      type: 'REMOVE_FROM_VOUCHER_ARRAY',
      payload: payload
    }
  // ADDED AMOUNT CAN BE NEGATIVE IF THE CHECK WAS REMOVED
  const addedAmount = checked ? parseFloat(amount) : parseFloat(amount) * -1
  if (isCredit) {
    autoUpdateCreditAmount('VOUC', addedAmount, saleTotal, client.client, payObject, dispatch)
  }
  return res
}

export function autoUpdateCreditAmount(model, amount, saleTotal, client, payObject, dispatch) {
  let creditAmount = 0
  if (client.has_credit) {
    const debt = Math.abs(parseFloat(client.balance))
    const limit = Math.abs(parseFloat(client.credit_limit))
    const available = limit - debt
    if (limit > (debt + saleTotal)) {
      creditAmount = saleTotal - getPayNoCredit(payObject, model, amount)
    } else {
      creditAmount = available
    }
  }
  creditAmount = creditAmount > 0 ? creditAmount : 0
  dispatch({
    type: 'UPDATE_CREDIT_AMOUNT',
    payload: creditAmount
  })
}

function getPayNoCredit(payObject, model, amount) {
  switch (model) {
    case 'CASH':
    {
      return getPayCard(payObject) + getPayTransfer(payObject) + parseFloat(amount) + getPayCashAdvances(payObject) + getPayVouchers(payObject)
    }
    case 'CARD':
    {
      return getPayCash(payObject) + getPayTransfer(payObject) + parseFloat(amount) + getPayCashAdvances(payObject) + getPayVouchers(payObject)
    }
    case 'TRAN':
    {
      return getPayCash(payObject) + getPayCard(payObject) + parseFloat(amount) + getPayCashAdvances(payObject) + getPayVouchers(payObject)
    }
    case 'CRED':
    {
      return getPayCash(payObject) + getPayTransfer(payObject) + getPayCard(payObject) + getPayCashAdvances(payObject) + getPayVouchers(payObject)
    }
    case 'VOUC':
    {
      return getPayCash(payObject) + getPayTransfer(payObject) + getPayCard(payObject) + getPayCashAdvances(payObject) + getPayVouchers(payObject) + amount
    }
  }
}

function getPayCash(payObject) {
  let total = 0
  for (const item in payObject.cash) {
    total += payObject.cash[item].amount
  }
  return total
}

function getPayCard(payObject) {
  let total = 0
  for (const item in payObject.card) {
    total += payObject.card[item].amount
  }
  return total
}

function getPayTransfer(payObject) {
  let total = 0
  for (const item in payObject.tran) {
    total += payObject.tran[item].amount
  }
  return total
}

function getPayCashAdvances(payObject) {
  let total = 0
  for (const item in payObject.csha) {
    total += payObject.csha[item].amount
  }
  return total
}

function getPayVouchers(payObject) {
  let total = 0
  for (const item in payObject.vouc) {
    total += payObject.vouc[item].amount
  }
  return total
}
