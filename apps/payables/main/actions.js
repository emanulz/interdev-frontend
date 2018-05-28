import axios from 'axios'


export function fetchGlobalPreferences(){
  return function(dispatch){
    axios.get('/api/globalprefs/').then(response=>{
      dispatch({type: 'FETCH_GLOBAL_PREF_FULFILLED', payload:response.data})
      dispatch({type: 'FETCHING_DONE'})
    }).catch(err=>{
      dispatch({type:'FETCH_GLOBAL_PREF_REJECTED', payload:err})
    })
  }
}

export function fetchProfile() {

    return function(dispatch) {
      axios.get('/profile/').then(function(response) {
        dispatch({type: 'FETCH_PROFILE_FULFILLED', payload: {user: response.data[0].fields, profile: response.data[1].fields}})
        dispatch({type: 'FETCHING_DONE', payload: ''})
      }).catch(function(error) {
        dispatch({type: 'FETCH_PROFILE_REJECTED', payload: error})
      })
    }
  }
  
  export function fetchIsAdminLocked() {
  
    return function(dispatch) {
      axios.get('/api/userprefs/admin__is_admin_locked/').then(function(response) {
        dispatch({type: 'FETCH_IS_ADMIN_LOCKED_FULFILLED', payload: response.data.value})
        dispatch({type: 'FETCHING_DONE', payload: ''})
      }).catch(function(error) {
        dispatch({type: 'FETCH_IS_ADMIN_LOCKED_REJECTED', payload: error})
      })
    }
  }