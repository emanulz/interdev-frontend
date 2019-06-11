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
  relatedInvoices: [],
  relatedTickets: [],
  relatedFetched: false,
  relatedFetchig: false,
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

    case 'FETCH_DOCUMENT_DETAIL_RELATED_FULFILLED':
    {
      return {
        ...state,
        relatedCreditNotes: action.payload.related_credits,
        relatedDebitNotes: action.payload.related_debits,
        relatedInvoices: action.payload.related_invoices,
        relatedTickets: action.payload.related_tickets,
        relatedFetched: true,
        relatedFetchig: false
      }
    } // case

    case 'FETCH_DOCUMENT_DETAIL_RELATED_REJECTED':
    {
      return {
        ...state,
        relatedCreditNotes: [],
        relatedDebitNotes: [],
        relatedInvoices: [],
        relatedTickets: [],
        relatedFetched: false,
        relatedFetchig: false
      }
    } // case

    case 'CLEAR_DOCUMENT_DETAIL_RELATED':
    {
      return {
        ...state,
        relatedCreditNotes: [],
        relatedDebitNotes: [],
        relatedInvoices: [],
        relatedTickets: [],
        relatedFetched: false,
        relatedFetchig: false
      }
    } // case

    case 'SET_DOCUMENT_DETAIL_RELATED_FETCHING':
    {
      return {
        ...state,
        relatedFetchig: true
      }
    } // case

  } // switch

  return state // default return

} // reducer
