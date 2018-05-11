const stateConst = {
  warehouseActive: '',
  warehouseInputActive: '',
  warehouseOutputActive: '',
  warehouses: []
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    // ***********************************
    // WAREHOUSES
    // ***********************************

    case 'FETCH_WAREHOUSES_REJECTED':
    {
      return {
        ...state,
        warehouses: []
      }
    } // case

    case 'FETCH_WAREHOUSES_FULFILLED':
    {
      return {
        ...state,
        warehouses: action.payload
      }
    } // case

    case 'SET_WAREHOUSE':
    {
      return {
        ...state,
        warehouseActive: action.payload
      }
    } // case

    case 'SET_WAREHOUSE_INPUT':
    {
      return {
        ...state,
        warehouseInputActive: action.payload
      }
    } // case

    case 'SET_WAREHOUSE_OUTPUT':
    {
      return {
        ...state,
        warehouseOutputActive: action.payload
      }
    } // case

    case 'CLEAR_WAREHOUSES':
    {
      return {
        ...state,
        warehouseActive: '',
        warehouseOutputActive: '',
        arehouseInputActive: ''
      }
    } // case

  } // switch

  return state // default return

} // reducer
