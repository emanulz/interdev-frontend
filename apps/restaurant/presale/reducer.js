const stateConst = {
  fullWidth: true,
  presaleActiveId: ''
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

    case 'SET_PRESALE_ACTIVE_ID':
    {
      return {
        ...state,
        presaleActiveId: action.payload
      }
    } // case

  } // switch

  return state // default return

} // reducer
