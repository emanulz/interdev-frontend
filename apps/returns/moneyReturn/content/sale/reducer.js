const stateConst = {
  saleActive: {},
  sales: {}
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'SET_SALE':
    {
      const sale = action.payload
      sale.cart = JSON.parse(sale.cart)
      sale.pay = JSON.parse(sale.pay)
      sale.client = JSON.parse(sale.client)
      if (sale.returns_collection.length) {
        try {
          sale.returns_collection = JSON.parse(sale.returns_collection)
        } catch (err) {
          console.log(err)
        }
      }
      return {
        ...state,
        saleActive: action.payload
      }
    }// case

    case 'CLEAR_SALE':
    {
      return {
        ...state,
        saleActive: {}
      }
    } // case

    case 'CLEAR_SALE_ALL':
    {
      return stateConst
    } // case

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
        sales: {}
      }
    } // case

    case 'CLEAR_SALES':
    {
      return {
        ...state,
        sales: {}
      }
    } // case

  } // switch

  return state // default return

} // reducer
