
const stateConst = {
  workOrders: [],
  isVisible: false,
  workOrderId: '',
  workOrderUser: {},
  workOrderActive: {}
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {
    case 'SET_WORK_ORDER_ID':
    {
      return {
        ...state,
        workOrderId: action.payload
      }
    } // case

    case 'CLEAR_WORK_ORDER_ID':
    {
      return {
        ...state,
        workOrderId: ''
      }
    } // case

    case 'SET_WORK_ORDER_USER':
    {
      return {
        ...state,
        workOrderUser: action.payload
      }
    } // case

    case 'CLEAR_WORK_ORDER_USER':
    {
      return {
        ...state,
        workOrderUser: {}
      }
    } // case

    case 'SET_WORK_ORDER_LOADED':
    {
      return {
        ...state,
        workOrderActive: action.payload
      }
    } // case

    case 'CLEAR_WORK_ORDER_LOADED':
    {
      return {
        ...state,
        workOrderActive: {}
      }
    } // case

    case 'SHOW_WORK_ORDERS_PANEL':
    {
      return {
        ...state,
        isVisible: true
      }
    } // case

    case 'HIDE_WORK_ORDERS_PANEL':
    {
      return {
        ...state,
        isVisible: false
      }
    } // case

    case 'FETCH_WORK_ORDERS_REJECTED':
    {
      return {
        ...state,
        workOrders: []
      }
    } // case

    case 'FETCH_WORK_ORDERS_FULFILLED':
    {
      const workOrders = action.payload.map(workOrder => {
        return {
          ...workOrder,
          client: JSON.parse(workOrder.client),
          receiving_employee: JSON.parse(workOrder.receiving_employee)
        }
      })
      return {
        ...state,
        workOrders: workOrders
      }
    } // case

  } // switch

  return state // default return

} // reducer
