const stateConst = {
  user: {},
  profile: {}
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'FETCH_PROFILE_FULFILLED':
    {
      return {
        ...state,
        user: action.payload.user,
        profile: action.payload.profile
      }

    } // case

    case 'FETCH_PROFILE_REJECTED':
    {
      return {
        ...state,
        user: {},
        profile: {}
      }

    } // case

  } // switch

  return state // default return

} // reducer
