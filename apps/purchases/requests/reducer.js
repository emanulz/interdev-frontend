const stateConst = {
  fullWidth: false,
  requestUUID: ''
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

    case 'SET_REQUEST_UUID':
    {
      return {
        ...state,
        requestUUID: action.payload
      }
    } // case

  } // switch

  return state // default return

} // reducer
