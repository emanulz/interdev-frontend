// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
import {getItemDispatch} from '../../../utils/api'
import alertify from 'alertifyjs'
import {getPendingPresales} from './presales/actions.js'

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
      const kwargs = {
        url: '/api/presales',
        ordering: '-consecutive',
        filterField: 'closed',
        filter: true,
        filterField2: 'billed',
        filter2: false,
        filterField3: 'is_null',
        filter3: false,
        successType: 'FETCH_PRESALES_FULFILLED',
        errorType: 'FETCH_PRESALES_REJECTED'
      }
      dispatch(getPendingPresales(kwargs))
      const sound = new Audio('/media/sounds/newPresale.mp3')
      alertify.set('notifier', 'position', 'top-right')
      alertify.notify('NUEVA PREVENTA #' + item, 'warning', 7)
      sound.play()
      break
    } // case

  } // switch
}
