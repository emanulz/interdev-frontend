const stateConst = {
  saleActive: {}
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

  } // switch

  return state // default return

} // reducer
