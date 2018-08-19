const stateConst = {
  isVisible: true,
  isFull: false,
  presale: {}
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'SHOW_PRINT_PRESALE_PANEL':
    {
      return {
        ...state,
        isVisible: true
      }
    } // case

    case 'HIDE_PRINT_PRESALE_PANEL':
    {
      return {
        ...state,
        isVisible: false
      }
    } // case

    case 'TOGGLE_PRINT_PRESALE_PANEL':
    {
      const visibleOrNot = state.isVisible
      return {
        ...state,
        isVisible: visibleOrNot
      }
    } // case

    case 'TOGGLE_PRINT_PRESALE_PANEL_FULL':
    {
      const fullOrNot = state.isFull
      return {
        ...state,
        isFull: !fullOrNot
      }
    } // case

    case 'SET_PRINT_PRESALE':
    {
      const presale = action.payload
      try {
        presale.cart = JSON.parse(presale.cart)
        presale.user = JSON.parse(presale.user)
        presale.client = JSON.parse(presale.client)
      } catch (err) { console.log(err) }
      return {
        ...state,
        presale: presale
      }
    } // case

    case 'CLEAR_PRINT_PRESALE':
    {
      return {
        ...state,
        presale: {}
      }
    } // case

  } // switch

  return state // default return

} // reducer
