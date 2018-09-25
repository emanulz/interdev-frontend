const stateConst = {
  listSelected: 1
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'SET_PRICE_LIST':
    {
      return {
        ...state,
        listSelected: action.payload
      }
    } // case

  } // switch

  return state // default return

} // reducer
