const stateConst = {
  registerClosure: null
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'FETCH_REGISTER_CLOSURE_FULFILLED':
    {
      if (action.payload == 'None') {
        return {
          ...state,
          registerClosure: false
        }
      } else {
        return {
          ...state,
          registerClosure: action.payload
        }
      }

    } // case

    case 'FETCH_REGISTER_CLOSURE_REJECTED':
    {
      return {
        ...state,
        registerClosure: false
      }
    } // case

  } // switch

  return state // default return

} // reducer
