const clientModel = {
  cellphone_number: '',
  code: '',
  email: '',
  has_credit: false,
  id_num: '',
  last_name: '',
  name: '',
  phone_number: ''
}

const stateConst = {
  isVisible: false,
  clientActive: clientModel,
  autoCode: true
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

  } // switch

  return state // default return

} // reducer
