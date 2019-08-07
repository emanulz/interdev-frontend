const stateConst = {
  fullWidth: false,
  selfpurchaseUUID: ''
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

    case 'SET_SELFPURCHASE_UUID':
    {
      return {
        ...state,
        selfpurchaseUUID: action.payload
      }
    } // case
  } // switch

  return state // default return

} // reducer
