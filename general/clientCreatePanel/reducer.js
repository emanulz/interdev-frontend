const clientModel = {
  cellphone_number: '',
  code: '',
  email: '',
  has_credit: false,
  id_type: '01',
  id_num: '',
  last_name: '',
  name: '',
  phone_number: '',
  province: '',
  canton: '',
  district: '',
  town: '',
  other_address: ''
}

const stateConst = {
  isVisible: false,
  clientActive: clientModel,
  autoCode: true,
  provinces: [],
  cantons: [],
  districts: [],
  towns: []
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'SHOW_CREATE_CLIENT_PANEL':
    {
      return {
        ...state,
        isVisible: true
      }
    } // case

    case 'HIDE_CREATE_CLIENT_PANEL':
    {
      return {
        ...state,
        isVisible: false
      }
    } // case

    case 'SET_CREATE_CLIENT':
    {
      return {
        ...state,
        clientActive: action.payload
      }
    }

    case 'SET_CREATE_CLIENT_AUTO_CODE':
    {
      return {
        ...state,
        autoCode: action.payload
      }
    }

    case 'CLEAR_CREATE_CLIENT':
    {
      return {
        ...state,
        clientActive: clientModel,
        autoCode: true
      }
    }

    case 'FETCH_PROVINCES_FULFILLED':
    {
      return {
        ...state,
        provinces: action.payload
      }
    }

    case 'FETCH_PROVINCES_REJECTED':
    {
      return {
        ...state,
        provinces: []
      }
    }

    case 'FETCH_CANTONS_FULFILLED':
    {
      return {
        ...state,
        cantons: action.payload
      }
    }

    case 'FETCH_CANTONS_REJECTED':
    {
      return {
        ...state,
        cantons: []
      }
    }

    case 'FETCH_DISTRICTS_FULFILLED':
    {
      return {
        ...state,
        districts: action.payload
      }
    }

    case 'FETCH_DISTRICTS_REJECTED':
    {
      return {
        ...state,
        districts: []
      }
    }

    case 'FETCH_TOWNS_FULFILLED':
    {
      return {
        ...state,
        towns: action.payload
      }
    }

    case 'FETCH_TOWNS_REJECTED':
    {
      return {
        ...state,
        towns: []
      }
    }

    case 'CLEAR_CANTON':
    {
      const client = state.clientActive
      client.canton = ''
      return {
        ...state,
        clientActive: client
      }
    } // case

    case 'CLEAR_DISTRICT':
    {
      const client = state.clientActive
      client.district = ''
      return {
        ...state,
        clientActive: client
      }
    } // case

    case 'CLEAR_TOWN':
    {
      const client = state.clientActive
      client.town = ''
      return {
        ...state,
        clientActive: client
      }
    } // case

  } // switch

  return state // default return

} // reducer
