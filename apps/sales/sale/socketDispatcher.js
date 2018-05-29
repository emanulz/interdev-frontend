// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
import {getItemDispatch} from '../../../utils/api'
import alertify from 'alertifyjs'

// ------------------------------------------------------------------------------------------
// HANDLE WEB SOCKET EVETS
// ------------------------------------------------------------------------------------------
export function socketDispatcher(message, item, dispatch) {
  switch (message) {

    // IN CASE THERE IS A MESSAGE FOR PRODUCT UPDATED REFETCH PRODUCTS
    case 'PRODUCT_UPDATED':
    {
      const productKwargs = {
        url: '/api/products',
        successType: 'FETCH_PRODUCTS_FULFILLED',
        errorType: 'FETCH_PRODUCTS_REJECTED'
      }
      dispatch({type: 'FETCHING_STARTED', payload: ''})
      dispatch(getItemDispatch(productKwargs))
      break
    } // case

    case 'CLIENT_UPDATED':
    {
      const clientKwargs = {
        url: '/api/clients',
        successType: 'FETCH_CLIENTS_FULFILLED',
        errorType: 'FETCH_CLIENTS_REJECTED'
      }
      dispatch({type: 'FETCHING_STARTED', payload: ''})
      dispatch(getItemDispatch(clientKwargs))
      break
    } // case

    case 'PRESALE_UPDATED':
    {
      alertify.alert('NUEVA PREVENTA', 'Se ha creado una nueva preventa con consecutivo ' + item)
      break
    } // case

  } // switch
}
