const clientModel = {
  cellphone_number: '',
  code: '',
  email: '',
  has_credit: false,
  credit_limit: 0,
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
  clientActive: clientModel
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'SHOW_UPDATE_CLIENT_PANEL':
    {
      return {
        ...state,
        isVisible: true
      }
    } // case

    case 'HIDE_UPDATE_CLIENT_PANEL':
    {
      return {
        ...state,
        isVisible: false
      }
    } // case

    case 'SET_UPDATE_CLIENT':
    {
      return {
        ...state,
        clientActive: action.payload
      }
    }

    case 'CLEAR_UPDATE_CLIENT':
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
