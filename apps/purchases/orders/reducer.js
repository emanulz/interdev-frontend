const stateConst = {
  fullWidth: false,
  orderUUID: '',
  projects: [],
  activities: [],
  projectSelected: '',
  activitySelected: '',
  deliveryDate: '',
  orders: []
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'TOGGLE_FULL_WIDTH':
    {
      const width = !state.fullWidth
      return {
        ...state,
        fullWidth: width
      }
    } // case

    case 'SET_ORDER_UUID':
    {
      return {
        ...state,
        orderUUID: action.payload
      }
    } // case

    case 'SET_ORDER_DELIVERY_DATE':
    {
      return {
        ...state,
        deliveryDate: action.payload
      }
    } // case

    case 'CLEAR_ORDER_DELIVERY_DATE':
    {
      return {
        ...state,
        deliveryDate: ''
      }
    } // case

    case 'FETCH_ORDER_PROJECTS_FULFILLED':
    {
      return {
        ...state,
        projects: action.payload
      }
    } // case

    case 'FETCH_ORDER_PROJECTS_REJECTED':
    {
      return {
        ...state,
        projects: []
      }
    } // case
    case 'SET_PROJECT_ACTIVITIES':
    {
      return {
        ...state,
        activities: action.payload
      }
    } // case

    case 'SET_PROJECT_ACTIVITIES_REJECTED':
    {
      return {
        ...state,
        activities: []
      }
    } // case
    case 'SET_ORDER_PROJECT':
    {
      return {
        ...state,
        projectSelected: action.payload
      }
    } // case
    case 'CLEAR_ORDER_PROJECT':
    {
      return {
        ...state,
        projectSelected: ''
      }
    } // case
    case 'SET_ORDER_ACTIVITY':
    {
      return {
        ...state,
        activitySelected: action.payload
      }
    } // case
    case 'CLEAR_ORDER_ACTIVITY':
    {
      return {
        ...state,
        activitySelected: ''
      }
    } // case

    case 'FETCH_ORDERS_FULFILLED':
    {
      return {
        ...state,
        orders: action.payload
      }

    } // case

    case 'FETCH_ORDERS_REJECTED':
    {
      return {
        ...state,
        orders: []
      }
    } // case
  } // switch

  return state // default return

} // reducer
