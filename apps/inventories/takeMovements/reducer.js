
const stateConst = {
  cart: [],
  physicalTakeId: ''
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'ADD_TO_TAKE_MOVEMENTS_CART':
    {
      const cart = state.cart
      cart.push(action.payload)
      return {
        ...state,
        cart: cart
      }
    } // case

    case 'REMOVE_FROM_TAKE_MOVEMENTS_CART':
    {
      const cart = state.cart
      cart.splice(action.payload.index, 1)
      return {
        ...state,
        cart: cart
      }
    } // case

    case 'CLEAT_TAKE_MOVEMENTS_CART':
    {
      return {
        ...state,
        cart: []
      }
    } // case

    case 'SET_TAKE_ID':
    {
      return {
        ...state,
        physicalTakeId: action.paylod
      }
    } // case

    case 'CLEAR_TAKE_ID':
    {
      return {
        ...state,
        physicalTakeId: ''
      }
    } // case

  } // switch

  return state // default return

} // reducer
