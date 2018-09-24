// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
import alertify from 'alertifyjs'

import axios from 'axios'

// ------------------------------------------------------------------------------------------
// CONFIG DEFAULT AXIOS
// ------------------------------------------------------------------------------------------
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

export function getEarmings(cart) {
  axios({
    method: 'post',
    url: '/api/presales/cartprice/',
    data: {cart: JSON.stringify(cart)}
  }).then((response) => {
    const data = response.data
    console.log(data)
    alertify.alert('RESULTADOS', `Subtotal Con Descuentos: ${data.total_no_ivi.toFixed(2)}, Costo Venta: ${data.total_cost.toFixed(2)}, Utilidad: ${data.utility.toFixed(2)}%, Ganancia: ${data.raw_earnings.toFixed(2)}`)
  }).catch((err) => {
    if (err.response) {
      console.log(err.response.data)
      alertify.alert('Error', `ERROR: ${err.response.data.friendly_errors}, ERROR DE SISTEMA: ${err.response.data.system_errors}`)
    } else {
      console.log('NO CUSTOM ERROR')
      console.log(err)
      alertify.alert('Error', `ERROR: ${err}.`)
    }
  })
}
