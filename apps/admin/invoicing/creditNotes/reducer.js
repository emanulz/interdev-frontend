const defaultPermissions = {
  add: 'unfetched',
  change: 'unfetched',
  list: 'unfetched',
  delete: 'unfetched'
}

const stateConst = {
  ecreditNotes: [],
  loadedCreditNote: {},
  permissions: defaultPermissions
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'FETCH_USER_ECREDIT_NOTE_PERMISSIONS_FULLFILLED':
    {
      return {
        ...state,
        permissions: action.payload
      }
    } // case

    case 'FETCH_USER_ECREDIT_NOTE_PERMISSIONS_REJECTED':
    {
      return {
        ...state,
        permissions: defaultPermissions
      }
    } // case

    case 'FETCH_ECREDIT_NOTES_FULFILLED':
    {
      return {
        ...state,
        ecreditNotes: action.payload
      }

    } // case

    case 'FETCH_ECREDIT_NOTES_REJECTED':
    {
      return {
        ...state,
        ecreditNotes: []
      }
    } // case

    case 'SET_ECREDIT_NOTE':
    {
      return {
        ...state,
        loadedCreditNote: action.payload
      }
    }

    case 'CLEAR_ECREDIT_NOTES':
    {
      return {
        ...state,
        creditNotes: [],
        loadedCreditNote: {}
      }
    }

  } // switch

  return state // default return

} // reducer
