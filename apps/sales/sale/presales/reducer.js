
const stateConst = {
  presales: [],
  isVisible: false,
  presaleId: '',
  presaleUser: {}
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
