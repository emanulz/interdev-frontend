import React from 'react'
import {connect} from 'react-redux'
import {savePurchase} from './actions.js'

@connect(store=>{
    return{
        user: store.user.user,
        supplier: store.suppliers.supplierSelected,
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
        const kwargs = {
            user: this.props.user,
            supplier: this.props.supplier,
            cart: this.props.cart,
            pay: this.props.pay,
            invoice_number: this.props.purchase.invoiceNumber,
            invoice_date: this.props.purchase.invoiceDate,
            credit_days: this.props.pay.creditDays,
            is_closed: apply,
            payed: this.isPayed()

        }

        savePurchase(kwargs).then(result=>{
            //dispatch bits of information to all sub reducers

            this.props.dispatch({
                type:'PURCHASE_SAVED', 
                payload:{invoiceNumber: result.invoiceNumber, invoiceDate: result.invoiceDate}
            })

        })
        
    }

    isPayed(){
        return this.props.cart.cartTotal>=(this.props.pay.cardAmount + this.props.pay.cashAmount)
    }

    render() {
        return <div className='purchase-buttons'>
            <div className='purchase-buttons-row' >
                <button className='purchase-buttons-normal' 
                onClick={this.showPayPanel.bind(this, false)}>
                    Ingresar Pago
                    <span> <i className='fa fa-money' /> </span>
                </button>

                <button className='purchase-buttons-normal' 
                onClick={this.saveInvoice.bind(this, false)}>
                    Guardar Factura
                    <span> <i className='fa fa-save' /> </span>
                </button>
            </div>

            <div className='purchase-buttons-row' >
                <button className='purchase-buttons-normal' 
                onClick={this.saveInvoice.bind(this, true)}>
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