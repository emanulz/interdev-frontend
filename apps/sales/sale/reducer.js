const stateConst = {
  fullWidth: false,
  isInvoice: 'TIQUETE'
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'TOGGLE_FULL_WIDTH':
    {
      const width = !state.fullWidth
      return {
        ...state,
        fullWidth: width
      }
    } // case

    case 'SET_IS_INVOICE_VALUE':
    {
      return {
        ...state,
        isInvoice: action.payload
      }
    } // case

  } // switch

  return state // default return

} // reducer
