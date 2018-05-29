import axios from 'axios'

export function fecthProfile() {

  return function(dispatch) {
    axios.get('/profile/').then(function(response) {
      dispatch({type: 'FETCH_PROFILE_FULFILLED', payload: {user: response.data[0].fields, profile: response.data[1].fields}})
      dispatch({type: 'FETCHING_DONE', payload: ''})
    }).catch(function(error) {
      dispatch({type: 'FETCH_PROFILE_REJECTED', payload: error})
    })
  }
}

export function fecthIsAdminLocked() {

  return function(dispatch) {
    axios.get('/api/userprefs/admin__is_admin_locked/').then(function(response) {
      dispatch({type: 'FETCH_IS_ADMIN_LOCKED_FULFILLED', payload: response.data.value})
      dispatch({type: 'FETCHING_DONE', payload: ''})
    }).catch(function(error) {
      dispatch({type: 'FETCH_IS_ADMIN_LOCKED_REJECTED', payload: error})
    })
  }
}
