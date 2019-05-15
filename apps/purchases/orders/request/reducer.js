const defaultPermissions = {
  add: 'unfetched',
  change: 'unfetched',
  list: 'unfetched',
  delete: 'unfetched'
}

const requestModel = {
  id: '0000000000',
  name: '',
  description: '',
  is_active: true
}

const stateConst = {
  requests: [],
  requestActive: requestModel,
  requestActiveOld: requestModel,
  nextRequest: 0,
  previousRequest: 0,
  permissions: defaultPermissions
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'FETCH_USER_REQUEST_PERMISSIONS_FULLFILLED':
    {
      return {
        ...state,
        permissions: action.payload
      }
    } // case

    case 'FETCH_USER_REQUEST_PERMISSIONS_REJECTED':
    {
      return {
        ...state,
        permissions: defaultPermissions
      }
    } // case

    case 'SET_NEXT_PREV_REQUEST':
    {
      return {
        ...state,
        nextRequest: action.payload.next,
        previousRequest: action.payload.previous
      }
    } // case

    case 'CLEAR_NEXT_PREV_REQUEST':
    {
      return {
        ...state,
        nextRequest: 0,
        previousRequest: 0
      }
    } // case

    case 'FETCH_REQUESTS_FULFILLED':
    {
      return {
        ...state,
        requests: action.payload
      }

    } // case

    case 'FETCH_REQUESTS_REJECTED':
    {
      return {
        ...state,
        requests: []
      }
    } // case

    case 'SET_REQUEST':
    {
      return {
        ...state,
        requestActive: action.payload
      }
    }

    case 'SET_REQUEST_OLD':
    {
      return {
        ...state,
        requestActiveOld: action.payload
      }
    }

    case 'CLEAR_REQUEST':
    {
      return {
        ...state,
        requestActive: requestModel,
        requestActiveOld: requestModel
      }
    }

  } // switch

  return state // default return

} // reducer
