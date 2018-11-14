const defaultPermissions = {
  add: 'unfetched',
  change: 'unfetched',
  list: 'unfetched',
  delete: 'unfetched'
}

const stateConst = {
  retryStatus: '2',
  amount: "25",
  retryDocType: '1'
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'FETCH_USER_MASSIVE_RETRY_PERMISSIONS_FULLFILLED':
    {
      return {
        ...state,
        permissions: action.payload
      }
    } // case

    case 'FETCH_USER_MASSIVE_RETRY_PERMISSIONS_REJECTED':
    {
      return {
        ...state,
        permissions: defaultPermissions
      }
    } // case

    case 'SET_MASSIVE_RETRY_STATUS':
    {
      
      return {
        ...state,
        retryStatus: action.payload
      }
    }

    case 'SET_MASSIVE_RETRY_DOC_TYPE':
    {
      console.log("Grrr -> ", action.payload)
      return {
        ...state,
        retryDocType: action.payload
      }
    }

    case 'SET_MASSIVE_RETRY_AMOUNT':
    {
      return {
        ...state,
        amount: action.payload
      }
    }

    case 'CLEAR_MASSIVE_RETRY':
    {
      return {
        ...state,
        retryStatus: stateConst.retryStatus,
        retryDocType: stateConst.retryDocType,
        amount: stateConst.amount
      }
    }

  } // switch

  return state // default return

} // reducer
