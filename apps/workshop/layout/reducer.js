const stateConst = {
  topBarToggleVisible: false,
  sideMenuVisible: true
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'WORKSHOP_PANEL_MOUNTED':
    {
      return {
        ...state,
        topBarToggleVisible: true,
        sideMenuVisible: false
      }
    } // case

    case 'HOME_PANEL_MOUNTED':
    {
      return {
        ...state,
        topBarToggleVisible: false,
        sideMenuVisible: true
      }
    } // case

  } // switch

  return state // default return

} // reducer
