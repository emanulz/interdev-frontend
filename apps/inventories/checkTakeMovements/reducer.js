
const stateConst = {
  cart: [],
  physicalTakeId: '',
  addFieldValue: '',
  openTakes: [],
  productMovements: {},
  productActive: ''
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'FETCH_OPEN_TAKES_FULFILLED':
    {
      return {
        ...state,
        openTakes: action.payload
      }
    } // case

    case 'FETCH_OPEN_TAKES_REJECTED':
    {
      return {
        ...state,
        openTakes: []
      }
    } // case

    case 'SET_CHECK_ADD_FIELD_VALUE':
    {
      return {
        ...state,
        addFieldValue: action.payload
      }
    } // case

    case 'CLEAR_CHECK_ADD_FIELD_VALUE':
    {
      return {
        ...state,
        addFieldValue: ''
      }
    } // case

    case 'ADD_TO_CHECK_TAKE_MOVEMENTS_CART':
    {
      return {
        ...state,
        cart: action.payload.movements
      }

    } // case

    case 'REMOVE_FROM_CHECK_TAKE_MOVEMENTS_CART':
    {

      const newCart = [...state.cart]
      newCart.splice(action.payload, 1)

      return {
        ...state,
        cart: newCart
      }
    } // case

    case 'CLEAR_CHECK_TAKE_MOVEMENTS_CART':
    {
      return {
        ...state,
        cart: []
      }
    } // case

    case 'SET_MOVEMENTS_TAKE_ID':
    {
      return {
        ...state,
        physicalTakeId: action.payload
      }
    } // case

    case 'CLEAR_MOVEMENTS_TAKE_ID':
    {
      return {
        ...state,
        physicalTakeId: ''
      }
    } // case

    case 'ADD_CHECK_TAKE_PRODUCT_MOVEMENTS':
    {
      const id = action.payload.id
      const productMovements = state.productMovements
      delete productMovements[id]
      productMovements[id] = action.payload.movements
      return {
        ...state,
        productMovements: productMovements
      }
    } // case

    case 'CLEAR_CHECK_TAKE_PRODUCT_MOVEMENTS':
    {
      return {
        ...state,
        productMovements: {}
      }
    } // case

    case 'SET_CHECK_TAKE_PRODUCT_ACTIVE':
    {
      return {
        ...state,
        productActive: action.payload
      }
    } // case

    case 'CLEAR_CHECK_TAKE_PRODUCT_ACTIVE':
    {
      return {
        ...state,
        productActive: ''
      }
    } // case

  } // switch

  return state // default return

} // reducer
