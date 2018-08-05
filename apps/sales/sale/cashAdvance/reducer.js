
const stateConst = {
  isVisible: false,
  cashAdvanceData: {
    client_id: '',
    amount: '',
    description: ''
  }
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'SHOW_CASH_ADVANCE_PANEL':
    {
      return {
        ...state,
        isVisible: true
      }
    } // case

    case 'HIDE_CASH_ADVANCE_PANEL':
    {
      return {
        ...state,
        isVisible: false
      }
    } // case

    case 'SET_CASH_ADVANCE_DATA':
    {
      return {
        ...state,
        cashAdvanceData: action.payload
      }
    } // case

    case 'CLEAR_CASH_ADVANCE_DATA':
    {
      return {
        ...state,
        stateConst
      }
    } // case

    case 'SET_SALE_EXEMPT':
    {
      return {
        ...state,
        isExempt: true
      }
    } // case

    case 'CLEAR_SALE_EXEMPT':
    {
      return {
        ...state,
        isExempt: false
      }
    } // case

  } // switch

  return state // default return

} // reducer
