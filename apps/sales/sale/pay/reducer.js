const stateConst = {
  isVisible: false,
  payMethodActive: 'CASH',
  payObject: {
    cash: [{'type': 'CASH', 'amount': 0}],
    card: [{'type': 'CARD', 'amount': 0, 'digits': '', 'auth': ''}],
    cred: [{'type': 'CRED', 'amount': 0}],
    vouc: [],
    tran: [{'type': 'TRAN', 'amount': 0, 'transferNumber': '', 'bank': ''}],
    csha: [{'type': 'CSHA', 'amount': 0, 'cashAdvanceId': ''}]
  },
  isCredit: false
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {
    case 'CHANGE_IS_CREDIT':
    {
      return {
        ...state,
        isCredit: action.payload
      }
    } // case

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
    // ***** CASH ADVANCE *************************
    // ************************************

    case 'ADD_CASH_ADVANCE':
    {
      const newState = {...state}
      newState.payObject.csha.push(action.payload)
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
      newState.payObject.tran[0].bank = action.payload
      return newState
    }

    case 'UPDATE_TRANSFER_NUMBER':
    {
      const newState = {...state}
      newState.payObject.tran[0].transferNumber = action.payload
      return newState
    }

    // ************************************
    // **************VOUCCHER**************
    // ************************************

    case 'ADD_TO_VOUCHER_ARRAY':
    {
      const newState = {...state}
      newState.payObject.vouc.push(action.payload)
      return newState
    }

    case 'REMOVE_FROM_VOUCHER_ARRAY':
    {
      const newState = {...state}

      const index = newState.payObject.vouc.findIndex(item => item.voucherNumber == action.payload.voucherNumber)
      if (index != -1) {
        newState.payObject.vouc.splice(index, 1)
      }
      return newState
    }

    // ************************************
    // ***** NEW SALE *********************
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

    // ************************************
    // ***** CLEAR PAY ********************
    // ************************************

    case 'CLEAR_PAY':
    {
      return stateConst
    } // case

    case 'CLEAR_PAY_OBJECT':
    {
      // state = stateConst
      return {
        ...state,
        payMethodActive: 'CASH',
        payObject: {
          cash: [{'type': 'CASH', 'amount': 0}],
          card: [{'type': 'CARD', 'amount': 0, 'digits': '', 'auth': ''}],
          cred: [{'type': 'CRED', 'amount': 0}],
          vouc: [],
          tran: [{'type': 'TRAN', 'amount': 0, 'transferNumber': '', 'bank': ''}],
          csha: [{'type': 'CSHA', 'amount': 0, 'cashAdvanceId': ''}]
        }
      }
    } // case

  } // switch

  return state // default return

} // reducer
