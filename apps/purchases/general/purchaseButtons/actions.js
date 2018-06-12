import axios from 'axios'
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

import {saveLog} from '../../../../utils/api.js'
let inspect = require('util-inspect')


export function savePurchase(kwargs){

    //const user_string = JSON.stringify(kwargs.user)
    const supplier_id = kwargs.supplier_id
    //const supplier_string = JSON.stringify(kwargs.supplier)
    const warehouse_id = kwargs.warehouse_id
    const cart_string = JSON.stringify(kwargs.cart)
    const pay_string = JSON.stringify(kwargs.pay)
    const pay_type = kwargs.pay.payMethod
    const invoice_number = kwargs.invoice_number
    const invoice_date = kwargs.invoice_date
    const credit_days = kwargs.credit_days
    const apply = kwargs.apply
    
    let method = 'post'
    let url = '/api/purchase/'
    
    if(kwargs.update_purchase === true){
        method = 'patch'
        url = `/api/purchase/${kwargs.id}/`
    }

    const data = {
        supplier_id : supplier_id,
        warehouse_id: warehouse_id,
        cart: cart_string,
        pay: pay_string,
        pay_data: JSON.stringify(buildPayData(kwargs.pay, kwargs.cart)), 
        pay_type: pay_type,
        invoice_number: invoice_number,
        invoice_date: invoice_date,
        credit_days: credit_days,
        apply: apply,
    }
    return new Promise((resolve, reject)=>{
        axios({
            method: method,
            url: url,
            data: data
        }).then(response=>{
            resolve(response.data)
        }).catch(err=>{
            console.log(err.response)
            if(err.response){
                console.log(err.response.data)
            }
            alertify.alert('Error', 'Error guardando Compra en el sistema')
            reject(err)
        })
    })
}

function buildPayData(pay, cart){
    switch(pay.payMethod){
        case 'CASH':
        {   
            if(pay.payMethodOptionSelected =='0'){
                return {
                    'CASH':[{type: 'CASH', 'amount': cart.cartTotal}]
                }
            }else if(pay.payMethodOptionSelected =='1'){
                return {
                    'TRANS':[{ type: 'TRANS', 'amount': cart.cartTotal, 'bank': pay.bank, 'transfer_reference': pay.transfer_reference}]
                }
            }

            break
        }
        case 'CRED':
        {
            return {
                'CRED':[{ type: 'CRED', 'amount': cart.cartTotal}]
            }
            
        }
    }

}

export function saveInventoryTransaction(kwargs){

    let logCode = 'INVENTORY_MOVEMENT_CREATED'
    let logDescription = `Inventory movement created for purchase ${kwargs.purchase_id} with invoice number ${kwargs.invoice_number}` 
    let old = {noPrevious:'Initial creation'}
    let method = 'post'
    let url ='/api/inventorymovements/'
    const logModel = 'INVENTORY_MOVEMENT'

    if(kwargs.old !==  undefined){
        old = JSON.parse(kwargs.old)
        method = 'patch'
        url = `/api/inventorymovements/${kwargs.id}`
        logCode = 'INVENTORY_MOVEMENT_PATCHED'
        logDescription = `Inventory movement patched for purchase ${kwargs.purchase_id} with invoice number ${kwargs.invoice_number}` 
    }

    const inv_message_desc = `Ingreso a bodega por factura ${kwargs.invoice_number}`
    const data = {
        movement_type : 'INPUT',
        user : JSON.stringify(kwargs.user),
        amount: kwargs.item.qty,
        product_id : kwargs.item.product.id,
        product : JSON.stringify(kwargs.item.product),
        warehouse_id: kwargs.warehouse.id,
        description: inv_message_desc,
        warehouse: JSON.stringify(kwargs.warehouse),
        is_null: false,
        id_generator: `pu_${kwargs.purchase_id}`
    }

    return new Promise((resolve, reject)=>{
        axios({
            method:method,
            url:url,
            data:data
        }).then(response=>{
            saveLog(logCode, logModel, old, data, logDescription, kwargs.user)
            resolve(response.data)
        }).catch(err=>{
            console.log(err)
            if(err.response){
                console.log(err.response.data)
            }
            alertify.alert('Error', 'Error guardando movimiento de inventario')
        })
    })
}

export function saveCreditMovement(kwargs){
    const logCode = 'CREDIT_MOVEMENT_CREATED'
    const logDescription = `Credit movement created for purchase ${kwargs.purchase_id} and invoice number ${kwargs.invoice_number}`
    const old = {noPrevious: 'Initial creation'}
    const method = 'post'
    const url ='/api/payablescreditmovement/'
    const logModel = 'PAYABLE_CREDIT_MOVEMENT'

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
            saveLog(logCode, logModel, old, data, logDescription, kwargs.user)
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

export function saveCreditPayment(kwargs){
    const logCode = 'CREDIT_PAYMENT_CREATED'
    const logDescription = `Credit payment created for purchase ${kwargs.purchase_id} and invoice number ${kwargs.invoice_number}`
    const old = {noPrevious: 'Initial creation'}
    const method = 'post'
    const url ='/api/payablescreditpayment/'
    const logModel = 'PAYABLE_CREDIT_PAYMENT'

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
            saveLog(logCode, logModel, old, data, logDescription, kwargs.user)
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