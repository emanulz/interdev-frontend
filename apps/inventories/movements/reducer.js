const inventoryMovementModel = {
  movement_type: '',
  user: '',
  amount: '',
  product: '',
  product_id: '',
  description: '',
  warehouse: '',
  warehouse_id: '',
  toWarehouse_id: '',
  fromWarehouse_id: ''
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

    case 'CLEAR_INVENTORY_MOVEMENT':
    {
      return {
        ...state,
        inventoryMovementActive: inventoryMovementModel
      }
    } // case

    case 'SET_PRODUCT':
    {
      const movement = state.inventoryMovementActive
      movement['product'] = action.payload
      movement['product_id'] = action.payload.id

      return {
        ...state,
        inventoryMovementActive: movement
      }
    } // case

    case 'CLEAR_PRODUCT':
    {
      return {
        ...state,
        product: '',
        product_id: ''
      }
    } // case

  } // switch

  return state // default return

} // reducer
