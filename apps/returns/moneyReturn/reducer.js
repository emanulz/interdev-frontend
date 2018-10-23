const stateConst = {
  fullWidth: true,
  return_method: 'CASH',
  registerClosures: [],
  registerClosureSelected: ''

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

    case 'FETCH_REGISTER_CLOSURES_FULFILLED':
    {
      return {
        ...state,
        registerClosures: action.payload
      }
    } // case

    case 'FETCH_REGISTER_CLOSURES_REJECTED':
    {
      return {
        ...state,
        registerClosures: []
      }
    } // case

    case 'SET_REGISTER_CLOSURE':
    {
      return {
        ...state,
        registerClosureSelected: action.payload
      }
    } // case

    case 'CLEAR_REGISTER_CLOSURE':
    {
      return {
        ...state,
        registerClosureSelected: ''
      }
    } // case

    case 'CLEAR_REGISTER_CLOSURES':
    {
      return {
        ...state,
        registerClosures: []
      }
    } // case

  } // switch

  return state // default return

} // reducer
