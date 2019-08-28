
const stateConst = {
  sales: [],
  saleRecord: {}
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'SET_SALE_RECORD':
    {
      return {
        ...state,
        saleRecord: action.payload
      }
    } // case

    case 'CLEAR_SALE_RECORD':
    {
      return {
        ...state,
        saleRecord: {}
      }
    } // case

  } // switch

  return state // default return

} // reducer
