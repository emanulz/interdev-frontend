import axios from 'axios'
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

let inspect = require('util-inspect')
import alertify from 'alertifyjs'

export function getPurchaseMovements(kwargs){
    console.log('Purchase movements fetcher')
    const url = kwargs.url
    const successType = kwargs.successType
    const errorType = kwargs.errorType
    const purchase_id = kwargs.purchase_id

    return function(dispatch){
        console.log('URL MOVEMENTS' + `${url}/?purchase_id=${purchase_id}`)
        axios.get(`${url}/?purchase_id=${purchase_id}`)
        .then(response=>{
            dispatch({type:successType, payload: response.data})
            dispatch({type:'FETCHING_DONE'})
        }).catch(err=>{
            console.log(err)
            if(err.response.status != 403){
                alertify.alert('ERROR', `Error al obtener un valor del API, por favor intente de nuevo o comuníquese con el
                administrador del sistema con el siguiete error: ${err}`)
                dispatch({type: errorType, payload: err})
            }
        })
    }
}

export function getProviderDuePayments(kwargs) {
    console.log('Provider due fetcher')
    const successType = kwargs.successType
    const errorType = kwargs.errorType
    const supplier_id = kwargs.supplier_id
    const url = `/api/purchase/?supplier_id=${supplier_id}`
    console.log('Target url --> ' + url)

    return function(dispatch){
        axios.get(url)
        .then(response=>{
            //filter to only objects with debt
            const filtered = response.data.filter(item=>{return item.debt_data['debt']>0})
            //parse string objects into objects
            const parsedItems = filtered.map(item=>{
                const cart = JSON.parse(item.cart)
                const user = JSON.parse(item.user)
                const pay = JSON.parse(item.pay)
                const warehouse = JSON.parse(item.warehouse)
                const supplier = JSON.parse(item.supplier)
                return {
                    ...item,
                    cart:cart,
                    user:user,
                    pay:pay,
                    warehouse:warehouse,
                    supplier:supplier
                }
            })
            dispatch({type: successType, payload: parsedItems})
            dispatch({type:'FETCHING_DONE'})
        }).catch(err=>{
            console.log(err)
            console.log(err.response.data)
            if (err.response.status != 403) {
                alertify.alert('ERROR', `Error al obtener un valor del API, por favor intente de nuevo o comuníquese con el
                administrador del sistema con el siguiete error: ${err}`)
                dispatch({type: errorType, payload: err})
              }
        })
    }
}