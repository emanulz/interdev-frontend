
const stateConst = {
  restaurantBills: [],
  isVisible: false,
  restaurantBillId: '',
  restaurantBillUser: {}
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {
    case 'SET_RESTAURANT_BILL_ID':
    {
      return {
        ...state,
        restaurantBillId: action.payload
      }
    } // case

    case 'CLEAR_RESTAURANT_BILL_ID':
    {
      return {
        ...state,
        restaurantBillId: ''
      }
    } // case

    case 'SET_RESTAURANT_BILL_USER':
    {
      return {
        ...state,
        restaurantBillUser: action.payload
      }
    } // case

    case 'CLEAR_RESTAURANT_BILL_USER':
    {
      return {
        ...state,
        restaurantBillUser: {}
      }
    } // case

    case 'SHOW_RESTAURANT_BILLS_PANEL':
    {
      return {
        ...state,
        isVisible: true
      }
    } // case

    case 'HIDE_RESTAURANT_BILLS_PANEL':
    {
      return {
        ...state,
        isVisible: false
      }
    } // case

    case 'FETCH_RESTAURANT_BILLS_REJECTED':
    {
      return {
        ...state,
        restaurantBills: []
      }
    } // case

    case 'FETCH_RESTAURANT_BILLS_FULFILLED':
    {
      const restaurantBills = action.payload.map(restaurantBill => {
        return {
          ...restaurantBill,
          cart: JSON.parse(restaurantBill.cart),
          client: JSON.parse(restaurantBill.client),
          user: JSON.parse(restaurantBill.user)
        }
      })
      return {
        ...state,
        restaurantBills: restaurantBills
      }
    } // case

  } // switch

  return state // default return

} // reducer
