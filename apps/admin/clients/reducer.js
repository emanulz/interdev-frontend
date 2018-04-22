const defaultPermissions = {
  add: 'unfetched',
  change: 'unfetched',
  list: 'unfetched',
  delete: 'unfetched'
}

const clientModel = {
  id: '0000000000',
  address: '',
  cellphone_number: '',
  client_type: 'GENERAL',
  code: '',
  credit_days: 30,
  credit_limit: 0,
  email: '',
  has_credit: false,
  id_num: '',
  id_type: 'PER',
  last_name: '',
  max_discount: 0,
  max_line_discount: 0,
  name: '',
  observations: '',
  pays_taxes: true,
  phone_number: '',
  pred_discount: 0
}

const stateConst = {
  clients: [],
  clientActive: clientModel,
  clientActiveOld: clientModel,
  nextClient: 0,
  previousClient: 0,
  permissions: defaultPermissions
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'FETCH_USER_CLIENT_PERMISSIONS_FULLFILLED':
    {
      return {
        ...state,
        permissions: action.payload
      }
    } // case

    case 'FETCH_USER_CLIENT_PERMISSIONS_REJECTED':
    {
      return {
        ...state,
        permissions: defaultPermissions
      }
    } // case

    case 'SET_NEXT_PREV_CLIENT':
    {
      return {
        ...state,
        nextClient: action.payload.next,
        previousClient: action.payload.previous
      }
    } // case

    case 'CLEAR_NEXT_PREV_CLIENT':
    {
      return {
        ...state,
        nextClient: 0,
        previousClient: 0
      }
    } // case

    case 'FETCH_CLIENTS_FULFILLED':
    {
      return {
        ...state,
        clients: action.payload
      }

    } // case

    case 'FETCH_CLIENTS_REJECTED':
    {
      return {
        ...state,
        clients: []
      }
    } // case

    case 'SET_CLIENT':
    {
      return {
        ...state,
        clientActive: action.payload
      }
    }

    case 'SET_CLIENT_OLD':
    {
      return {
        ...state,
        clientActiveOld: action.payload
      }
    }

    case 'CLEAR_CLIENT':
    {
      return {
        ...state,
        clientActive: clientModel,
        clientActiveOld: clientModel
      }
    }

  } // switch

  return state // default return

} // reducer
