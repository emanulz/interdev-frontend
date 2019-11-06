const stateConst = {
  isVisible: false,
  isFull: false,
  manualRegisterMovement: {},
  registerClosure: {}
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'SHOW_PRINT_MANUAL_REGISTER_MOVEMENT_PANEL':
    {
      return {
        ...state,
        isVisible: true
      }
    } // case

    case 'HIDE_PRINT_MANUAL_REGISTER_MOVEMENT_PANEL':
    {
      return {
        ...state,
        isVisible: false
      }
    } // case

    case 'TOGGLE_PRINT_MANUAL_REGISTER_MOVEMENT_PANEL':
    {
      const visibleOrNot = state.isVisible
      return {
        ...state,
        isVisible: visibleOrNot
      }
    } // case

    case 'TOGGLE_PRINT_MANUAL_REGISTER_MOVEMENT_PANEL_FULL':
    {
      const fullOrNot = state.isFull
      return {
        ...state,
        isFull: !fullOrNot
      }
    } // case

    case 'SET_PRINT_MANUAL_REGISTER_MOVEMENT':
    {
      const manualRegisterMovement = action.payload
      return {
        ...state,
        manualRegisterMovement: manualRegisterMovement
      }
    } // case

    case 'CLEAR_PRINT_MANUAL_REGISTER_MOVEMENT':
    {
      return {
        ...state,
        manualRegisterMovement: {}
      }
    } // case

    case 'SET_PRINT_MANUAL_REGISTER_MOVEMENT_CLOSURE':
    {
      return {
        ...state,
        registerClosure: action.payload
      }
    } // case

    case 'CLEAR_PRINT_MANUAL_REGISTER_MOVEMENT_CLOSURE':
    {
      return {
        ...state,
        registerClosure: {}
      }
    } // case

  } // switch

  return state // default return

} // reducer
