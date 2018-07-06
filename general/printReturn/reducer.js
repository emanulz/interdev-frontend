const stateConst = {
  isVisible: true,
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
      const returnObj = action.payload
      let returnObject = {}
      let creditNote = {}
      let voucher = {}
      try {
        returnObject = JSON.parse(returnObj.return_object)
        creditNote = JSON.parse(returnObj.credit_note)
        voucher = JSON.parse(returnObj.voucher)
      } catch (err) { console.log(err) }
      return {
        ...state,
        returnObject: returnObject,
        credit_note: creditNote,
        voucher: voucher
      }
    } // case

    case 'CLEAR_PRINT_RETURN_RETURN':
    {
      return {
        ...state,
        sale: {},
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
