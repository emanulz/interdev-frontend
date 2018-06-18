// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
// import alertify from 'alertifyjs'

// Finds a code in the cart and sends a dispatch to remove it from cart based on index

import axios from 'axios'
import alertify from 'alertifyjs'

export function getUserByCode(code, pin) {
  return function(dispatch) {
    const data = JSON.stringify({code: code, pin: pin})
    axios.post('/getuserbycode/', data).then(function(response) {
      dispatch({type: 'SET_SEND_USER', payload: response.data.user})
      dispatch({type: 'SET_SEND_USER_PROFILE', payload: response.data.profile})
      dispatch({type: 'CLEAR_SEND_USER_INPUTS', payload: ''})
      dispatch({type: 'FETCHING_DONE', payload: ''})
    }).catch(function(error) {
      alertify.alert('ERROR', 'La combinación de código de usuario y PIN son incorrectos')
      dispatch({type: 'CLEAR_SEND_USER', payload: error})
      dispatch({type: 'FETCHING_DONE', payload: ''})
    })
  }
}

export function updateStoreCashAmount(amount) {

  const res = (amount) // if its a value
    ? {
      type: 'UPDATE_CASH_AMOUNT',
      payload: parseFloat(amount)
    }
    : {
      type: 'UPDATE_CASH_AMOUNT',
      payload: 0
    }

  return res
}

export function updateStoreCardAuth(number) {

  const res = (number) // if its a value
    ? {
      type: 'UPDATE_CARD_AUTH',
      payload: number
    }
    : {
      type: 'UPDATE_CARD_AUTH',
      payload: ''
    }

  return res
}

export function updateStoreCardDigits(number) {

  const res = (number) // if its a value
    ? {
      type: 'UPDATE_CARD_DIGITS',
      payload: number
    }
    : {
      type: 'UPDATE_CARD_DIGITS',
      payload: ''
    }

  return res
}

// export function loadSale(id, sales) {
//   const filteredSales = sales.filter(sale => {
//     return sale.id == id
//   })
//   return function(dispatch) {
//     if (filteredSales.length) {
//       filteredSales[0]['created'] = new Date(filteredSales[0]['created'])
//       // filteredSales[0]['globalDiscount'] = parseFloat(filteredSales[0]['globalDiscount'])
//       document.getElementById('discountField').value = parseFloat(filteredSales[0]['cart']['globalDiscount'])
//       document.title = `Venta #${id}`
//       filteredSales[0]['client']['saleLoaded'] = true

//       dispatch({type: 'LOADED_SALE', payload: filteredSales[0]})
//       dispatch({type: 'SET_SALE', payload: filteredSales[0]})
//       dispatch({type: 'SET_SALE_ID', payload: filteredSales[0]._id})

//     } else {
//       dispatch({type: 'NOT_FOUND_SALE', payload: id})
//     }
//   }
// }

// export function saveItem(kwargs) {

//   const item = kwargs.item
//   const movements = kwargs.movements
//   return function(dispatch) {
//     const db = new PouchDB(kwargs.db)

//     db.post(item).then((response) => {

//       dispatch({type: 'SET_SALE', payload: item})
//       dispatch({type: 'SET_SALE_ID', payload: response.id})

//       if (item.pay.payMethod == 'CREDIT') { // IF CREDIT CREATE CREDIT MOVEMENT
//         const db2 = new PouchDB('general')
//         const movement = getMovement(movements, response.id, item)

//         db2.post(movement).then(response => {
//           dispatch({type: 'SHOW_INVOICE_PANEL', payload: ''})
//           dispatch({type: 'HIDE_PAY_PANEL', payload: ''})
//         }).catch(err => { // IF ERROR SHOW MESSAGE
//           alertify.alert('Error', `Error al crear el movimiento de crédito, por favor anule la factura y creela
//           de nuevo ERROR: ${err}.`)
//         })

//       } else { // IF NOT CREDIT SHOW PANELS
//         dispatch({type: 'SHOW_INVOICE_PANEL', payload: ''})
//         dispatch({type: 'HIDE_PAY_PANEL', payload: ''})
//       }

//     }).catch((err) => {
//       alertify.alert('Error', `${kwargs.errorMessage} ERROR: ${err}.`)
//     })
//   }
// }

// function getMovement(movements, saleId, sale) {

//   const sortedMovements = movements.length > 1 ? movements.sort((a, b) => {
//     if (a.document < b.document) {
//       return 1
//     }
//     if (a.document > b.document) {
//       return -1
//     }
//     return 0
//   }) : movements

//   const nextId = sortedMovements.length > 0 ? sortedMovements[0].document + 1 : 1

//   const movement = {
//     'document': nextId,
//     'docType': 'CLIENT_MOVEMENT',
//     'clientId': sale.client._id,
//     'type': 'CREDIT',
//     'amount': parseFloat(sale.cart.cartTotal),
//     'date': new Date(),
//     'sale_id': saleId,
//     'saleId': sale.id,
//     'description': `Venta a crédito con factura #${sale.id}`
//   }

//   return movement

// }
