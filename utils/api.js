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

// ------------------------------------------------------------------------------------------
// EXPORT FUNCTIONS
// ------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------
// GET FUNCTIONS (RETRIEVE ALL)
// ------------------------------------------------------------------------------------------
export function savePayableCreditMovementPromise(kwargs) {
  const method = 'post'
  const url ='/api/payablescreditmovement/'

  const cre_mov_desc = kwargs.description?kwargs.description:`Débito a factura ${kwargs.invoice_number}`

  const data = {
      supplier_id: kwargs.supplier_id,
      purchase_id: kwargs.purchase_id,
      credit_note_id: kwargs.credit_note_id?kwargs.credit_note_id:'',
      debit_note_id: kwargs.debit_note_id?kwargs.debit_note_id:'',
      payment_id: kwargs.payment_id,
      movement_type:kwargs.movement_type,
      amount: kwargs.amount,
      description: cre_mov_desc,
      is_null:kwargs.is_null?kwargs.is_null:false
  }
  return new Promise((resolve, reject)=>{
      axios({
          method:method,
          url:url,
          data:data
      }).then(response=>{
          resolve(response.data)
      }).catch(err=>{
          console.log(err)
          if(err.response){
              console.log(err.response.data)
          }
          alertify.alert('Error', 'Error creando Movimiento de Crédito')
      })
  })
}

export function savePayableCreditPaymentPromise(kwargs){

  const method = 'post'
  const url ='/api/payablescreditpayment/'

  const cre_mov_desc = kwargs.description?kwargs.description:`Pago a crédito por factura ${kwargs.invoice_number}`
  const data = {
      purchase: JSON.stringify(kwargs.purchase),
      user: kwargs.user,
      supplier: kwargs.supplier,
      supplier_id:kwargs.supplier_id,
      amount: kwargs.amount,
      description: cre_mov_desc,
      is_null:kwargs.is_null?kwargs.is_null:false
  }
  return new Promise((resolve, reject)=>{
      axios({
          method:method,
          url:url,
          data:data
      }).then(response=>{
          resolve(response.data)
      }).catch(err=>{
          console.log(err)
          if(err.response){
              console.log(err.response.data)
          }
          alertify.alert('Error', 'Error creando Pago a Crédito')
      })
  })
}

export function getSingleItemDispatch(kwargs) {

  const url = kwargs.url
  const successType = kwargs.successType
  const errorType = kwargs.errorType

  return function(dispatch) {
    axios.get(url).then(function(response) {
      dispatch({type: successType, payload: response.data})
      dispatch({type: 'FETCHING_DONE'})
    }).catch(function(error) {
      console.log(error.response.status)
      // IF THE ERROR IS UNAUTORIZED PAGE WILL SHOW THE MESSAGE
      if (error.response.status != 403) {
        alertify.alert('ERROR', `Error al obtener un valor del API, por favor intente de nuevo o comuníquese con el
        administrador del sistema con el siguiente error: ${error}`)
        dispatch({type: 'FETCHING_DONE'})
        dispatch({type: errorType, payload: error})
      }
    })
  }

}

export function getSearchDispatch(kwargs){
  const url = kwargs.url
  const singleResultDispatch = kwargs.singleResultDispatch
  const multiResultDispatch = kwargs.multiResultDispatch
  const noResultsDispatch = kwargs.noResultsDispatch
  const errDispatch = kwargs.errorType
  return function(dispatch){
    axios.get(url).then(function(response){
      const results = response.data.results
      if(results.length==1){
        dispatch({type: singleResultDispatch, payload: results[0]})
      }else if(results.length == 0){
        dispatch({type: noResultsDispatch})
      }else{
        dispatch({type: multiResultDispatch, payload: results})
      }
    }).catch(err=>{
      console.log(err)
      if(err.response){
        console.log(err.response.status)
        if (error.response.status != 403) {
          alertify.alert('ERROR', `Error al obtener un valor del API, por favor intente de nuevo o comuníquese con el
          administrador del sistema con el siguiete error: ${error}`)
          dispatch({type: errDispatch, payload: error})
        }
      }

    })
  }
}

