const defaultPermissions = {
  add: 'unfetched',
  change: 'unfetched',
  list: 'unfetched',
  delete: 'unfetched'
}

const stateConst = {
  epurchases: [],
  loadedPurchase: {},
  purchaseToUpload: '',
  permissions: defaultPermissions,
  epurchaseType: 'PURCHASE'
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'SET_EPURCHASE_TYPE':
    {
      return {
        ...state,
        epurchaseType: action.payload
      }
    } // case

    case 'FETCH_USER_EPURCHASE_PERMISSIONS_FULLFILLED':
    {
      return {
        ...state,
        permissions: action.payload
      }
    } // case

    case 'FETCH_USER_EPURCHASE_PERMISSIONS_REJECTED':
    {
      return {
        ...state,
        permissions: defaultPermissions
      }
    } // case

    case 'FETCH_EPURCHASES_FULFILLED':
    {
      return {
        ...state,
        epurchases: action.payload
      }

    } // case

    case 'FETCH_EPURCHASES_REJECTED':
    {
      return {
        ...state,
        epurchases: []
      }
    } // case

    case 'SET_EPURCHASE':
    {
      return {
        ...state,
        loadedPurchase: action.payload
      }
    }

    case 'SET_EPURCHASE_FILE':
    {
      return {
        ...state,
        purchaseToUpload: action.payload
      }
    }

    case 'CLEAR_EPURCHASE':
    {
      return {
        ...state,
        purchases: [],
        loadedPurchase: {}
      }
    }

  } // switch

  return state // default return

} // reducer
