const clientSelectedModel = {
  client: {
    code: '0000',
    clientType: 'GENERAL',
    created: '',
    credit_days: 0,
    credit_limit: 0,
    docType: 'CLIENT',
    has_credit: false,
    id: '000000000',
    last_name: 'Contado',
    name: 'Cliente',
    updated: '',
    saleLoaded: false,
    locals: []
  }
}

const userSelectedModel = {
  user: '0000',
  name: '',
  last_name: '',
  id: '0000',
  _id: 0
}

const stateConst = {
  clientsFetching: false,
  clientsFected: false,
  clientsFetchError: '',
  clients: [],
  users: [],
  clientSelected: clientSelectedModel,
  userSelected: userSelectedModel,
  clientSelectedDebt: 0,
  clientLocalSelected: null
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'CLEAR_ALL':
    {
      return {
        ...state,
        clientSelected: clientSelectedModel,
        userSelected: userSelectedModel
      }
    }

    case 'FETCH_CLIENTS':
    {
      return {
        ...state,
        clientsFetching: true
      }
    } // case

    case 'FETCH_CLIENTS_REJECTED':
    {
      return {
        ...state,
        clientsFetching: false,
        clientsFetchError: action.payload
      }
    } // case

    case 'FETCH_CLIENTS_FULFILLED':
    {
      return {
        ...state,
        clientsFetching: false,
        clientsFected: true,
        clients: action.payload
      }
    } // case
    case 'CLIENT_SIC_DATA_FETCHED':
    {
      if(!action.payload || action.payload === 'NOT-FOUND'){
        return {
          ...state
        }
      }
      if(!action.payload.client){
        return {
          ...state
        }
      }
      if(action.payload.client.code){
        return {
          ...state,
          clientSelected: action.payload
        }
      }

      break
    }
    case 'CLIENT_SELECTED':
    {
      if (!action.payload.client.locals) {
        action.payload.client.locals = []
      }
      return {
        ...state,
        clientSelected: action.payload
      }
    } // case

    // ******** USERS ********
    case 'FETCH_USERS_REJECTED':
    {
      return {
        ...state,
        userSelected: userSelectedModel
      }
    } // case

    case 'FETCH_USERS_FULFILLED':
    {
      return {
        ...state,
        users: action.payload
      }
    } // case

    case 'USER_SELECTED':
    {
      return {
        ...state,
        userSelected: action.payload.user
      }
    } // case

    case 'USER_CLEAR':
    {
      return {
        ...state,
        userSelected: userSelectedModel
      }
    } // case

    // ******** USERS ********

    case 'SET_CLIENT_DEBT':
    {
      return {
        ...state,
        clientSelectedDebt: Math.abs(parseFloat(action.payload))
      }
    }

    case 'NEW_SALE':
    {
      const clients = state.clients
      state = stateConst
      return {
        ...state, clients: clients
      }
    } // case

    case 'LOADED_SALE':
    {
      return {
        ...state,
        clientSelected: action.payload.client,
        userSelected: action.payload.user
      }
    }

    case 'LOADED_PRESALE':
    {
      return {
        ...state,
        clientSelected: action.payload.client
      }
    }

    case 'LOADED_PROFORMA':
    {
      return {
        ...state,
        clientSelected: action.payload.client
      }
    }

    case 'LOADED_TRUE':
    {
      const client = state.clientSelected
      client.saleLoaded = true
      return {
        ...state,
        clientSelected: client
      }
    }

    case 'LOADED_FALSE':
    {
      const client = state.clientSelected
      client.saleLoaded = false
      return {
        ...state,
        clientSelected: client
      }
    }

    case 'SET_CLIENT_LOCAL_TO_USE':
    {
      return {
        ...state,
        clientLocalSelected: action.payload
      }
    }

    case 'CLEAR_CLIENT_LOCAL_TO_USE':
    {
      return {
        ...state,
        clientLocalSelected: null
      }
    }

  } // switch

  return state // default return

} // reducer
