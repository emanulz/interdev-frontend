const stateConst = {
    globalPref:''
  }

  export default function reducer(state=stateConst, action){
      switch (action.type){
          case 'FETCH_GLOBAL_PREF_FULFILLED':
          {
              return{
                  ...state,
                  globalPref:action.payload
              }
          }
          case 'FETCH_GLOBAL_PREF_REJECTED':
          {
              return{
                  ...state,
                  globalPref:''
              }
          }
      }
      return state
  }