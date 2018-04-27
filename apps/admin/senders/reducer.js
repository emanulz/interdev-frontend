const defaultPermissions = {
  add: 'unfetched',
  change: 'unfetched',
  list: 'unfetched',
  delete: 'unfetched'
}

const senderModel = {
  id: '0000000000',
  id_number: '',
  name: '',
  commercial_name: '',
  phone_country_code: '',
  phone_number: '',
  fax_number: '',
  fax_country_code: '',
  province: '',
  canton: '',
  district: '',
  town: '',
  other_address: '',
  email: '',
  key: '',
  pin: '',
  user: '',
  password: ''
}

const stateConst = {
  senders: [],
  senderActive: senderModel,
  senderActiveOld: senderModel,
  nextClient: 0,
  previousClient: 0,
  permissions: defaultPermissions
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'CLEAR_CANTON':
    {
      const sender = state.senderActive
      sender.canton = ''
      return {
        ...state,
        senderActive: sender
      }
    } // case

    case 'CLEAR_DISTRICT':
    {
      const sender = state.senderActive
      sender.district = ''
      return {
        ...state,
        senderActive: sender
      }
    } // case

    case 'CLEAR_TOWN':
    {
      const sender = state.senderActive
      sender.town = ''
      return {
        ...state,
        senderActive: sender
      }
    } // case

    case 'FETCH_USER_SENDER_PERMISSIONS_FULLFILLED':
    {
      return {
        ...state,
        permissions: action.payload
      }
    } // case

    case 'FETCH_USER_SENDER_PERMISSIONS_REJECTED':
    {
      return {
        ...state,
        permissions: defaultPermissions
      }
    } // case

    case 'SET_NEXT_PREV_SENDER':
    {
      return {
        ...state,
        nextClient: action.payload.next,
        previousClient: action.payload.previous
      }
    } // case

    case 'CLEAR_NEXT_PREV_SENDER':
    {
      return {
        ...state,
        nextClient: 0,
        previousClient: 0
      }
    } // case

    case 'FETCH_SENDERS_FULFILLED':
    {
      return {
        ...state,
        senders: action.payload
      }

    } // case

    case 'FETCH_SENDERS_REJECTED':
    {
      return {
        ...state,
        senders: []
      }
    } // case

    case 'SET_SENDER':
    {
      return {
        ...state,
        senderActive: action.payload
      }
    }

    case 'SET_SENDER_OLD':
    {
      return {
        ...state,
        senderActiveOld: action.payload
      }
    }

    case 'CLEAR_SENDER':
    {
      return {
        ...state,
        senderActive: senderModel,
        senderActiveOld: senderModel
      }
    }

  } // switch

  return state // default return

} // reducer
