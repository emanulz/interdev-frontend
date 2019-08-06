const defaultPermissions = {
  add: 'unfetched',
  change: 'unfetched',
  list: 'unfetched',
  delete: 'unfetched'
}

const stateConst = {
  selfpurchases: [],
  loadedSelfPurchase: {},
  permissions: defaultPermissions
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'FETCH_USER_SELFPURCHASE_PERMISSIONS_FULLFILLED':
    {
      return {
        ...state,
        permissions: action.payload
      }
    } // case

    case 'FETCH_USER_SELFPURCHASE_PERMISSIONS_REJECTED':
    {
      return {
        ...state,
        permissions: defaultPermissions
      }
    } // case

    case 'FETCH_SELFPURCHASES_FULFILLED':
    {
      return {
        ...state,
        selfpurchases: action.payload
      }

    } // case

    case 'FETCH_SELFPURCHASES_REJECTED':
    {
      return {
        ...state,
        selfpurchases: []
      }
    } // case

    case 'SET_SELFPURCHASE':
    {
      return {
        ...state,
        loadedSelfPurchase: action.payload
      }
    }

    case 'CLEAR_SELFPURCHASE':
    {
      return {
        ...state,
        selfPurchases: [],
        loadedSelfPurchase: {}
      }
    }

  } // switch

  return state // default return

} // reducer
