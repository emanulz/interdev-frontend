const stateConst = {
  isVisible: true,
  payMethodActive: 'CASH',
  payObject: {
    cash: [{'type': 'CASH', 'amount': 0}],
    card: [{'type': 'CARD', 'amount': 0, 'digits': '', 'auth': ''}],
    cred: [{'type': 'CRED', 'amount': 0}],
    vouc: [{'type': 'VOUC', 'amount': 0, 'voucherNumber': '123484'}],
    tran: [{'type': 'TRAN', 'amount': 0, 'transferNumber': '', 'bank': ''}]
  }
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'SHOW_PAY_PANEL':
    {
      return {
        ...state,
        isVisible: true
      }
    } // case

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
        payMethodActive: action.payload
      }
    } // case

    // ************************************
    // ***** CASH *************************
    // ************************************

    case 'UPDATE_CASH_AMOUNT':
    {
      const newState = {...state}
      newState.payObject.cash[0].amount = action.payload
      return newState
    }
    // ************************************
    // ***** CREDIT *************************
    // ************************************

    case 'UPDATE_CREDIT_AMOUNT':
    {
      const newState = {...state}
      newState.payObject.cred[0].amount = action.payload
      return newState
    }
    // ************************************
    // ***** CARD *************************
    // ************************************
    case 'UPDATE_CARD_AMOUNT':
    {
      const newState = {...state}
      newState.payObject.card[0].amount = action.payload
      return newState
    }

    case 'UPDATE_CARD_AUTH':
    {
      const newState = {...state}
      newState.payObject.card[0].auth = action.payload
      return newState
    }

    case 'UPDATE_CARD_DIGITS':
    {
      const newState = {...state}
      newState.payObject.card[0].digits = action.payload
      return newState
    }

    // ************************************
    // ***** TRANSFER *************************
    // ************************************
    case 'UPDATE_TRANSFER_AMOUNT':
    {
      const newState = {...state}
      newState.payObject.tran[0].amount = action.payload
      return newState
    }

    case 'UPDATE_TRANSFER_BANK':
    {
      const newState = {...state}
      newState.payObject.card[0].bank = action.payload
      return newState
    }

    case 'UPDATE_TRANSFER_NUMBER':
    {
      const newState = {...state}
      newState.payObject.card[0].transferNumber = action.payload
      return newState
    }

    // ************************************
    // ***** CRED *************************
    // ************************************

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
        cardAuth: action.payload.pay.cardAuth
      }
    }

  } // switch

  return state // default return

} // reducer
