const defaultPermissions = {
  add: 'unfetched',
  change: 'unfetched',
  list: 'unfetched',
  delete: 'unfetched'
}

const singleRegisterMovementModel = {
  amount: 0,
  coin: 'CRC',
  description: '',
  is_input: true,
  reference_doc: ''
}

const stateConst = {
  singleRegisterMovementActive: singleRegisterMovementModel,
  permissions: defaultPermissions
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'SET_SINGLE_REGISTER_MOVEMENT':
    {
      return {
        ...state,
        singleRegisterMovementActive: action.payload
      }
    } // case

  } // switch

  return state // default return

} // reducer
