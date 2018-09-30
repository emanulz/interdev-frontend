const stateConst = {
  fullWidth: false,
  moneyBills: [],
  openBillList: []
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

    case 'ADD_TO_OPEN_BILLS_LIST':
    {
      const newLine = action.payload
      let existentOpenBillList = [...state.openBillList]
      // REMOVE THE ALREADY EXISTENT ITEM IN CART WITH SAME ID
      existentOpenBillList = existentOpenBillList.filter(item => {
        return item.value !== newLine.value
      })
      // ADD IT TO CART
      existentOpenBillList.push(newLine)
      // RETURN
      return {
        ...state,
        openBillList: existentOpenBillList
      }
    } // case

  } // switch

  return state // default return

} // reducer
