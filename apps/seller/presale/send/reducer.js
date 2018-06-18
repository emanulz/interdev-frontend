const stateConst = {
  isVisible: false,
  user: {},
  profile: {},
  userCode: '',
  userPin: ''
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

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

  } // switch

  return state // default return

} // reducer
