const defaultPermissions = {
  add: 'unfetched',
  change: 'unfetched',
  list: 'unfetched',
  delete: 'unfetched'
}

const stateConst = {
  edebitNotes: [],
  loadedDebitNote: {},
  permissions: defaultPermissions
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'FETCH_USER_EDEBIT_NOTE_PERMISSIONS_FULLFILLED':
    {
      return {
        ...state,
        permissions: action.payload
      }
    } // case

    case 'FETCH_USER_EDEBIT_NOTE_PERMISSIONS_REJECTED':
    {
      return {
        ...state,
        permissions: defaultPermissions
      }
    } // case

    case 'FETCH_EDEBIT_NOTES_FULFILLED':
    {
      return {
        ...state,
        edebitNotes: action.payload
      }

    } // case

    case 'FETCH_EDEBIT_NOTES_REJECTED':
    {
      return {
        ...state,
        edebitNotes: []
      }
    } // case

    case 'SET_EDEBIT_NOTE':
    {
      return {
        ...state,
        loadedDebitNote: action.payload
      }
    }

    case 'CLEAR_EDEBIT_NOTES':
    {
      return {
        ...state,
        debitNotes: [],
        loadedDebitNote: {}
      }
    }

  } // switch

  return state // default return

} // reducer
