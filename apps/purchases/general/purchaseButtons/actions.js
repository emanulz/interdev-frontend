import axios from 'axios'
import {saveLog} from '../../../../utils/api.js'
let inspect = require('util-inspect')

export function savePurchase(kwargs){
    console.log('Save purchase method!')

    const user_string = JSON.stringify(kwargs.user)
    const supplier_id = kwargs.supplier.id
    const supplier_string = JSON.stringify(kwargs.supplier)
    const cart_string = JSON.stringify(kwargs.cart)
    const pay_string = JSON.stringify(kwargs.pay)
    const pay_type = kwargs.pay.payMethod
    const payed = kwargs.payed
    const invoice_number = kwargs.invoice_number
    const invoice_date = kwargs.invoice_date
    const credit_days = kwargs.credit_days
    const is_closed = kwargs.is_closed
    
    const url = '/api/purchase/'
    const logCode = 'PURCHASE_CREATED'
    const logDescription = 'Purchase saved'
    const logModel = 'PURCHASE'
    const old = {noPrevious:'Initial creation'}

    const dispatchTypeSuccess = 'PURCHASE_SAVED'

    const data = {
        user: user_string,
        supplier: supplier_string,
        supplier_id : supplier_id,
        cart: cart_string,
        pay: pay_string,
        pay_type: pay_type,
        payed: payed,
        invoice_number: invoice_number,
        invoice_date: invoice_date,
        credit_days: credit_days,
        is_closed: is_closed,
    }
    return new Promise((resolve, reject)=>{
        axios({
            method: 'post',
            url: url,
            data:data
        }).then(response=>{
            saveLog(logCode, logModel, old, data, logDescription, kwargs.user)
            resolve(response.data)
        }).catch(err=>{
            console.log(inspect(err))
            if(err.response){
                console.log(err.response.data)
            }
            alertify.alert('Error', 'Error guardando Compra en el sistema')
        })
    })
}
