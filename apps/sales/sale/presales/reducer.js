
const stateConst = {
  presales: [],
  isVisible: false,
  presaleId: '',
  presaleUser: {},
  activeIndex: 0,
  activePresaleId: ''
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {
    case 'SET_PRESALE_ID':
    {
      return {
        ...state,
        presaleId: action.payload
      }
    } // case

    case 'SET_ACTIVE_PRESALE_ID':
    {
      return {
        ...state,
        activePresaleId: action.payload
      }
    } // case

    case 'CLEAR_ACTIVE_PRESALE_ID':
    {
      return {
        ...state,
        activePresaleId: ''
      }
    } // case

    case 'SET_ACTIVE_PRESALE_INDEX':
    {
      return {
        ...state,
        activeIndex: action.payload
      }
    } // case

    case 'CLEAR_ACTIVE_PRESALE_INDEX':
    {
      return {
        ...state,
        activeIndex: 0
      }
    } // case

    case `PRESALES_INCREASE_ACTIVE_INDEX`:
    {
      const searchResultsMax = state.presales.length - 1
      let activeIndex = state.activeIndex + 1
      if (activeIndex > searchResultsMax) {
        activeIndex = 0
      }
      return {
        ...state,
        activeIndex: activeIndex
      }
    } // case

    case `PRESALES_DECREASE_ACTIVE_INDEX`:
    {
      const searchResultsMax = state.presales.length - 1
      let activeIndex = state.activeIndex - 1
      if (activeIndex < 0) {
        activeIndex = searchResultsMax
      }
      return {
        ...state,
        activeIndex: activeIndex
      }
    } // case

    case 'CLEAR_PRESALE_ID':
    {
      return {
        ...state,
        presaleId: ''
      }
    } // case

    case 'SET_PRESALE_USER':
    {
      return {
        ...state,
        presaleUser: action.payload
      }
    } // case

    case 'CLEAR_PRESALE_USER':
    {
      return {
        ...state,
        presaleUser: {}
      }
    } // case

    case 'SHOW_PRESALES_PANEL':
    {
      return {
        ...state,
        isVisible: true
      }
    } // case

    case 'HIDE_PRESALES_PANEL':
    {
      return {
        ...state,
        isVisible: false
      }
    } // case

    case 'FETCH_PRESALES_REJECTED':
    {
      return {
        ...state,
        presales: []
      }
    } // case

    case 'FETCH_PRESALES_FULFILLED':
    {
      const presales = action.payload.map(presale => {
        return {
          ...presale,
          cart: JSON.parse(presale.cart),
          client: JSON.parse(presale.client),
          user: JSON.parse(presale.user)
        }
      })
      return {
        ...state,
        presales: presales
      }
    } // case

  } // switch

  return state // default return

} // reducer
