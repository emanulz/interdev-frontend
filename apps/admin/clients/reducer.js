const defaultPermissions = {
  add: 'unfetched',
  change: 'unfetched',
  list: 'unfetched',
  delete: 'unfetched'
}

const clientModel = {
  id: '0000000000',
  province: '',
  canton: '',
  district: '',
  town: '',
  other_address: '',
  cellphone_number: '',
  category_id: '',
  code: '',
  credit_days: 30,
  credit_limit: 0,
  email: '',
  has_credit: false,
  id_num: '',
  id_type: '01',
  last_name: '',
  max_discount: 0,
  name: '',
  observations: '',
  pays_taxes: true,
  phone_number: '',
  pred_discount: 0,
  pred_price_list: 1,
  locals: []
}

const clientLocalModel = {
  id: '0000000000',
  province: '',
  canton: '',
  district: '',
  town: '',
  other_address: '',
  phone_number: '',
  cellphone_number: '',
  email: '',
  commercial_name: ''
}

const clientProdModel = {
  id: '0000',
  client_id: '0000',
  product_id: '0000',
  product_code: '-1',
  product_description: 'Producto no seleccionado',
  table_price: 0,
  discount_percent: 0,
  by_price: false,
  is_edit: true,
  created: '',
  updated: ''
}

const stateConst = {
  clients: [],
  clientActive: clientModel,
  clientActiveOld: clientModel,
  clientLocalActive: clientLocalModel,
  clientLocalActiveOld: clientLocalModel,
  nextClient: 0,
  previousClient: 0,
  permissions: defaultPermissions,
  clientProds: [],
  selected_prod: '',
  clientProdFormVisible: false,
  activeClientProd: clientProdModel,
  requires_refetch: false,
  is_adding_local: false,
  is_updating_local: false

}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'FLAG_REFRESH_CLIENT_PROD':
    {
      return {
        ...state,
        requires_refetch: true
      }
    }

    case 'CLIENT_PRODUCT_CREATE':
    {
      const new_client_prod = JSON.parse(JSON.stringify(clientProdModel))
      new_client_prod.product_id = action.payload.product.id
      new_client_prod.product_description = action.payload.product.description
      new_client_prod.product_code = action.payload.product.code
      new_client_prod.is_edit = false

      return {
        ...state,
        clientProdFormVisible: true,
        activeClientProd: new_client_prod

      }
    }

    case 'HIDE_CLIENT_PRODUCT_EDIT':
    {
      return {
        ...state,
        clientProdFormVisible: false
      }
    }

    case 'SET_ACTIVE_CLIENTPROD':
    {
      return {
        ...state,
        activeClientProd: action.payload
      }
    }

    case 'CLIENT_PRODUCT_EDIT':
    {
      // find the clientproduct line from the clientProds using the
      // received code
      const prod = state.clientProds.find((prod)=>{
        if (prod.product_code == action.payload) {
          return prod
        }
      })
      prod.is_edit = true

      return {
        ...state,
        activeClientProd: prod,
        clientProdFormVisible: true
      }
    }

    case 'CLEAR_CANTON':
    {
      const client = state.clientActive
      client.canton = ''
      const clientLocal = state.clientLocalActive
      clientLocal.canton = ''
      return {
        ...state,
        clientActive: client,
        clientLocalActive: clientLocal
      }
    } // case

    case 'CLEAR_DISTRICT':
    {
      const client = state.clientActive
      client.district = ''
      const clientLocal = state.clientLocalActive
      clientLocal.district = ''
      return {
        ...state,
        clientActive: client,
        clientLocalActive: clientLocal
      }
    } // case

    case 'CLEAR_TOWN':
    {
      const client = state.clientActive
      client.town = ''
      const clientLocal = state.clientLocalActive
      clientLocal.town = ''
      return {
        ...state,
        clientActive: client,
        clientLocalActive: clientLocal
      }
    } // case

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

    case 'FETCH_CLIENT_PRODS_FULFILLED':
    {
      return {
        ...state,
        clientProds: action.payload,
        requires_refetch: false

      }
    }
    case 'FETCH_CLIENT_PRODS_REJECTED':
    {
      return {
        ...state,
        clientProds: []
      }
    }
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
      if (!action.payload.locals) {
        action.payload.locals = []
      }
      return {
        ...state,
        clientActive: action.payload
      }
    }

    case 'SET_CLIENT_OLD':
    {
      if (!action.payload.locals) {
        action.payload.locals = []
      }
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

    case 'SET_CLIENT_LOCALS':
    {
      return {
        ...state,
        clientLocals: action.payload
      }
    }

    case 'CLEAR_CLIENT_LOCALS':
    {
      return {
        ...state,
        clientLocals: []
      }
    }

    case 'SET_CLIENT_LOCAL':
    {
      return {
        ...state,
        clientLocalActive: action.payload
      }
    }

    case 'SET_CLIENT_LOCAL_OLD':
    {
      return {
        ...state,
        clientLocalActiveOld: action.payload
      }
    }

    case 'CLEAR_CLIENT_LOCAL':
    {
      return {
        ...state,
        clientLocalActive: clientLocalModel,
        clientLocalActiveOld: clientLocalModel
      }
    }

    case 'SET_CLIENT_LOCAL_ADDING':
    {
      return {
        ...state,
        is_adding_local: true,
        is_updating_local: false
      }
    }

    case 'SET_CLIENT_LOCAL_UPDATING':
    {
      return {
        ...state,
        is_adding_local: false,
        is_updating_local: true
      }
    }
    case 'CLEAR_CLIENT_LOCAL_ADDING_UPDATING':
    {
      return {
        ...state,
        clientLocalActive: clientLocalModel,
        clientLocalActiveOld: clientLocalModel,
        is_adding_local: false,
        is_updating_local: false
      }
    }
    case 'CLEAR_CLIENT_LOCAL_DELETING':
    {
      return {
        ...state,
        clientLocalActive: clientLocalModel,
        clientLocalActiveOld: clientLocalModel,
        is_adding_local: false,
        is_updating_local: false
      }
    }
  } // switch

  return state // default return

} // reducer
