const stateConst = {
  fullWidth: false,
  registerMovements: []
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'FETCH_REGISTER_MOVEMENTS_FULFILLED':
    {
      return {
        ...state,
        registerMovements: action.payload
      }
    } // case

    case 'FETCH_REGISTER_MOVEMENTS_REJECTED':
    {
      return {
        ...state,
        registerMovements: []
      }
    } // case

  } // switch

  return state // default return

} // reducer
