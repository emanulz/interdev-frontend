const stateConst = {
  adminLocked: false
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'TOGGLE_ADMIN_LOCKED':
    {
      const locked = state.adminLocked
      return {
        ...state,
        adminLocked: !locked
      }

    } // case

    case 'FETCH_IS_ADMIN_LOCKED_FULFILLED':
    {
      return {
        ...state,
        adminLocked: action.payload
      }

    } // case

    case 'FETCH_IS_ADMIN_LOCKED_REJECTED':
    {
      return {
        ...state,
        adminLocked: true
      }

    } // case

  } // switch

  return state // default return

} // reducer
