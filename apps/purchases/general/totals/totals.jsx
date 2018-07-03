import React from 'react'
import {connect} from 'react-redux'

@connect(store=>{
    return{
        cartItems: store.cart.cartItems,
        cartSubtotal: store.cart.cartSubtotal,
        cartTaxes: store.cart.cartTaxes,
        discountTotal: store.cart.discountTotal,
        cartTotal: store.cart.cartTotal,
        creditDays: store.pay.creditDays,
        invoiceDate: store.purchase.invoiceDate,
        invoiceNumber: store.purchase.invoiceNumber,
        is_closed: store.purchase.is_closed,
        orderTransport: store.cart.orderTransport,
        
    }
})
export default class Totals extends React.Component {

    transportAmountChanged(e){
        const transport = parseFloat(e.target.value)?parseFloat(e.target.value):-1
        if (transport == -1)return
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
        const total = this.props.cartTotal.formatMoney(2, ',', '.')
        const subtotal = this.props.cartSubtotal.formatMoney(2, ',', '.')
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
                <input className='totals-data-row-input' type='text'
                onChange={this.transportAmountChanged.bind(this)}
                disabled={this.props.is_closed}
                value={this.props.orderTransport} />
            </div>
            <div className='totals-data-row'>
                <div className='totals-data-row-label' >Impuesto ₡:</div>
                <input className='totals-data-row-input' type='text'
                onChange={this.taxesAmountChanged.bind(this)}
                disabled={this.props.is_closed}
                value={this.props.cartTaxes} />
            </div>

            <div className='totals-data-row'>
                <div className='totals-data-row-label' >Total:</div>
                <div className='totals-data-row-value'>₡{total}</div>
            </div>

        </div>
    }
}