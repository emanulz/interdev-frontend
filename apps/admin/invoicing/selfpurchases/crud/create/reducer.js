const stateConst = {
  fullWidth: false,
  selfpurchaseUUID: '',
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

    case 'SET_SELFPURCHASE_UUID':
    {
      return {
        ...state,
        selfpurchaseUUID: action.payload
      }
    } // case
    case 'SET_SELFPURCHASE_SUPPLIER_NAME':
    {
      return {
        ...state,
        supplierName: action.payload
      }
    } // case

    case 'SET_SELFPURCHASE_RELATED_DOC':
    {
      return {
        ...state,
        relatedDocument: action.payload
      }
    } // case

    case 'CLEAR_SELFPURCHASE_SUPPLIER_NAME':
    {
      return {
        ...state,
        supplierName: ''
      }
    } // case

    case 'CLEAR_SELFPURCHASE_RELATED_DOC':
    {
      return {
        ...state,
        relatedDocument: ''
      }
    } // case
  } // switch

  return state // default return

} // reducer
