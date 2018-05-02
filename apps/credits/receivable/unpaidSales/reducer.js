const stateConst = {
  clientActiveSalesWithDebt: [],
  clientActiveMovements: []
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'FETCH_CLIENT_SALES_WITH_DEBT_FULFILLED':
    {
      return {
        ...state,
        clientActiveSalesWithDebt: action.payload
      }

    } // case

    case 'FETCH_CLIENT_SALES_WITH_DEBT_REJECTED':
    {
      return {
        ...state,
        clientActiveSalesWithDebt: []
      }
    } // case

    case 'CLEAR_CLIENT_SALES_WITH_DEBT':
    {
      return {
        ...state,
        clientActiveSalesWithDebt: []
      }
    } // case

    case 'FETCH_CLIENT_MOVEMENTS_FULFILLED':
    {
      return {
        ...state,
        clientActiveMovements: action.payload
      }

    } // case

    case 'FETCH_CLIENT_MOVEMENTS_REJECTED':
    {
      return {
        ...state,
        clientActiveMovements: []
      }
    } // case

    case 'CLEAR_CLIENT_MOVEMENTS':
    {
      return {
        ...state,
        clientActiveMovements: []
      }
    } // case

  } // switch

  return state // default return

} // reducer
