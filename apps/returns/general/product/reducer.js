const stateConst = {
  products: {},
  inputVal: '',
  singleProductVisible: false,
  singleProductQty: '',
  sigleProductActive: {}
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'TOGGLE_SINGLE_PRODUCT_PANEL':
    {
      const visibleOrNot = state.singleProductVisible
      return {
        ...state,
        singleProductVisible: !visibleOrNot
      }
    } // case

    case 'HIDE_SINGLE_PRODUCT_PANEL':
    {
      return {
        ...state,
        singleProductVisible: false
      }
    } // case

    case 'SET_SINGLE_PRODUCT_QTY':
    {
      const qty = action.payload ? action.payload : ''
      return {
        ...state,
        singleProductQty: qty
      }
    } // case

    case 'CLEAR_SINGLE_PRODUCT_QTY':
    {
      return {
        ...state,
        singleProductQty: ''
      }
    } // case

    case 'SET_SINGLE_PRODUCT_ACTIVE':
    {
      return {
        ...state,
        sigleProductActive: action.payload
      }
    } // case

    case 'CLEAR_SINGLE_PRODUCT_ACTIVE':
    {
      return {
        ...state,
        sigleProductActive: {}
      }
    } // case

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
