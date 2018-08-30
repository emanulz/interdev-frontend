const defaultPermissions = {
  add: 'unfetched',
  change: 'unfetched',
  list: 'unfetched',
  delete: 'unfetched'
}

const stateConst = {
  etickets: [],
  loadedticket: {},
  permissions: defaultPermissions
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'FETCH_USER_ETICKET_PERMISSIONS_FULLFILLED':
    {
      return {
        ...state,
        permissions: action.payload
      }
    } // case

    case 'FETCH_USER_ETICKET_PERMISSIONS_REJECTED':
    {
      return {
        ...state,
        permissions: defaultPermissions
      }
    } // case

    case 'FETCH_ETICKETS_FULFILLED':
    {
      return {
        ...state,
        etickets: action.payload
      }

    } // case

    case 'FETCH_ETICKETS_REJECTED':
    {
      return {
        ...state,
        etickets: []
      }
    } // case

    case 'SET_ETICKET':
    {
      return {
        ...state,
        loadedInvoice: action.payload
      }
    }

    case 'SET_ETICKET_FILE':
    {
      return {
        ...state,
        ticketToUpload: action.payload
      }
    }

    case 'CLEAR_ETICKET':
    {
      return {
        ...state,
        tickets: [],
        loadedInvoice: {}
      }
    }

  } // switch

  return state // default return

} // reducer
