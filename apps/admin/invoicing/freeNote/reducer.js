const stateConst = {
  fullWidth: false,
  freenoteUUID: '',
  supplierName: '',
  relatedDocument: ''
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'TOGGLE_FULL_WIDTH':
    {
      const width = !state.fullWidth
      return {
        ...state,
        fullWidth: width
      }
    } // case

    case 'SET_FREENOTE_UUID':
    {
      return {
        ...state,
        freenoteUUID: action.payload
      }
    } // case
    case 'SET_FREENOTE_SUPPLIER_NAME':
    {
      return {
        ...state,
        supplierName: action.payload
      }
    } // case

    case 'SET_FREENOTE_RELATED_DOC':
    {
      return {
        ...state,
        relatedDocument: action.payload
      }
    } // case

    case 'CLEAR_FREENOTE_SUPPLIER_NAME':
    {
      return {
        ...state,
        supplierName: ''
      }
    } // case

    case 'CLEAR_FREENOTE_RELATED_DOC':
    {
      return {
        ...state,
        relatedDocument: ''
      }
    } // case
  } // switch

  return state // default return

} // reducer
