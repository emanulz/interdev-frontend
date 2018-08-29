const defaultPermissions = {
  add: 'unfetched',
  change: 'unfetched',
  list: 'unfetched',
  delete: 'unfetched'
}

const stateConst = {
  invoices: [],
  loadedinvoice: {},
  permissions: defaultPermissions
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'FETCH_USER_EINVOICE_PERMISSIONS_FULLFILLED':
    {
      return {
        ...state,
        permissions: action.payload
      }
    } // case

    case 'FETCH_USER_EINVOICE_PERMISSIONS_REJECTED':
    {
      return {
        ...state,
        permissions: defaultPermissions
      }
    } // case

    case 'FETCH_EINVOICES_FULFILLED':
    {
      return {
        ...state,
        einvoices: action.payload
      }

    } // case

    case 'FETCH_EINVOICES_REJECTED':
    {
      return {
        ...state,
        einvoices: []
      }
    } // case

    case 'SET_EINVOICE':
    {
      return {
        ...state,
        loadedInvoice: action.payload
      }
    }

    case 'SET_EINVOICE_FILE':
    {
      return {
        ...state,
        invoiceToUpload: action.payload
      }
    }

    case 'CLEAR_EINVOICE':
    {
      return {
        ...state,
        invoices: [],
        loadedInvoice: {}
      }
    }

  } // switch

  return state // default return

} // reducer
