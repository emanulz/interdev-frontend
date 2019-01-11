import alertify from 'alertifyjs'

import axios from 'axios'
// ------------------------------------------------------------------------------------------
// CONFIG DEFAULT AXIOS
// ------------------------------------------------------------------------------------------

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

export function uploadXmlForProcessing(kwargs) {
    const data = kwargs.data
    const url = kwargs.url

    return function(dispatch) {
  
      axios({
        method: 'post',
        url: url,
        data: data
      })
        .then((response) => {
          console.log("Response from XML loader endpoint")  
          console.log(response.data)
          const dispatch_type = kwargs.successDispatch ? kwargs.successDispatch : 'SMART_PURCHASE_PROCESSED'
          dispatch({type: dispatch_type, payload: response.data})
          dispatch({type: 'FETCHING_DONE', payload: ''})
        }).catch((err) => {
          if (err.response) {
            console.log(err.response.data)
            alertify.alert('Error', `${kwargs.errorMessage} ERROR: ${err.response.data.friendly_errors}, ERROR DE SISTEMA: ${err.response.data.system_errors}`)
          } else {
            console.log('NO CUSTOM ERROR')
            console.log(err)
            alertify.alert('Error', `${kwargs.errorMessage} ERROR: ${err}.`)
          }
          dispatch({type: 'FETCHING_DONE', payload: ''})
        })
  
    }
  }