
const permissionsModel = {
  general: {
    access_administration: false
  },
  products: {
    list: false,
    add: false,
    change: false,
    delete: false
  },
  clients: {
    list: false,
    add: false,
    change: false,
    delete: false
  },
  users: {
    list: false,
    add: false,
    change: false,
    delete: false
  },
  suppliers: {
    list: false,
    add: false,
    change: false,
    delete: false
  },
  presales: {
    list: false,
    add: false,
    change: false,
    delete: false
  },
  sales: {
    list: false,
    add: false,
    change: false,
    delete: false
  },
  access: {
    access_administration: false,
    access_sales: false,
    access_presales: false,
    access_inventories: false,
    access_workshop: false
  },
  work_orders: {
    list: false,
    add: false,
    change: false,
    delete: false
  },
  cash_advances: {
    list: false,
    add: false,
    change: false,
    delete: false
  },
  credit_vouchers: {
    list: false,
    add: false,
    change: false,
    delete: false
  }
}

const stateConst = {
  permissions: [],
  permissionsActive: permissionsModel,
  permissionsActiveOld: permissionsModel,
  userFilter: ''
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'SET_USER_FILTER':
    {
      return {
        ...state,
        userFilter: action.payload
      }
    } // case

    case 'FETCH_PERMISSIONS_FULLFILLED':
    {
      return {
        ...state,
        permissions: action.payload
      }
    } // case

    case 'FETCH_PERMISSIONS_REJECTED':
    {
      return {
        ...state,
        permissions: []
      }
    } // case

    case 'SET_PERMISSION':
    {
      const model = action.payload.model
      const permission = action.payload.permission
      return {
        ...state,
        permissionsActive: {
          ...state.permissionsActive,
          [model]: {
            ...state.permissionsActive[model],
            [permission]: action.payload.permissionValue
          }
        }
      }
    }

    case 'SET_PERMISSIONS':
    {
      const model = action.payload.model
      return {
        ...state,
        permissionsActive: {
          ...state.permissionsActive,
          [model]: action.payload.permissions
        }
      }
    }

    case 'SET_PERMISSIONS_OLD':
    {
      return {
        ...state,
        permissionsActiveOld: action.payload
      }
    }

    case 'CLEAR_PERMISSIONS':
    {
      return {
        ...state,
        permissionsActive: permissionsModel,
        permissionsActiveOld: permissionsModel
      }
    }

  } // switch

  return state // default return

} // reducer
