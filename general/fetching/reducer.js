const stateConst = {
  fetching: false
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'FETCHING_STARTED':
    {
      return {
        ...state,
        fetching: true
      }

    } // case

    case 'FETCHING_DONE':
    {
      return {
        ...state,
        fetching: false
      }

    } // case

  } // switch

  return state // default return

} // reducer
