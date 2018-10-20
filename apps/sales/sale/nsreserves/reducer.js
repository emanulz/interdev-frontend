
const stateConst = {
  nsreserves: [],
  isVisible: false,
  nsreserveId: '',
  nsreserveUser: {}
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {
    case 'SET_NSRESERVE_ID':
    {
      return {
        ...state,
        nsreserveId: action.payload
      }
    } // case

    case 'CLEAR_NSRESERVE_ID':
    {
      return {
        ...state,
        nsreserveId: ''
      }
    } // case

    case 'SET_NSRESERVE_USER':
    {
      return {
        ...state,
        nsreserveUser: action.payload
      }
    } // case

    case 'CLEAR_NSRESERVE_USER':
    {
      return {
        ...state,
        nsreserveUser: {}
      }
    } // case

    case 'SHOW_NSRESERVES_PANEL':
    {
      return {
        ...state,
        isVisible: true
      }
    } // case

    case 'HIDE_NSRESERVES_PANEL':
    {
      return {
        ...state,
        isVisible: false
      }
    } // case

    case 'FETCH_NSRESERVES_REJECTED':
    {
      return {
        ...state,
        nsreserves: []
      }
    } // case

    case 'FETCH_NSRESERVES_FULFILLED':
    {
      const nsreserves = action.payload.map(nsreserve => {
        return {
          ...nsreserve,
          cart: JSON.parse(nsreserve.cart),
          client: JSON.parse(nsreserve.client),
          user: JSON.parse(nsreserve.user)
        }
      })
      return {
        ...state,
        nsreserves: nsreserves
      }
    } // case

  } // switch

  return state // default return

} // reducer
