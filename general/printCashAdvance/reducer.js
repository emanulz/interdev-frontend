const stateConst = {
  isVisible: false,
  isFull: false,
  cashAdvance: {},
  voucher: {},
  company: {}
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'SHOW_PRINT_CASH_ADVANCE_PANEL':
    {
      return {
        ...state,
        isVisible: true
      }
    } // case

    case 'HIDE_PRINT_CASH_ADVANCE_PANEL':
    {
      return {
        ...state,
        isVisible: false
      }
    } // case

    case 'TOGGLE_PRINT_CASH_ADVANCE_PANEL':
    {
      const visibleOrNot = state.isVisible
      return {
        ...state,
        isVisible: visibleOrNot
      }
    } // case

    case 'TOGGLE_PRINT_CASH_ADVANCE_PANEL_FULL':
    {
      const fullOrNot = state.isFull
      return {
        ...state,
        isFull: !fullOrNot
      }
    } // case

    case 'SET_PRINT_CASH_ADVANCE_ADVANCE':
    {
      const cashAdvance = action.payload
      cashAdvance.client = JSON.parse(cashAdvance.client)
      cashAdvance.user = JSON.parse(cashAdvance.user)
      return {
        ...state,
        cashAdvance: cashAdvance
      }
    } // case

    case 'CLEAR_PRINT_CASH_ADVANCE_ADVANCE':
    {
      return {
        ...state,
        cashAdvance: {}
      }
    } // case

    case 'SET_PRINT_CASH_ADVANCE_VOUCHER':
    {
      const voucher = action.payload
      return {
        ...state,
        voucher: voucher
      }
    } // case

    case 'CLEAR_PRINT_CASH_ADVANCE_VOUCHER':
    {
      return {
        ...state,
        voucher: {}
      }
    } // case

    case 'SET_PRINT_CASH_ADVANCE_COMPANY':
    {
      return {
        ...state,
        company: action.payload.data
      }
    } // case

    case 'CLEAR_PRINT_CASH_ADVANCE_COMPANY':
    {
      return {
        ...state,
        company: {}
      }
    } // case

  } // switch

  return state // default return

} // reducer
