const stateConst = {
  topBarToggleVisible: true,
  sideMenuVisible: false
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'PRESALE_PANEL_MOUNTED':
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
