const stateConst = {
  listSelected: 1,
  useAsDefault: false
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
    case 'SET_LIST_AS_DEFAULT':
    {
      return {
        ...state,
        useAsDefault: action.payload
      }
    }

  } // switch

  return state // default return

} // reducer
