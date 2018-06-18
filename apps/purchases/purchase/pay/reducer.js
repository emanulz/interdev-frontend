const stateConst = {
  isVisible: false,
  payMethod: 'CASH',
  cashAmount: 0,
  cardAmount: 0,
  cardDigits: '',
  cardAuth: '',

  bank: '',
  transfer_reference: '',
  
  creditDays:0,
  payMethodOptions: [{'id':0, 'text': 'Efectivo'}, {'id':1, 'text': 'Transferencia'}],
  payMethodOptionSelected: 0
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'BANK_REFERENCE_CHANGED':
    {
      return {
        ...state,
        transfer_reference: action.payload
      }
    }



    case 'BANK_INPUT_CHANGED':
    {
      return {
        ...state,
        bank: action.payload
      }
    }

    case 'PAY_METHOD_OPTION_CHANGED':
    {
      return {
        ...state,
        payMethodOptionSelected: action.payload
      }
    }

    case 'SHOW_PAY_PANEL':
    {
      return {
        ...state,
        isVisible: true
      }
    } // case
    case 'CLEAR_PURCHASE':
    {
      return {
        ...state,
        isVisible: false,
        payMethod: 'CASH',
        cashAmount: 0,
        cardAmount: 0,
        cardDigits: '',
        cardAuth: '',
        creditDays:0,
      }
    }
    case 'LOADED_PURCHASE':
    {
      const pay = JSON.parse(action.payload.pay)
      return {
        ...state,
        payMethod: pay.payMethod,
        cashAmount: pay.cashAmount,
        cardAmount: pay.cardAmount,
        cardDigits: pay.cardDigits,
        cardAuth: pay.cardAuth,
        creditDays: pay.creditDays
      }
    }

    case 'HIDE_PAY_PANEL':
    {
      return {
        ...state,
        isVisible: false
      }
    } // case

    case 'CHANGE_PAY_METHOD':
    {
      return {
        ...state,
        payMethod: action.payload
      }
    } // case

    case 'UPDATE_CASH_AMOUNT':
    {
      return {
        ...state,
        cashAmount: action.payload
      }
    }
    case 'CLEAR_CASH':
    {
      return {
        ...state,
        cashAmount:0
      }
    }
    case 'UPDATE_CARD_AUTH':
    {
      return {
        ...state,
        cardAuth: action.payload
      }
    }

    case 'UPDATE_CARD_DIGITS':
    {
      return {
        ...state,
        cardDigits: action.payload
      }
    }

    case 'UPDATE_CARD_AMOUNT':
    {
      return {
        ...state,
        cardAmount : action.payload
      }
    }
    case 'CLEAR_CARD':
    {
      return {
        ...state,
        cardAmount: 0,
        cardDigits: '',
        cardAuth: '',
      }
    }
    case 'FETCH_SUPPLIERS_FULFILLED':
    {
      return {
        ...state,
        creditDays: action.payload[0].credit_days
      }
    }
    case 'UPDATE_CREDIT_DAYS':
    {
      return {
        ...state,
        creditDays:action.payload
      }
    }
    case 'CLEAR_CREDIT':
    {
      return {
        ...state,
        creditDays:0
      }
    }
    case 'NEW_SALE':
    {
      state = stateConst
      return {
        ...state, stateConst
      }
    } // case

    case 'LOADED_SALE':
    {
      return {
        ...state,
        payMethod: action.payload.pay.payMethod,
        cashAmount: action.payload.pay.cashAmount,
        cardDigits: action.payload.pay.cardDigits,
        cardAuth: action.payload.pay.cardAuth,
        creditDays: action.payload.pay.creditDays,
      }
    }

  } // switch

  return state // default return

} // reducer
