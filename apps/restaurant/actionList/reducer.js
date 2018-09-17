const stateConst = {
  actionList: []
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'FETCH_ACTIONS_FULFILLED':
    {
      return {
        ...state,
        actionList: action.payload
      }

    } // case

    case 'FETCH_ACTIONS_REJECTED':
    {
      return {
        ...state,
        actionList: []
      }

    } // case

  }

  return state // default return
}
