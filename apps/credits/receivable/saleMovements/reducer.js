const saleModel = {
  id: '0000000000'
}

const stateConst = {
  sales: [],
  saleActive: saleModel,
  saleMovements: []
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'FETCH_SALES_FULFILLED':
    {
      return {
        ...state,
        sales: action.payload
      }

    } // case

    case 'FETCH_SALES_REJECTED':
    {
      return {
        ...state,
        sales: []
      }
    } // case

    case 'SET_SALE':
    {
      return {
        ...state,
        saleActive: action.payload
      }
    } // case

    case 'CLEAR_SALE':
    {
      return {
        ...state,
        saleActive: saleModel
      }
    } // case

    case 'FETCH_SALE_MOVEMENTS_FULFILLED':
    {
      return {
        ...state,
        saleMovements: action.payload
      }

    } // case

    case 'FETCH_SALE_MOVEMENTS_REJECTED':
    {
      return {
        ...state,
        saleMovements: []
      }
    } // case

    case 'CLEAR_SALE_MOVEMENTS':
    {
      return {
        ...state,
        saleMovements: []
      }
    } // case

  } // switch

  return state // default return

} // reducer
