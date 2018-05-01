const clientModel = {
  id: '0000000000',
  province: '',
  canton: '',
  district: '',
  town: '',
  other_address: '',
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
  pred_discount: 0,
  debt: 0
}

const stateConst = {
  clients: [],
  clientActive: clientModel,
  clientActiveOld: clientModel
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

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
