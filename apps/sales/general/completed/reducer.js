const stateConst = {
  completed: false,
  isPresaleLoaded: false
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

    case 'PRESALE_LOADED':
    {
      return {
        ...state,
        isPresaleLoaded: true
      }
    } // case

  } // switch

  return state // default return

} // reducer
