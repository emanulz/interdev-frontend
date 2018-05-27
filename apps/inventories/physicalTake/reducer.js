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
  inventoryMovementActive: inventoryMovementModel,
  fullWidth: false
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'TOGGLE_FULL_WIDTH_PHYSICAL':
    {
      const width = !state.fullWidth
      return {
        ...state,
        fullWidth: width
      }
    } // case

    case 'ADD_TO_TAKE_ARRAY':
    {
      const obj = {...state.takeObj}
      obj[action.payload.id] = action.payload.object
      return {
        ...state,
        takeObj: obj
      }
    } // case

  } // switch

  return state // default return

} // reducer
