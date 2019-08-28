const stateConst = {
  paymentArray: [],
  paymentActive: {
    movements: []
  },
  payments: [],
  creditPayMethod: 'CASH',
  creditPayNotes: '',
  clientVouchers: []
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {
    // ***********************************
    // PAYMENTS
    // ***********************************
    case 'FETCH_PAYMENTS_FULFILLED':
    {
      // const payments = action.payload
      // payments.forEach(payment => {
      //   const client = JSON.parse(payment.client)
      //   payment.client = client
      // })
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

    case 'FETCH_CLIENT_VOUCHERS_FULFILLED':
    {
      return {
        ...state,
        clientVouchers: action.payload
      }

    } // case

    case 'CLEAR_CLIENT_VOUCHERS':
    {
      return {
        ...state,
        clientVouchers: action.payload
      }

    } // case

    case 'FETCH_CLIENT_VOUCHERS_REJECTED':
    {
      return {
        ...state,
        clientVouchers: []
      }
    } // case

    case 'SET_CREDIT_PAY_METHOD':
    {
      return {
        ...state,
        creditPayMethod: action.payload
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
    // PAYMENT NOTES
    // ***********************************
    case 'SET_CREDIT_PAY_NOTES':
    {
      return {
        ...state,
        creditPayNotes: action.payload
      }
    } // case
    // ***********************************
    // PAYMENT OBJECT
    // ***********************************
    case 'CLEAR_PAYMENT':
    {
      return {
        ...state,
        payment: {
          movements: []
        }
      }
    }

    case 'SET_PAYMENT':
    {
      // const payment = {...action.payload}
      // payment.records = payment.sales ? JSON.parse(payment.sales) : JSON.parse(payment.records)
      // payment.client = JSON.parse(payment.client)
      return {
        ...state,
        paymentActive: action.payload
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
      const indexInArray = array.findIndex(item => item.record.id == action.payload)
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
      const indexInArray = array.findIndex(item => item.record.id == action.payload.record.id)
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