export function getItemDispatch(kwargs) {

  const url = kwargs.url
  const successType = kwargs.successType
  const errorType = kwargs.errorType

  return function(dispatch) {
    axios.get(url).then(function(response) {
      dispatch({type: successType, payload: response.data.results})
      dispatch({type: 'FETCHING_DONE'})
    }).catch(function(error) {
      console.log(error.response.status)
      // IF THE ERROR IS UNAUTORIZED PAGE WILL SHOW THE MESSAGE
      dispatch({type: 'FETCHING_DONE'})
      if (error.response.status != 403) {
        alertify.alert('ERROR', `Error al obtener un valor del API, por favor intente de nuevo o comuníquese con el
        administrador del sistema con el siguiente error: ${error}`)
        dispatch({type: errorType, payload: error})
      }
    })
  }

}

export function getItemDispatchAndCacheIt(kwargs) {

  const url = kwargs.url
  const successType = kwargs.successType
  const errorType = kwargs.errorType
  const cacheName = kwargs.cacheName

  return function(dispatch) {
    if (localStorage.getItem(`interdev_${cacheName}`) === null) {
      axios.get(url).then(function(response) {
        localStorage.setItem(`interdev_${cacheName}`, JSON.stringify(response.data.results))
        dispatch({type: successType, payload: response.data.results})
        dispatch({type: 'FETCHING_DONE'})
      }).catch(function(error) {
        localStorage.removeItem(`interdev_${cacheName}`)
        console.log(error.response.status)
        // IF THE ERROR IS UNAUTORIZED PAGE WILL SHOW THE MESSAGE
        dispatch({type: 'FETCHING_DONE'})
        if (error.response.status != 403) {
          alertify.alert('ERROR', `Error al obtener un valor del API, por favor intente de nuevo o comuníquese con el
          administrador del sistema con el siguiente error: ${error}`)
          dispatch({type: errorType, payload: error})
        }
      })
    } else {
      dispatch({type: successType, payload: JSON.parse(localStorage.getItem(`interdev_${cacheName}`))})
      dispatch({type: 'FETCHING_DONE'})
    }
  }

}

