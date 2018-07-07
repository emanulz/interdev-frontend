const stateConst = {
  fullWidth: true
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

  } // switch

  return state // default return

} // reducer
