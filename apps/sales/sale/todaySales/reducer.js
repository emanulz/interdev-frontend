
const stateConst = {
  todaySales: [],
  isVisible: false,
  next: null,
  previous: null
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'SET_TODAY_SALES_PREV_NEXT':
    {
      return {
        ...state,
        next: action.payload.next,
        previous: action.payload.previous
      }
    }

    case 'SHOW_TODAY_SALES_PANEL':
    {
      return {
        ...state,
        isVisible: true
      }
    } // case

    case 'HIDE_TODAY_SALES_PANEL':
    {
      return {
        ...state,
        isVisible: false
      }
    } // case

    case 'FETCH_TODAY_SALES_REJECTED':
    {
      return {
        ...state,
        todaySales: []
      }
    } // case

    case 'FETCH_TODAY_SALES_FULFILLED':
    {
      const todaySales = action.payload.map(sale => {
        return {
          ...sale,
          cart: JSON.parse(sale.cart),
          client: JSON.parse(sale.client),
          user: JSON.parse(sale.user)
        }
      })
      return {
        ...state,
        todaySales: todaySales
      }
    } // case

  } // switch

  return state // default return

} // reducer