export function getItemsListDispatch(kwargs) {

  const url = kwargs.url
  const successType = kwargs.successType

  return function(dispatch) {
    axios.get(url).then(function(response) {
      dispatch({type: successType, payload: response.data})
      dispatch({type: 'FETCHING_DONE'})
    }).catch(function(err) {
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

export function getItemByIDDispatch(kwargs) {

  const url = kwargs.url
  const successType = kwargs.successType
  const errorType = kwargs.errorType

  return function(dispatch) {
    axios.get(url).then(function(response) {
      dispatch({type: successType, payload: response.data})
      dispatch({type: 'FETCHING_DONE', payload: ''})
    }).catch(function(error) {
      console.log(error)
      // IF THE ERROR IS UNAUTORIZED PAGE WILL SHOW THE MESSAGE
      dispatch({type: 'FETCHING_DONE'})
      if (error.response.status != 403) {
        alertify.alert('ERROR', `Error al obtener un valor del API, por favor intente de nuevo o comuníquese con el
        administrador del sistema con el siguiete error: ${error}`)
        dispatch({type: errorType, payload: error})
      }
    })
  }

}

export function getPaginationItemDispatch(kwargs) {

  const url = kwargs.url
  const successType = kwargs.successType
  const errorType = kwargs.errorType
  return function(dispatch) {
    axios.get(url).then(function(response) {
      dispatch({type: successType, payload: response.data.results})
      const paginationPayload = {
        total: response.data.count,
        next: response.data.next,
        previous: response.data.previous
      }
      dispatch({type: 'PAGINATION_DATA', payload: paginationPayload})
      dispatch({type: 'FETCHING_DONE', payload: ''})
    }).catch(function(error) {
      // IF THE ERROR IS UNAUTORIZED PAGE WILL SHOW THE MESSAGE
      alertify.alert('ERROR', `Error al obtener un valor del API, por favor intente de nuevo o comuníquese con el
      administrador del sistema con el siguiete error: ${error}`)
      dispatch({type: errorType, payload: error})
    })
  }

}

export function getItemDoubleDispatch(kwargs) {

  const url = kwargs.url
  const successType = kwargs.successType
  const successType2 = kwargs.successType2
  const errorType = kwargs.errorType

  return function(dispatch) {
    axios.get(url).then(function(response) {
      dispatch({type: successType, payload: response.data.results})
      dispatch({type: successType2, payload: ''})
      dispatch({type: 'FETCHING_DONE', payload: ''})
    }).catch(function(error) {
      console.log(error.response.status)
      if (error.response.status != 403) {
        alertify.alert('ERROR', `Error al obtener un valor del API, por favor intente de nuevo o comuníquese con el
        administrador del sistema con el siguiete error: ${error}`)
        dispatch({type: errorType, payload: error})
      }
    })
  }
}

export function getItemReturn(kwargs) {

  const url = kwargs.url

  axios.get(url).then(function(response) {
    return response.data.results
  }).catch(function(error) {
    alertify.alert('ERROR', `Error al obtener un valor del API, por favor intente de nuevo o comuníquese con el
    administrador del sistema con el siguiete error: ${error}`)
    return error
  })
}

// ------------------------------------------------------------------------------------------
// SET FUNCTION (RETRIEVE INDIVIDUAL)
// ------------------------------------------------------------------------------------------
export function setItem(kwargs) {

  const lookUpValue = kwargs.lookUpValue
  const lookUpField = kwargs.lookUpField
  const history = kwargs.history
  const redirectUrl = kwargs.redirectUrl
  const url = kwargs.url

  return function(dispatch) {

    axios.get(`${url}?${lookUpField}=${lookUpValue}`).then(function(response) {

      if (response.data.count > 0) {
        // IF THERE IS MORE THAN ONE ELEMENT FILTERED
        if (response.data.count > 1) {
          alertify.alert('ATENCIÓN', `Existe mas de un ${kwargs.modelName} con el ${kwargs.lookUpName}:
          ${kwargs.lookUpValue}, se utilizará el primero en lista, por lo que puede no ser el mismo que ud desea
          actualizar, esto puede deberse a un error, por favor revise los
          datos o contacte con el administrador del sistema.`)
        }

        dispatch({type: kwargs.dispatchType, payload: response.data.results[0]})
        if(kwargs.dispatchType2 !== undefined && kwargs.dispatchType2 !== ''){
          dispatch({type: kwargs.dispatchType2, payload: response.data.results[0]})
        }
        
        dispatch({type: 'FETCHING_DONE'})

      } else {
        dispatch({type: kwargs.dispatchErrorType})
        alertify.alert('Error', `No hay ${kwargs.modelName} con el valor de ${kwargs.lookUpName}: ${kwargs.lookUpValue}`,
          function() { history.push(redirectUrl) })
      }

    }).catch(function(error) {
      alertify.alert('ERROR', `Error al obtener el valor del API, por favor intente de nuevo o comuníquese con el
      administrador del sistema con el siguiete error: ${error}`)
    })
  }

}

export function setItemById(kwargs) {

  const lookUpValue = kwargs.lookUpValue
  const history = kwargs.history
  const redirectUrl = kwargs.redirectUrl
  const url = kwargs.url

  return function(dispatch) {

    axios.get(`${url}/${lookUpValue}`).then(function(response) {

      if (response.data) {
        // IF THERE IS MORE THAN ONE ELEMENT FILTERED

        dispatch({type: kwargs.dispatchType, payload: response.data})
        if (kwargs.dispatchType2 !== undefined && kwargs.dispatchType2 !== '') {
          dispatch({type: kwargs.dispatchType2, payload: response.data})
        }

        dispatch({type: 'FETCHING_DONE'})

      } else {
        dispatch({type: kwargs.dispatchErrorType})
        alertify.alert('Error', `No hay ${kwargs.modelName} con el valor de ${kwargs.lookUpName}: ${kwargs.lookUpValue}`,
          function() { history.push(redirectUrl) })
      }

    }).catch(function(error) {
      // IF DOES NOT EXIST
      if (error.response.status == 404) {
        alertify.alert('Error', `No hay ${kwargs.modelName} con el valor de ${kwargs.lookUpName}: ${kwargs.lookUpValue}`)
        history.push(redirectUrl)
      } else {
        alertify.alert('ERROR', `Error al obtener el valor del API, por favor intente de nuevo o comuníquese con el
        administrador del sistema con el siguiete error: ${error}`)
        dispatch({type: 'FETCHING_DONE', payload: ''})
        history.push(redirectUrl)
      }
    })
  }

}

// -----------------------------------------------------------
// GENERAL SAVE
// ----------------------------------------------------------
export function generalSave(kwargs) {

  const data = kwargs.data
  const url = kwargs.url
  const method = kwargs.method
  return function(dispatch) {
    dispatch({type: 'FETCHING_STARTED'})
    axios({
      method: method,
      url: url,
      data: data
    })
      .then((response) => {
        if(kwargs.sucessMessage){
          alertify.alert('Completado', kwargs.sucessMessage)
          .set('onok', function() {
            if (kwargs.redirectUrl) {
              kwargs.history.push(kwargs.redirectUrl)
            }
          })
        }

        if(kwargs.workerMethod){
          kwargs.workerMethod(response.data)
        }else{
          dispatch({type: kwargs.successType, payload: response.data})
        }
        
        dispatch({type: 'FETCHING_DONE'})

      }).catch((err) => {
        if (err.response) {
          dispatch({type: kwargs.errorType})
          console.log(err.response.data)
          let error_message = "Algo salio mal!!"
          if(err.response.data.friendly_errors.length > 0){
            error_message = `${kwargs.errorMessage} Razón: ${err.response.data.friendly_errors}. ` 
          }
          
          if(err.response.data.system_errors.length>0){
            console.log("Error de sistema --> ", )
            error_message += `ERROR DE SISTEMA: ${err.response.data.system_errors}`
          }
          alertify.alert('Error', error_message)
        } else {
          console.log('NO CUSTOM ERROR')
          console.log(err)
          alertify.alert('Error', `${kwargs.errorMessage} ERROR: ${err}.`)
        }
        dispatch({type: 'FETCHING_DONE', payload: ''})
      })

  }
}

// ------------------------------------------------------------------------------------------
// SAVE FUNCTION (CREATE)
// ------------------------------------------------------------------------------------------
export function saveItem(kwargs) {
  const item = kwargs.item
  delete item['id']
  const url = kwargs.url

  const isSale = kwargs.isSale
  const isWorkOrder = kwargs.isWorkOrder
  return function(dispatch) {

    axios({
      method: 'post',
      url: url,
      data: item
    })
      .then((response) => {
        alertify.alert('Completado', kwargs.sucessMessage)
          .set('onok', function() {
            if (kwargs.redirectUrl) {
              kwargs.history.push(kwargs.redirectUrl)
            }
          })
        dispatch({type: kwargs.dispatchType, payload: ''})
        dispatch({type: 'FETCHING_DONE', payload: ''})
        if (isSale) {
          dispatch({type: 'SET_SALE', payload: response.data})
          dispatch({type: 'SHOW_INVOICE_PANEL', payload: ''})
        } else if (isWorkOrder) {
          dispatch({type: 'WORK_ORDER_CREATED', payload: response.data})
        }
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

// ------------------------------------------------------------------------------------------
// UPDATE FUNCTION
// ------------------------------------------------------------------------------------------

export function updateItem(kwargs) {
  const item = kwargs.item
  const url = kwargs.url
  return function(dispatch) {

    axios({
      method: 'patch',
      url: url,
      data: item
    })
      .then((response) => {
        alertify.alert('Completado', kwargs.sucessMessage)
          .set('onok', function() {
            if (kwargs.redirectUrl) {
              kwargs.history.push(kwargs.redirectUrl)
            }
          })
        dispatch({type: kwargs.dispatchType, payload: ''})
        dispatch({type: 'FETCHING_DONE', payload: ''})
      }).catch((err) => {
        if (err.response) {
          console.log(err.response.data)
          alertify.alert('Error', `${kwargs.errorMessage} ERROR: ${err.response.data.friendly_errors}, ERROR DE SISTEMA: ${err.response.data.system_errors}`)
            .set('onok', function() {
              return true
            })
        } else {
          console.log('NO CUSTOM ERROR')
          console.log(err)
          alertify.alert('Error', `${kwargs.errorMessage} ERROR: ${err}.`)
            .set('onok', function() {
              return true
            })
        }
        dispatch({type: 'FETCHING_DONE', payload: ''})
      })

  }
}

// ------------------------------------------------------------------------------------------
// UPDATE PARTIALLY FUNCTION (PATCH)
// ------------------------------------------------------------------------------------------

export function patchItem(kwargs) {
  const item = kwargs.item
  const url = kwargs.url
  const user = kwargs.user

  return function(dispatch) {

    axios({
      method: 'patch',
      url: url,
      data: item
    })
      .then((response) => {
        if (kwargs.sucessMessage) {
          alertify.alert('Completado', kwargs.sucessMessage)
            .set('onok', function() {
              if (kwargs.redirectUrl) {
                kwargs.history.push(kwargs.redirectUrl)
              }
            })
        }
        dispatch({type: kwargs.dispatchType, payload: ''})
        dispatch({type: 'SET_SALE_ID', payload: ''})
        dispatch({type: 'FETCHING_DONE', payload: ''})
      }).catch((err) => {
        if (err.response) {
          console.log(err.response.data)
          alertify.alert('Error', `${kwargs.errorMessage} ERROR: ${err.response.data.friendly_errors}, ERROR DE SISTEMA: ${err.response.data.system_errors}`)
        } else {
          console.log('NO CUSTOM ERROR')
          console.log(err)
          alertify.alert('Errorrr', `${kwargs.errorMessage} ERROR: ${err}.`)
        }
        dispatch({type: 'FETCHING_DONE', payload: ''})
      })

  }
}

// ------------------------------------------------------------------------------------------
// DOUBLE UPDATE PARTIALLY FUNCTION (PATCH)
// ------------------------------------------------------------------------------------------

export function patchItems(kwargs, kwargs2) {
  const item = kwargs.item
  const url = kwargs.url
  const user = kwargs.user

  const item2 = kwargs2.item
  const url2 = kwargs2.url

  return function(dispatch) {

    axios({
      method: 'patch',
      url: url,
      data: item
    })
      // FIRST PATCH THEN
      .then((response) => {

        dispatch({type: kwargs.dispatchType, payload: ''})

        // SECOND PATCH
        axios({
          method: 'patch',
          url: url2,
          data: item2
        })
          // SECOND PATCH THEN
          .then((response) => {
            if (kwargs2.sucessMessage) {
              alertify.alert('Completado', kwargs2.sucessMessage)
                .set('onok', function() {
                  if (kwargs2.redirectUrl) {
                    kwargs2.history.push(kwargs2.redirectUrl)
                  }
                })
            }
            dispatch({type: kwargs2.dispatchType, payload: ''})
            dispatch({type: 'FETCHING_DONE', payload: ''})

          // SECOND PATCH CATCH
          }).catch((err) => {
            console.log(err)
            if (err.response) {
              console.log(err.response.data)
            }
            alertify.alert('Error', `${kwargs2.errorMessage} ERROR: ${err}.`)
            dispatch({type: 'FETCHING_DONE', payload: ''})
          })

      // FIRST PATCH CATCH
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

// ------------------------------------------------------------------------------------------
// DELETE FUNCTION (DELETE)
// ------------------------------------------------------------------------------------------
export function deleteItem(kwargs) {

  const url = kwargs.url

  return function(dispatch) {

    axios({
      method: 'delete',
      url: url
    })
      .then((response) => {

        alertify.alert('Completado', 'Elemento eliminado satifactoriamente')
          .set('onok', function() {
            if (kwargs.redirectUrl) {
              kwargs.history.push(kwargs.redirectUrl)
            }
          })
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

// ------------------------------------------------------------------------------------------
// DELETE FUNCTION (DELETE)
// ------------------------------------------------------------------------------------------
export function deleteItemDispatch(kwargs) {

  const item = kwargs.item
  const url = kwargs.url
  const model = kwargs.modelName
  const dispatchType = kwargs.dispatchType
  return function(dispatch) {
    axios({
      method: 'delete',
      url: url
    })
      .then((response) => {

        alertify.alert('Completado', 'Elemento eliminado satifactoriamente')
          .set('onok', function() {
            if (kwargs.redirectUrl) {
              kwargs.history.push(kwargs.redirectUrl)
            }
          })
        dispatch({type: dispatchType, payload: item.id})
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

// ------------------------------------------------------------------------------------------
// LOAD CONFIG FUNCTION
// ------------------------------------------------------------------------------------------
export function loadGlobalConfig(section, name, success, fail) {
  return function(dispatch) {
    if (name) {
      // IF ITS SINGLE RETURNS ONLY ITS VALUE
      axios.get(`/api/globalprefs/${section}__${name}`).then(function(response) {
        dispatch({type: success, payload: response.data.value})
      }).catch(function(error) {
        dispatch({type: fail, payload: error})
      })

    } else {
      axios.get(`/api/globalprefs/?limit=10000`).then(function(response) {
        // The property to modify in reducer
        const config = response.data.results
          ? response.data.results.filter(item => {
            return item.section == section
          })
          : {}
        const data = {}
        config.forEach(item => {
          data[item.name] = item.value
        })

        dispatch({type: success, payload: {data: data, section: section}})
      }).catch(function(error) {
        dispatch({type: fail, payload: error})
        dispatch({type: 'FETCHING_DONE'})
      })
    }
  }
}


// ------------------------------------------------------------------------------------------
// AUX FUNCTIONS
// ------------------------------------------------------------------------------------------

// NEXT NUMERIC CODE
export function getNextNumericCode(elements, field) {

  if (elements.length) {

    let keys = elements.map(element => element[field])

    keys = keys.sort((a, b) => a - b)
    const max = keys.pop()
    const next = parseInt(max) + 1
    return next.toString()

  }

  return 1

}

// NEXT PREVIOUS ITEMS
export function setNextPrevItem(kwargs) {

  const code = kwargs.code
  const items = kwargs.items
  const codeField = kwargs.codeField
  let previous = 0
  let next = 0

  items.sort((a, b) => {
    return a[codeField] - b[codeField]
  })

  items.forEach((item, index) => {
    if (item[codeField] == code) {
      next = index + 1
      previous = index - 1
      return true
    }
  })

  const nextCode = items[next] ? items[next][codeField] : items[0][codeField]
  const prevCode = items[previous] ? items[previous][codeField] : items.pop()[codeField]

  return function(dispatch) {
    dispatch({type: kwargs.dispatchType, payload: {next: nextCode, previous: prevCode}})
  }
}

export function postNoDispatch(kwargs){
  const data = kwargs.data
  const url = kwargs.url
  return new Promise((resolve, reject)=>{
    axios({
      method:'post',
      url:url,
      data:data
    }).then(response=>{
      resolve(response.data)
    }).catch(err=>{
      console.log(err)
      if(err.response){
        console.log(err.response.data)
      }
      reject(err)
    })
  })
}

export function postDispatch(kwargs){
  const data = kwargs.data
  const url = kwargs.url
  const successDispatch = kwargs.onSuccess
  const errorDispatch =  kwargs.onError

  return function(dispatch){
    axios({
      method: 'post',
      url: url,
      data:data
    }).then(response=>{
      dispatch({type: successDispatch, payload: response.data})
      dispatch({type: 'FETCHING_DONE'})

    }).catch(err=>{
      console.log("ERROR on postDispatch")
      console.log(err)
      if(err.response){
        console.log(err.response.data)
      }
      dispatch({type: errorDispatch})
      dispatch({type:'FETCHING_DONE'})
    })
  }
}