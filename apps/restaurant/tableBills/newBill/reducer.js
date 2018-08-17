const stateConst = {
  isVisible: false,
  user: {},
  profile: {},
  userCode: '',
  userPin: '',
  presale_type: 'RESTAURANT'
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'SHOW_NEW_BILL_PANEL':
    {
      return {
        ...state,
        isVisible: true
      }
    } // case

    case 'HIDE_NEW_BILL_PANEL':
    {
      return {
        ...state,
        isVisible: false
      }
    } // case

    case 'SET_NEW_BILL_USER_CODE':
    {
      return {
        ...state,
        userCode: action.payload
      }
    } // case

    case 'SET_NEW_BILL_USER_PIN':
    {
      return {
        ...state,
        userPin: action.payload
      }
    } // case

    case 'SET_NEW_BILL_USER':
    {
      return {
        ...state,
        user: action.payload
      }
    } // case

    case 'SET_NEW_BILL_USER_PROFILE':
    {
      return {
        ...state,
        profile: action.payload
      }
    } // case

    case 'CLEAR_NEW_BILL_USER':
    {
      return {
        ...state,
        userCode: '',
        userPin: '',
        user: {},
        profile: {}
      }
    } // case

    case 'CLEAR_NEW_BILL_USER_INPUTS':
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

  } // switch

  return state // default return

} // reducer
