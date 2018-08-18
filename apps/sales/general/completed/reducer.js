const stateConst = {
  completed: false,
  isPresaleLoaded: false,
  isReserveLoaded: false,
  isWorkOrderLoaded: false,
  isRestaurantBillLoaded: false
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'PROCESS_COMPLETE':
    {
      return {
        ...state,
        completed: true
      }
    } // case

    case 'PRESALE_LOADED':
    {
      return {
        ...state,
        isPresaleLoaded: true
      }
    } // case

    case 'RESERVE_LOADED':
    {
      return {
        ...state,
        isReserveLoaded: true
      }
    } // case

    case 'WORK_ORDER_LOADED':
    {
      return {
        ...state,
        isWorkOrderLoaded: true
      }
    } // case

    case 'RESTAURANT_BILL_LOADED':
    {
      return {
        ...state,
        isRestaurantBillLoaded: true
      }
    } // case

  } // switch

  return state // default return

} // reducer
