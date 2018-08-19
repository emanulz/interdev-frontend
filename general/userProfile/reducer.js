const stateConst = {
  profile: {},
  taxPayer: {},
  tp_locals: []
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'FETCH_USER_PROFILE_FULFILLED':
    {
      return {
        ...state,
        profile: action.payload.profile,
        taxPayer: action.payload.taxpayer,
        tp_locals: action.payload.tp_locals
      }
    } // case

    case 'FETCH_USER_PROFILE_REJECTED':
    {
      return {
        ...state,
        profile: {},
        taxPayer: {},
        tp_locals: []
      }
    } // case

  } // switch

  return state // default return

} // reducer
