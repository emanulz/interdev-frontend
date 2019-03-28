const defaultPermissions = {
  add: 'unfetched',
  change: 'unfetched',
  list: 'unfetched',
  delete: 'unfetched'
}

const helperModel = {
  id: '0000000000',
  group: 'colores',
  name: '',
  code: '',
  description: '',
  is_active: true
}

const stateConst = {
  helpers: [],
  helperActive: helperModel,
  permissions: defaultPermissions,
  model: 'colores'
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'SET_HELPER_GROUP':
    {
      return {
        ...state,
        model: action.payload,
        helperActive: {
          ...state.helperActive,
          group: action.payload
        }
      }
      
    }

    case 'SET_HELPER':
    {
      return {
        ...state,
        helperActive: action.payload
      }
    }
    case 'CLEAR_HELPER':
    {
      return {
        ...state,
        helperActive: {
          ...state.helperActive,
          id: '0000000000',
          group: state.model,
          name: '',
          code: '',
          description: '',
          is_active: true
        }

      }
    }

    case 'FETCH_HELPERS_FULFILLED':
    {
      return {
        ...state,
        helpers: action.payload
      }

    } 

    case 'FETCH_HELPERS_REJECTED':
    {
      return {
        ...state,
        helpers: []
      }
    }
  } // switch

  return state // default return

} // reducer
