
const stateConst = {
  cart: [],
  physicalTakeId: '',
  addFieldValue: '',
  openTakes: []
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

    case 'SET_ADD_FIELD_VALUE':
    {
      return {
        ...state,
        addFieldValue: action.payload
      }
    } // case

    case 'CLEAR_ADD_FIELD_VALUE':
    {
      return {
        ...state,
        addFieldValue: ''
      }
    } // case

    case 'ADD_TO_TAKE_MOVEMENTS_CART':
    {
      return {
        ...state,
        cart: [
          // action.payload,
          ...state.cart,
          action.payload
        ]
      }

    } // case

    case 'REMOVE_FROM_TAKE_MOVEMENTS_CART':
    {

      const newCart = [...state.cart]
      newCart.splice(action.payload, 1)

      return {
        ...state,
        cart: newCart
      }
    } // case

    case 'UPDATE_TAKE_MOVEMENTS_CART_QTY':
    {

      const newCart = [...state.cart]
      newCart[action.payload.index].qty = parseFloat(action.payload.qty)

      return {
        ...state,
        cart: newCart
      }
    } // case

    case 'CLEAR_TAKE_MOVEMENTS_CART':
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

  } // switch

  return state // default return

} // reducer
