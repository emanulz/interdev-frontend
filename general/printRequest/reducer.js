const stateConst = {
  isVisible: false,
  isFull: true,
  request: {}
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'SHOW_PRINT_REQUEST_PANEL':
    {
      return {
        ...state,
        isVisible: true
      }
    } // case

    case 'HIDE_PRINT_REQUEST_PANEL':
    {
      return {
        ...state,
        isVisible: false
      }
    } // case

    case 'TOGGLE_PRINT_REQUEST_PANEL':
    {
      const visibleOrNot = state.isVisible
      return {
        ...state,
        isVisible: visibleOrNot
      }
    } // case

    case 'TOGGLE_PRINT_REQUEST_PANEL_FULL':
    {
      const fullOrNot = state.isFull
      return {
        ...state,
        isFull: !fullOrNot
      }
    } // case

    case 'SET_PRINT_REQUEST':
    {
      const request = action.payload
      try {
        request.cart = JSON.parse(request.cart)
        request.user = JSON.parse(request.user)
        request.supplier = JSON.parse(request.supplier)
        request.project = JSON.parse(request.project)
        request.activity = JSON.parse(request.activity)
      } catch (err) { console.log(err) }
      return {
        ...state,
        request: request
      }
    } // case

    case 'CLEAR_PRINT_REQUEST':
    {
      return {
        ...state,
        request: {}
      }
    } // case

  } // switch

  return state // default return

} // reducer
