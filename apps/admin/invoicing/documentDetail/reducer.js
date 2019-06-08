const defaultPermissions = {
  add: 'unfetched',
  change: 'unfetched',
  list: 'unfetched',
  delete: 'unfetched'
}

const stateConst = {
  activeDocument: {},
  relatedCreditNotes: [],
  relatedDebitNotes: [],
  permissions: defaultPermissions
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'FETCH_DOCUMENT_DETAIL_FULFILLED':
    {
      return {
        ...state,
        activeDocument: action.payload
      }
    } // case

    case 'FETCH_DOCUMENT_DETAIL_REJECTED':
    {
      return {
        ...state,
        activeDocument: {}
      }
    } // case

    case 'FETCH_RELATED_CREDIT_NOTES_FULFILLED':
    {
      return {
        ...state,
        relatedCreditNotes: action.payload
      }
    } // case

    case 'FETCH_RELATED_CREDIT_NOTES_REJECTED':
    {
      return {
        ...state,
        relatedCreditNotes: []
      }
    } // case

    case 'FETCH_RELATED_DEBIT_NOTES_FULFILLED':
    {
      return {
        ...state,
        relatedDebitNotes: action.payload
      }
    } // case

    case 'FETCH_RELATED_DEBIT_NOTES_REJECTED':
    {
      return {
        ...state,
        relatedDebitNotes: []
      }
    } // case

  } // switch

  return state // default return

} // reducer
