const clientModel = {
  last_name: 'General',
  name: 'Cliente',
  email: ''
}

const stateConst = {
  notes: '',
  client: clientModel
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'CLEAR_ALL':
    {
      return {
        ...state,
        notes: '',
        client: clientModel
      }
    }

    case 'SET_EXTRAS_CLIENT':
    {
      return {
        ...state,
        client: action.payload
      }
    } // case

    case 'SET_EXTRAS_NOTES':
    {
      return {
        ...state,
        notes: action.payload
      }
    } // case

    case 'CLEAR_EXTRAS_CLIENT':
    {
      return {
        ...state,
        client: clientModel
      }
    } // case

    case 'CLEAR_EXTRAS_NOTES':
    {
      return {
        ...state,
        notes: ''
      }
    } // case

    case 'SET_PRESALE_EXTRAS':
    {
      const notes = action.payload ? action.payload.notes : ''
      const client = action.payload ? action.payload.client : clientModel
      return {
        ...state,
        notes: notes,
        client: client
      }
    } // case

  } // switch

  return state // default return

} // reducer
