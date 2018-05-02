const stateConst = {
  paymentArray: []
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    // ***********************************
    // CLIENT MOVEMENTS
    // ***********************************

    case 'ADD_TO_PAYMENT_ARRAY':
    {
      const array = [...state.paymentArray]
      array.push(action.payload)
      return {
        ...state,
        paymentArray: array
      }
    }

    case 'REMOVE_FROM_PAYMENT_ARRAY':
    {
      const array = [...state.paymentArray]
      const indexInArray = array.findIndex(item => item.sale.id == action.payload)
      if (indexInArray != -1) {
        array.splice(indexInArray, 1)
      }
      return {
        ...state,
        paymentArray: array
      }
    }

    case 'SET_AMOUNT_PAYMENT_ARRAY':
    {
      const array = [...state.paymentArray]
      const indexInArray = array.findIndex(item => item.sale.id == action.payload.sale.id)
      if (indexInArray != -1) {
        array[indexInArray]['amount'] = action.payload.amount
      }
      return {
        ...state,
        paymentArray: array
      }
    }

  } // switch

  return state // default return

} // reducer
