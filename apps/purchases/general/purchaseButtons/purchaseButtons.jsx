import React from 'react'
import {connect} from 'react-redux'
import {savePurchase} from './actions.js'

import { inspect } from 'util'

@connect(store=>{
    return{
        user: store.user.user,
        supplier: store.suppliers.supplierSelected,
        warehouse: store.warehouses.selectedWarehouse,
        cart:store.cart,
        pay:store.pay,
        purchase:store.purchase,
        discount_mode: store.cart.discount_mode,

    }
})
export default class PurchaseButtons extends React.Component {

    showPayPanel(){
        this.props.dispatch({type:'SHOW_PAY_PANEL'})
    }

    saveInvoice(apply, e){
        //if the objects has an id, it must be patched from now on

        const kwargs = {
            id:this.props.purchase.purchase_id,
            supplier_id: this.props.supplier.id,
            warehouse_id: this.props.warehouse.id,
            cart: this.props.cart,
            pay: this.props.pay,
            invoice_number: this.props.purchase.invoiceNumber,
            invoice_date: this.props.purchase.invoiceDate,
            credit_days: this.props.pay.creditDays,
            apply: apply,
            update_purchase: false,
            discount_mode: this.props.discount_mode,
        }
        if(this.props.purchase.purchase_id !== ''){
            //this should be a patch
            kwargs.update_purchase = true
        }
        savePurchase(kwargs).then(result=>{
            this.props.dispatch({type: 'PURCHASE_SAVED', 
            payload:{ id: result.id, consecutive: result.consecutive , is_closed: result.is_closed}})
            let callback = ()=>{}
            let message = 'Compra Guardada Correctamente. Pendiente su aplicación.'
            if(result.is_closed){
                callback = ()=>{
                    window.location.href=`/purchases/purchase/${result.consecutive}`
                }
                message = "Compra aplicada correctamente."
            }

            alertify.alert('Éxito', message, callback)
        })
        
    }


    printReport(){
        //check if the report is already closed, do not allow 
        if(!this.props.purchase.is_closed){
            this.props.dispatch({type:'CANT_PRINT_NOT_CLOSED_PURCHASE'})
            return
        }
        this.props.dispatch({type:'SHOW_RECEIPT_PANEL'})
    }

    render() {

        const disabled_save_class = this.props.purchase.is_closed 
        ? 'purchase-buttons-normal-disabled'
        : 'purchase-buttons-normal'

        return <div className='purchase-buttons'>
            <div className='purchase-buttons-row' >
                <button className='purchase-buttons-normal' 
                onClick={this.showPayPanel.bind(this, false)}>
                    Ingresar Pago
                    <span> <i className='fa fa-money' /> </span>
                </button>

                <button className={disabled_save_class} 
                onClick={this.saveInvoice.bind(this, false)}
                disabled={this.props.purchase.is_closed}>
                    Guardar Factura
                    <span> <i className='fa fa-save' /> </span>
                </button>
            </div>

            <div className='purchase-buttons-row' >
                <button className={disabled_save_class} 
                onClick={this.saveInvoice.bind(this, true)}
                disabled={this.props.purchase.is_closed}>
                    Aplicar Factura
                    <span> <i className='fa fa-check' /> </span>
                </button>

                <button className='purchase-buttons-normal' 
                onClick={this.printReport.bind(this, true)}>
                    Imprimir Ingreso
                    <span> <i className='fa fa-print' /> </span>
                </button>
            </div>
        </div>
    }
}