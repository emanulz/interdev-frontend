const defaultPermissions = {
  add: 'unfetched',
  change: 'unfetched',
  list: 'unfetched',
  delete: 'unfetched'
}

const warehouseModel = {
  id: '0000000000',
  code: '',
  name: '',
  location: '',
  description: ''
}

const stateConst = {
  warehouses: [],
  warehouseActive: warehouseModel,
  warehouseActiveOld: warehouseModel,
  nextWarehouse: 0,
  previousWarehouse: 0,
  permissions: defaultPermissions
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'FETCH_USER_WAREHOUSE_PERMISSIONS_FULLFILLED':
    {
      return {
        ...state,
        permissions: action.payload
      }
    } // case

    case 'FETCH_USER_WAREHOUSE_PERMISSIONS_REJECTED':
    {
      return {
        ...state,
        permissions: defaultPermissions
      }
    } // case

    case 'SET_NEXT_PREV_WAREHOUSE':
    {
      return {
        ...state,
        nextWarehouse: action.payload.next,
        previousWarehouse: action.payload.previous
      }
    } // case

    case 'CLEAR_NEXT_PREV_WAREHOUSE':
    {
      return {
        ...state,
        nextWarehouse: 0,
        previousWarehouse: 0
      }
    } // case

    case 'FETCH_WAREHOUSES_FULFILLED':
    {
      return {
        ...state,
        warehouses: action.payload
      }

    } // case

    case 'FETCH_WAREHOUSES_REJECTED':
    {
      return {
        ...state,
        warehouses: []
      }
    } // case

    case 'SET_WAREHOUSE':
    {
      return {
        ...state,
        warehouseActive: action.payload
      }
    }

    case 'SET_WAREHOUSE_OLD':
    {
      return {
        ...state,
        warehouseActiveOld: action.payload
      }
    }

    case 'CLEAR_WAREHOUSES':
    {
      return {
        ...state,
        warehouseActive: warehouseModel,
        warehouseActiveOld: warehouseModel
      }
    }

  } // switch

  return state // default return

} // reducer
