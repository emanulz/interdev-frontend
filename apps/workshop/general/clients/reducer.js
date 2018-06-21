const clientSelectedModel = {
  code: '0000',
  id: '000000000',
  last_name: 'Contado',
  name: 'Cliente',
  phone_number : '',
  cellphone_number: '',
  email: ''
}

const userSelectedModel = {
  user: '0000',
  name: '',
  last_name: '',
  id: '0000',
}

const stateConst = {
  clientsFetching: false,
  clientsFected: false,
  clientsFetchError: '',
  clients: [],
  users: [],
  clientSelected: clientSelectedModel,
  userSelected: userSelectedModel,
  client_disabled: false,
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'WORK_ORDER_CREATED':
    {
      const client = JSON.parse(action.payload.work_order.client)
      return {
        ...state,
        clientSelected: client,
        disabled: true,
      }
    }

    case 'WORK_ORDER_EDIT_LOADED':
    {
      const client = JSON.parse(action.payload.client)
      return {
        ...state,
        clientSelected: client,
      }
    }
    case 'CLEAR_WORK_ORDER':
    {
      return {
        ...state,
        clientSelected: clientSelectedModel,
        userSelected: userSelectedModel
      }
    }
    case 'CLEAR_ALL':
    {
      return {
        ...state,
        clientSelected: clientSelectedModel,
        userSelected: userSelectedModel
      }
    }

    case 'FETCH_CLIENT_REJECTED':
    {
      return {
        ...state,
        clientsFetching: false,
        clientsFetchError: action.payload
      }
    } // case
    case 'CLIENT_SELECTED':
    {
      if(action.payload.code ==="00"){
        alertify.alert('CLIENTE GENERAL EN GARANTÍA NO PERMITIDO!', 'Una garantía no puede estar asociada con un cliente general')
        break
      }
      return {
        ...state,
        clientSelected: action.payload
      }
    }
    case 'CLIENT_SELECTED_LIST':
    {
      return {
        ...state,
        clientSelected: action.payload[0]
      }
    } // case

    case 'CLIENT_UNSELECT':
    {
      return {
        ...state,
        clientSelected: clientSelectedModel
      }
    }

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
        clientSelectedDebt: parseFloat(action.payload.debt)
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

  } // switch

  return state // default return

} // reducer
