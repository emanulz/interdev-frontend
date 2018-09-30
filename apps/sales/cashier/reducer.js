const stateConst = {
  fullWidth: false,
  moneyBills: []
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'TOGGLE_CASHIER_FULL_WIDTH':
    {
      const width = !state.fullWidth
      return {
        ...state,
        fullWidth: width
      }
    } // case

    case 'FETCH_MONEY_BILLS_FULFILLED':
    {
      return {
        ...state,
        moneyBills: action.payload
      }
    } // case

    case 'FETCH_MONEY_BILLS_REJECTED':
    {
      return {
        ...state,
        moneyBills: []
      }
    } // case

  } // switch

  return state // default return

} // reducer
