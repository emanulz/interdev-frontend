const stateConst = {
  clientActiveCreditPayments: []
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'FETCH_CLIENT_CREDIT_PAYMENTS_FULFILLED':
    {
      return {
        ...state,
        clientActiveCreditPayments: action.payload
      }

    } // case

    case 'FETCH_CLIENT_CREDIT_PAYMENTS_REJECTED':
    {
      return {
        ...state,
        clientActiveCreditPayments: []
      }
    } // case

  } // switch

  return state // default return

} // reducer
