const stateConst = {
  fullWidth: false,
  takeObj: {}
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

    case 'ADD_TO_TAKE_ARRAY':
    {
      const obj = {...state.takeObj}
      obj[action.payload.id] = action.payload.object
      return {
        ...state,
        takeObj: obj
      }
    } // case

  } // switch

  return state // default return

} // reducer
