
const stateConst = {
  reserves: [],
  isVisible: false,
  isSavePanelVisible: false,
  reserveId: '',
  reserveUser: {}
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {
    case 'SET_RESERVE_ID':
    {
      return {
        ...state,
        reserveId: action.payload
      }
    } // case

    case 'CLEAR_RESERVE_ID':
    {
      return {
        ...state,
        reserveId: ''
      }
    } // case

    case 'SET_RESERVE_USER':
    {
      return {
        ...state,
        reserveUser: action.payload
      }
    } // case

    case 'CLEAR_RESERVE_USER':
    {
      return {
        ...state,
        reserveUser: {}
      }
    } // case

    case 'SHOW_RESERVES_PANEL':
    {
      return {
        ...state,
        isVisible: true
      }
    } // case

    case 'HIDE_RESERVES_PANEL':
    {
      return {
        ...state,
        isVisible: false
      }
    } // case

    case 'SHOW_SAVE_RESERVE_PANEL':
    {
      return {
        ...state,
        isSavePanelVisible: true
      }
    } // case

    case 'HIDE_SAVE_RESERVE_PANEL':
    {
      return {
        ...state,
        isSavePanelVisible: false
      }
    } // case

    case 'FETCH_RESERVES_REJECTED':
    {
      return {
        ...state,
        reserves: []
      }
    } // case

    case 'FETCH_RESERVES_FULFILLED':
    {
      const reserves = action.payload.map(reserve => {
        return {
          ...reserve,
          cart: JSON.parse(reserve.cart),
          client: JSON.parse(reserve.client),
          user: JSON.parse(reserve.user)
        }
      })
      return {
        ...state,
        reserves: reserves
      }
    } // case

  } // switch

  return state // default return

} // reducer
