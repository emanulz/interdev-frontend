const defaultPermissions = {
  add: 'unfetched',
  change: 'unfetched',
  list: 'unfetched',
  delete: 'unfetched'
}

const supplierModel = {
  id: '0000000000',
  code: '',
  name: '',
  id_type: 'PER',
  id_num: '',
  address: '',
  phone_number: '',
  cellphone_number: '',
  email: '',
  agent_name: '',
  agent_last_name: '',
  agent_phone_number: '',
  agent_email: '',
  bank_accounts: '',
  sinpe_accounts: '',
  observations: ''
}

const stateConst = {
  suppliers: [],
  supplierActive: supplierModel,
  supplierActiveOld: supplierModel,
  nextSupplier: 0,
  previousSupplier: 0,
  permissions: defaultPermissions
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'FETCH_USER_SUPPLIER_PERMISSIONS_FULLFILLED':
    {
      return {
        ...state,
        permissions: action.payload
      }
    } // case

    case 'FETCH_USER_SUPPLIER_PERMISSIONS_REJECTED':
    {
      return {
        ...state,
        permissions: defaultPermissions
      }
    } // case

    case 'SET_NEXT_PREV_SUPPLIER':
    {
      return {
        ...state,
        nextSupplier: action.payload.next,
        previousSupplier: action.payload.previous
      }
    } // case

    case 'CLEAR_NEXT_PREV_SUPPLIER':
    {
      return {
        ...state,
        nextSupplier: 0,
        previousSupplier: 0
      }
    } // case

    case 'FETCH_SUPPLIERS_FULFILLED':
    {
      return {
        ...state,
        suppliers: action.payload
      }

    } // case

    case 'FETCH_SUPPLIERS_REJECTED':
    {
      return {
        ...state,
        suppliers: []
      }
    } // case

    case 'SET_SUPPLIER':
    {
      return {
        ...state,
        supplierActive: action.payload
      }
    }

    case 'SET_SUPPLIER_OLD':
    {
      return {
        ...state,
        supplierActiveOld: action.payload
      }
    }

    case 'CLEAR_SUPPLIER':
    {
      return {
        ...state,
        supplierActive: supplierModel,
        supplierActiveOld: supplierModel
      }
    }

  } // switch

  return state // default return

} // reducer
