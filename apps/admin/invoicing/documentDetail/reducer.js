const defaultPermissions = {
  add: 'unfetched',
  change: 'unfetched',
  list: 'unfetched',
  delete: 'unfetched'
}

const stateConst = {
  activeDocument: {},
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

  } // switch

  return state // default return

} // reducer
