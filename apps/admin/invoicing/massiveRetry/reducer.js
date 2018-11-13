const defaultPermissions = {
  add: 'unfetched',
  change: 'unfetched',
  list: 'unfetched',
  delete: 'unfetched'
}

const stateConst = {
  retryStatus: '0',
  amount: '',
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
        retryStatus: '0',
        retryDocType: '1',
        amount: ''
      }
    }

  } // switch

  return state // default return

} // reducer
