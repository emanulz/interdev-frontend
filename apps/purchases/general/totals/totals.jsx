import React from 'react'
import {connect} from 'react-redux'

@connect(store=>{
    return{
        cartItems: store.purchase_cart.cartItems,
        cartSubtotal: store.purchase_cart.cartSubtotal,
        cartTaxes: store.purchase_cart.cartTaxes,
        discountTotal: store.purchase_cart.discountTotal,
        cartTotal: store.purchase_cart.cartTotal,
        creditDays: store.pay.creditDays,
        invoiceDate: store.purchase.invoiceDate,
        invoiceNumber: store.purchase.invoiceNumber,
        is_closed: store.purchase.is_closed,
        orderTransport: store.purchase_cart.orderTransport,
        purchase_total: store.purchase.purchase_total,
        order_transport: store.purchase.order_transport,
        purchase: store.purchase
    }
})
export default class Totals extends React.Component {

    transportAmountChanged(e){
        const transport = parseFloat(e.target.value) ? parseFloat(e.target.value) : -1
        if (transport == -1){
            this.props.dispatch({type:'SET_TRANSPORT_AMOUNT', payload:0})
            return
        }
        this.props.dispatch({type:'SET_TRANSPORT_AMOUNT', payload:transport})
        
    }

    taxesAmountChanged(e){
        if(e.target.value===''){this.props.dispatch({type:'SET_TAXES_AMOUNT', payload:0})}
        const tax = parseFloat(e.target.value)?parseFloat(e.target.value):-1
        if(tax==-1){return}
        this.props.dispatch({type:'SET_TAXES_AMOUNT', payload:tax})
    }

    invoiceNumberChanged(e){
        this.props.dispatch({type:'INVOICE_NUMBER_CHANGED', payload:e.target.value})
    }

    invoiceDateChanged(e){
        this.props.dispatch({type:'INVOICE_DATE_CHANGED', payload:e.target.value})
    }

    render (){

        let cart_total_raw = this.props.cartTotal;
        if (isNaN(cart_total_raw)){
            cart_total_raw = parseFloat(this.props.purchase_total)
        }
        // console.log("Purchase in totals --> ", this.props.purchase)
        let total = cart_total_raw.formatMoney(2, ',', '.')
        

        const subtotal = this.props.cartSubtotal.formatMoney(2, ',', '.')
        let taxes = this.props.cartTaxes
        
        if(!this.props.cartTaxes){
            taxes = parseFloat(this.props.purchase_total) - (this.props.cartSubtotal -this.props.discountTotal) - parseFloat(this.props.order_transport)
            taxes.formatMoney(2, ',', '.')
        }

        return <div className='totals'>
            <div className='totals-data-row'>
                <div className='totals-data-row-label' >Número de Factura:</div>
                <input className='totals-data-row-input' type="text"
                onChange={this.invoiceNumberChanged.bind(this)}
                disabled={this.props.is_closed}
                value={this.props.invoiceNumber}/>
            </div>
            <div className='totals-data-row'>
                <div className='totals-data-row-label' >Fecha Factura:</div>
                <input className='totals-data-row-input' type="date"
                onChange={this.invoiceDateChanged.bind(this)}
                disabled={this.props.is_closed}
                value={this.props.invoiceDate}/>
            </div>
            <div className='totals-data-row'>
                <div className='totals-data-row-label' >Subtotal:</div>
                <div className='totals-data-row-value'>₡{subtotal}</div>
            </div>

            <div className='totals-data-row'>
                <div className='totals-data-row-label' >Descuento ₡:</div>
                <div className='totals-data-row-input'>{this.props.discountTotal}</div>
            </div>
            <div className='totals-data-row'>
                <div className='totals-data-row-label' >Transporte ₡:</div>
                <input className='totals-data-row-input' type='number'
                onChange={this.transportAmountChanged.bind(this)}
                disabled={this.props.is_closed}
                value={this.props.orderTransport} />
            </div>
            <div className='totals-data-row'>
                <div className='totals-data-row-label' >Impuesto ₡:</div>
                <input className='totals-data-row-input' type='number'
                onChange={this.taxesAmountChanged.bind(this)}
                disabled={this.props.is_closed}
                value={taxes} />
            </div>

            <div className='totals-data-row'>
                <div className='totals-data-row-label' >Total:</div>
                <div className='totals-data-row-value'>₡{total}</div>
            </div>

        </div>
    }
}