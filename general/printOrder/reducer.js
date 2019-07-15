const stateConst = {
  isVisible: false,
  isFull: true,
  order: {}
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'SHOW_PRINT_ORDER_PANEL':
    {
      return {
        ...state,
        isVisible: true
      }
    } // case

    case 'HIDE_PRINT_ORDER_PANEL':
    {
      return {
        ...state,
        isVisible: false
      }
    } // case

    case 'TOGGLE_PRINT_ORDER_PANEL':
    {
      const visibleOrNot = state.isVisible
      return {
        ...state,
        isVisible: visibleOrNot
      }
    } // case

    case 'TOGGLE_PRINT_ORDER_PANEL_FULL':
    {
      const fullOrNot = state.isFull
      return {
        ...state,
        isFull: !fullOrNot
      }
    } // case

    case 'SET_PRINT_ORDER':
    {
      const order = action.payload
      try {
        order.cart = JSON.parse(order.cart)
        order.user = JSON.parse(order.user)
        order.supplier = JSON.parse(order.supplier)
        order.project = JSON.parse(order.project)
        order.activity = JSON.parse(order.activity)
      } catch (err) { console.log(err) }
      return {
        ...state,
        order: order
      }
    } // case

    case 'CLEAR_PRINT_ORDER':
    {
      return {
        ...state,
        order: {}
      }
    } // case

  } // switch

  return state // default return

} // reducer
