const stateConst = {
  fullWidth: true,
  return_method: 'CASH'
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

    case 'SET_FULL_WIDTH':
    {
      return {
        ...state,
        fullWidth: true
      }
    } // case

    case 'SET_RETURN_METHOD':
    {
      return {
        ...state,
        return_method: action.payload
      }
    } // case

  } // switch

  return state // default return

} // reducer
