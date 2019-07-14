const stateConst = {
  isVisible: false,
  user: {},
  profile: {},
  userCode: '',
  userPin: '',
  presale_type: 'REGULAR',
  advance_amount: '',
  pay_method: 'CASH'
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'SET_ADVANCE_AMOUNT':
    {
      return {
        ...state,
        advance_amount: action.payload
      }
    } // case

    case 'CLEAR_ADVANCE_AMOUNT':
    {
      return {
        ...state,
        advance_amount: ''
      }
    } // case

    case 'SHOW_SEND_PANEL':
    {
      return {
        ...state,
        isVisible: true
      }
    } // case

    case 'HIDE_SEND_PANEL':
    {
      return {
        ...state,
        isVisible: false
      }
    } // case

    case 'SET_SEND_USER_CODE':
    {
      return {
        ...state,
        userCode: action.payload
      }
    } // case

    case 'SET_SEND_USER_PIN':
    {
      return {
        ...state,
        userPin: action.payload
      }
    } // case

    case 'SET_SEND_USER':
    {
      return {
        ...state,
        user: action.payload
      }
    } // case

    case 'SET_SEND_USER_PROFILE':
    {
      return {
        ...state,
        profile: action.payload
      }
    } // case

    case 'CLEAR_SEND_USER':
    {
      return {
        ...state,
        userCode: '',
        userPin: '',
        user: {},
        profile: {}
      }
    } // case

    case 'CLEAR_SEND_USER_INPUTS':
    {
      return {
        ...state,
        userCode: '',
        userPin: ''
      }
    } // case

    case 'SET_PRESALE_TYPE':
    {
      return {
        ...state,
        presale_type: action.payload
      }
    } // case

    case 'SET_SEND_PAY_METHOD':
    {
      return {
        ...state,
        pay_method: action.payload
      }
    } // case

  } // switch

  return state // default return

} // reducer
