const stateConst = {
  fullWidth: false,
  requestUUID: '',
  requests: []
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

    case 'FETCH_REQUESTS_FULFILLED':
    {
      return {
        ...state,
        requests: action.payload
      }

    } // case

    case 'FETCH_REQUESTS_REJECTED':
    {
      return {
        ...state,
        requests: []
      }
    } // case
  } // switch

  return state // default return

} // reducer
