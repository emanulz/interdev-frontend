const stateConst = {
  completed: false
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'PROCESS_COMPLETE':
    {
      return {
        ...state,
        completed: true
      }
    } // case

  } // switch

  return state // default return

} // reducer
