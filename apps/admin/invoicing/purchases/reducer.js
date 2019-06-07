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
  epurchaseType: 'PURCHASE',
  token: "",
  //extra states for multi upload
  multi_accept_files: ''

}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    //multi accept cases
    case 'SET_DOCUMENTS_SELECTED':
    {
      return {
        ...state,
        multi_accept_files: action.payload
      }
    }


    case 'SET_EPURCHASE_TOKEN':
    {
      return {
        ...state,
        token: action.payload
      }
    } 

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
