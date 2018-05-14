const inventoryMovementModel = {
  movement_type: '',
  user: '',
  amount: '',
  product: '',
  product_id: '',
  description: '',
  warehouse: '',
  warehouse_id: ''
}

const stateConst = {
  inventoryMovementActive: inventoryMovementModel
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    // ***********************************
    // INVENTORY MOVEMENTS
    // ***********************************

    case 'FETCH_INVENTORY_MOVEMENTS_REJECTED':
    {
      return {
        ...state,
        inventoryMovements: []
      }
    }

    case 'FETCH_INVENTORY_MOVEMENTS_FULFILLED':
    {
      return {
        ...state,
        inventoryMovements: action.payload
      }
    }

    case 'SET_INVENTORY_MOVEMENT':
    {
      return {
        ...state,
        inventoryMovementActive: action.payload
      }
    }

    case 'CLEAR_INVENTORY_MOVEMENTS':
    {
      return {
        ...state,
        inventoryMovementActive: inventoryMovementModel
      }
    } // case

  } // switch

  return state // default return

} // reducer
