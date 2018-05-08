const stateConst = {
  paymentArray: [],
  payment: {},
  payments: []
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {
    // ***********************************
    // PAYMENTS
    // ***********************************
    case 'FETCH_PAYMENTS_FULFILLED':
    {
      const payments = action.payload
      payments.forEach(payment => {
        const client = JSON.parse(payment.client)
        payment.client = client
      })
      return {
        ...state,
        payments: action.payload
      }

    } // case

    case 'FETCH_PAYMENTS_REJECTED':
    {
      return {
        ...state,
        payments: []
      }
    } // case

    case 'CLEAR_PAYMENTS':
    {
      return {
        ...state,
        payments: []
      }
    } // case

    // ***********************************
    // PAYMENT OBJECT
    // ***********************************
    case 'CLEAR_PAYMENT':
    {
      return {
        ...state,
        payment: {}
      }
    }

    case 'SET_PAYMENT':
    {
      return {
        ...state,
        payment: action.payload
      }
    }

    // ***********************************
    // PAYMENT ARRAY
    // ***********************************
    case 'CLEAR_PAYMENT_ARRAY':
    {
      return {
        ...state,
        paymentArray: []
      }
    }

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
