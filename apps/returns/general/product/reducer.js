const stateConst = {
  products: {},
  inputVal: ''
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'FETCH_PRODUCTS_REJECTED':
    {
      return {
        ...state,
        products: {}
      }
    } // case

    case 'FETCH_PRODUCTS_FULFILLED':
    {
      return {
        ...state,
        products: action.payload
      }
    } // case

    case 'SET_PRODUCT_FIELD_VALUE':
    {
      return {
        ...state,
        inputVal: action.payload
      }
    } // case

    case 'CLEAR_PRODUCT_FIELD_VALUE':
    {
      return {
        ...state,
        inputVal: ''
      }
    } // case

    case 'NEW_SALE':
    {
      const products = state.products
      state = stateConst
      return {
        ...state, products: products
      }
    } // case

  } // switch

  return state // default return

} // reducer
