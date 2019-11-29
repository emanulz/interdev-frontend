
const stateConst = {
  isVisible: false,
  referenceDocAdded: false,
  referenceDocData: {
    documentType: '99',
    documentNumber: '',
    documentCode: '99',
    documentNotes: ''
  }
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'SHOW_REFERENCE_DOC_PANEL':
    {
      return {
        ...state,
        isVisible: true
      }
    } // case

    case 'HIDE_REFERENCE_DOC_PANEL':
    {
      return {
        ...state,
        isVisible: false
      }
    } // case

    case 'SET_REFERENCE_DOC_DATA':
    {
      return {
        ...state,
        referenceDocData: action.payload
      }
    } // case

    case 'CLEAR_REFERENCE_DOC_DATA':
    {
      return {
        ...state,
        referenceDocData: {
          documentType: '99',
          documentNumber: '',
          documentCode: '99',
          documentNotes: ''
        }
      }
    } // case

    case 'SET_REFERENCE_DOC_ADDED':
    {
      return {
        ...state,
        referenceDocAdded: true
      }
    }// case

    case 'CLEAR_REFERENCE_DOC_ADDED':
    {
      return {
        ...state,
        referenceDocAdded: false
      }
    } // case
  } // switch

  return state // default return

} // reducer
