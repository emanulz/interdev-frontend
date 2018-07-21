// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
import alertify from 'alertifyjs'
import axios from 'axios'

export function nullMovement(takeId, id) {
  const url = `/api/physicaltakes/${takeId}/null_take_mov/`
  const data = {
    movement_id: id
  }
  return function(dispatch) {
    axios({
      method: 'post',
      url: url,
      data: data
    })
      .then((response) => {
        alertify.alert('COMPLETADO', 'Movimiento anulado correctamente')
        dispatch({type: 'CLEAR_CHECK_TAKE_MOVEMENTS_CART', payload: ''})
        dispatch({type: 'CLEAR_CHECK_TAKE_PRODUCT_MOVEMENTS', payload: ''})
        dispatch({type: 'CLEAR_CHECK_TAKE_PRODUCT_ACTIVE', payload: ''})
        console.log(response)
      })
      .catch(err => {
        alertify.alert('ERROR', `Hubo un error al anular el movimiento error: ${err}`)
        console.log(err)
      })
  }
}
