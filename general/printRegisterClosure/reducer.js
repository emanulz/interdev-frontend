const stateConst = {
  isVisible: false,
  isFull: false,
  registerClosure: {}
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'SHOW_PRINT_REGISTER_CLOSURE_PANEL':
    {
      return {
        ...state,
        isVisible: true
      }
    } // case

    case 'HIDE_PRINT_REGISTER_CLOSURE_PANEL':
    {
      return {
        ...state,
        isVisible: false
      }
    } // case

    case 'TOGGLE_PRINT_REGISTER_CLOSURE_PANEL':
    {
      const visibleOrNot = state.isVisible
      return {
        ...state,
        isVisible: visibleOrNot
      }
    } // case

    case 'TOGGLE_PRINT_REGISTER_CLOSURE_PANEL_FULL':
    {
      const fullOrNot = state.isFull
      return {
        ...state,
        isFull: !fullOrNot
      }
    } // case

    case 'SET_PRINT_REGISTER_CLOSURE_REGISTER_CLOSURE':
    {
      return {
        ...state,
        registerClosure: action.payload
      }
    } // case

    case 'CLEAR_PRINT_REGISTER_CLOSURE_REGISTER_CLOSURE':
    {
      return {
        ...state,
        registerClosure: {}
      }
    } // case

    case 'SET_PRINT_REGISTER_CLOSURE_COMPANY':
    {
      return {
        ...state,
        company: action.payload.data
      }
    } // case

    case 'CLEAR_PRINT_REGISTER_CLOSURE_COMPANY':
    {
      return {
        ...state,
        company: {}
      }
    } // case

  } // switch

  return state // default return

} // reducer
