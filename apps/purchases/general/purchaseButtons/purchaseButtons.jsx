import React from 'react'
import {connect} from 'react-redux'
import {savePurchase, saveInventoryTransaction, saveCreditPayment,saveCreditMovement} from './actions.js'
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
            supplier_id: this.props.supplier.id,
            warehouse_id: this.props.warehouse.id,
            cart: this.props.cart,
            pay: this.props.pay,
            invoice_number: this.props.purchase.invoiceNumber,
            invoice_date: this.props.purchase.invoiceDate,
            credit_days: this.props.pay.creditDays,
            apply: apply,
            payed: this.isPayed(),
            update_purchase: false
        }
        if(this.props.purchase.purchase_id !== ''){
            //this should be a patch
            kwargs.update_purchase = true
        }
        savePurchase(kwargs).then(result=>{
            if(apply){
                //generate the movements
                const cart = JSON.parse(result.cart)
                const pay = JSON.parse(result.pay)
                const supplier = JSON.parse(result.supplier)
                const promises = cart.cartItems.map(item=>{
                    const kwargs = {
                        user: this.props.user,
                        item: item,
                        warehouse: result.warehouse,
                        invoice_number: result.invoice_number,
                        purchase_id: result.id,
                    }
                    return saveInventoryTransaction(kwargs)
                })

                //create the credit movement if necessary

                const cart_total = cart.cartTotal
                let payed_amount = 0
                switch(pay.payMethod){
                    case 'CASH':
                    {
                        payed_amount = pay.cashAmount
                        break
                    }
                    case 'CARD':
                    {
                        payed_amount = pay.cardAmount
                        break
                    }

                }
                if(cart_total-payed_amount>0){

                    //make a credit movement for the full amount
                    const fullKwargs = {
                        supplier_id: supplier.id,
                        purchase_id: result.id,
                        payment_id: '',
                        movement_type: 'CRED',
                        amount: cart_total
                    }
                    saveCreditMovement(fullKwargs).then(cred_mov=>{

                        if(payed_amount>0){
                            //make another credit movement for the money paid at purchase time
                            const creditKwargs = {
                                purchase: result,
                                user: result.user,
                                supplier: result.supplier,
                                supplier_id: supplier.id,
                                amount: payed_amount,
                                invoice_number: result.invoice_number
                            }     
                            saveCreditPayment(creditKwargs).then(payment=>{
                                //make a credit movement type debit for the money paid at purchase time
                                
                                const movementKwargs = {
                                    supplier_id: payment.supplier_id,
                                    purchase_id: JSON.parse(payment.purchase).id,
                                    payment_id: payment.id,
                                    movement_type: 'DEBI',
                                    amount: payed_amount
                                }
                                promises.push(saveCreditMovement(movementKwargs))
                                
                            })
                        }

                    })

                }


                Promise.all(promises).then(result =>{
                    alertify.alert('Éxito', 'Compra y Movimientos de Inventario Guardados Satisfactoriamente.')
                })

            }else{
                alertify.alert('Éxito', 'Compra Guardada Correctamente. Pendiente su aplicación')
            }
        })
        
    }

    isPayed(){
        return this.props.cart.cartTotal>=(this.props.pay.cardAmount + this.props.pay.cashAmount)
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

                <button className='purchase-buttons-normal' >
                    Facturas Incompletas
                    <span> <i className='fa fa-exclamation' /> </span>
                </button>
            </div>
        </div>
    }
}