const stateConst = {
  fullWidth: false,
  orderUUID: ''
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

    case 'SET_ORDER_UUID':
    {
      return {
        ...state,
        orderUUID: action.payload
      }
    } // case

  } // switch

  return state // default return

} // reducer
