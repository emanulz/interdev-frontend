const stateConst = {
  isVisible: false,
  isFull: false,
  return_object: {},
  credit_note: {},
  voucher: {},
  company: {}
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'SHOW_PRINT_RETURN_PANEL':
    {
      return {
        ...state,
        isVisible: true
      }
    } // case

    case 'HIDE_PRINT_RETURN_PANEL':
    {
      return {
        ...state,
        isVisible: false
      }
    } // case

    case 'TOGGLE_PRINT_RETURN_PANEL':
    {
      const visibleOrNot = state.isVisible
      return {
        ...state,
        isVisible: visibleOrNot
      }
    } // case

    case 'TOGGLE_PRINT_RETURN_PANEL_FULL':
    {
      const fullOrNot = state.isFull
      return {
        ...state,
        isFull: !fullOrNot
      }
    } // case

    case 'SET_PRINT_RETURN_RETURN':
    {
      const returnObject = action.payload.return_object
      const creditNote = action.payload.credit_note
      const voucher = action.payload.voucher
      try {
        returnObject.client = JSON.parse(returnObject.client)
        returnObject.sale_cart = JSON.parse(returnObject.sale_cart)
        returnObject.user = JSON.parse(returnObject.user)
        returnObject.return_list = JSON.parse(returnObject.return_list)
      } catch (err) { console.log(err) }
      return {
        ...state,
        return_object: returnObject,
        credit_note: creditNote,
        voucher: voucher
      }
    } // case

    case 'CLEAR_PRINT_RETURN_RETURN':
    {
      return {
        ...state,
        return_object: {},
        credit_note: {},
        voucher: {}
      }
    } // case

    case 'SET_PRINT_RETURN_COMPANY':
    {
      return {
        ...state,
        company: action.payload.data
      }
    } // case

    case 'CLEAR_PRINT_RETURN_COMPANY':
    {
      return {
        ...state,
        company: {}
      }
    } // case

  } // switch

  return state // default return

} // reducer
