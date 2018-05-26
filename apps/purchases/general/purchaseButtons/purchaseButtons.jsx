import React from 'react'
import {connect} from 'react-redux'
import {savePurchase, saveInventoryTransaction} from './actions.js'
import { inspect } from 'util';

@connect(store=>{
    return{
        user: store.user.user,
        supplier: store.suppliers.supplierSelected,
        warehouse: store.warehouses.selectedWarehouse,
        cart:store.cart,
        pay:store.pay,
        purchase:store.purchase,

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
            user: this.props.user,
            supplier: this.props.supplier,
            warehouse: this.props.warehouse,
            cart: this.props.cart,
            pay: this.props.pay,
            invoice_number: this.props.purchase.invoiceNumber,
            invoice_date: this.props.purchase.invoiceDate,
            credit_days: this.props.pay.creditDays,
            is_closed: apply,
            payed: this.isPayed()
        }
        if(this.props.purchase.purchase_id !== ''){
            //this should be a patch
            kwargs.old = this.props.purchase.old
        }
        let purchase_result
        savePurchase(kwargs).then(result=>{
             purchase_result = result
            console.log('Apply here ' + apply)
            if(apply){
                //generate the movements
                const cart = JSON.parse(result.cart)
                const promises = cart.cartItems.map(item=>{
                    
                    const kwargs = {
                        user:this.props.user,
                        item:item,
                        warehouse:this.props.warehouse,
                        invoice_number: this.props.purchase.invoiceNumber,
                        purchase_id: this.props.purchase.purchase_id,
                    }
                    return saveInventoryTransaction(kwargs)
                })

                Promise.all(promises).then(result =>{
                    alertify.alert('Éxito', 'Compra y Movimientos de Inventario Guardados Satisfactoriamente.')
                })

            }
        })
        
    }

    isPayed(){
        return this.props.cart.cartTotal>=(this.props.pay.cardAmount + this.props.pay.cashAmount)
    }

    render() {

        const disabled_save_class = this.props.purchase.is_closed 
        ? 'purchase-buttons-normal-disabled'
        : 'pruchase-buttons-normal'

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

                <button className='purchase-buttons-normal' >
                    Facturas Incompletas
                    <span> <i className='fa fa-exclamation' /> </span>
                </button>
            </div>
        </div>
    }
}