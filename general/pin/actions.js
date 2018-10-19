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
      dispatch({type: 'SET_PIN_USER', payload: response.data.user})
      dispatch({type: 'SET_PIN_USER_PROFILE', payload: response.data.profile})
      dispatch({type: 'SET_PIN_USER_CODE', payload: ''})
      dispatch({type: 'SET_PIN_USER_PIN', payload: ''})
      dispatch({type: 'FETCHING_DONE'})
    }).catch(function(error) {
      alertify.alert('ERROR', 'La combinación de código de usuario y PIN son incorrectos')
      dispatch({type: 'CLEAR_PIN_USER_INPUTS', payload: error})
      dispatch({type: 'FETCHING_DONE'})
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

