const stateConst = {
  cashAmount: ''
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'SET_PRESALE_CASH_AMOUNT':
    {
      return {
        ...state,
        cashAmount: action.payload
      }
    }

    case 'CLEAR_PRESALE_CASH_AMOUNT':
    {
      return {
        ...state,
        cashAmount: ''
      }
    }

  } // switch

  return state // default return

} // reducer
