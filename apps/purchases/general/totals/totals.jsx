import React from 'react'
import {connect} from 'react-redux'
import formatMoney from '../../../../utils/formatMoney'

@connect(store=>{
    return{
        cartItems: store.cart.cartItems,
        cartSubtotal: store.cart.cartSubtotal,
        cartTaxes: store.cart.cartTaxes,
        discountTotal: store.cart.discountTotal,
        cartTotal: store.cart.cartTotal
    }
})
export default class Totals extends React.Component {

    discountAmountChanged(e){
        const total = parseFloat(e.target.value)?parseFloat(e.target.value):-1
        if(total==-1){return}
        this.props.dispatch({type:'SET_DISCOUNT_AMOUNT', payload:total})
    }

    taxesAmountChanged(e){
        const tax = parseFloat(e.target.value)?parseFloat(e.target.value):-1
        if(tax==-1){return}
        this.props.dispatch({type:'SET_TAXES_AMOUNT', payload:tax})
    }

    render (){
        const total = this.props.cartTotal.formatMoney(2, ',', '.')
        const subtotal = this.props.cartSubtotal.formatMoney(2, ',', '.')
        console.log('Total --> ' + total)
        return <div className='totals'>
            <div className='totals-data-row'>
                <div className='totals-data-row-label' >Subtotal:</div>
                <div className='totals-data-row-value'>₡{subtotal}</div>
            </div>

            <div className='totals-data-row'>
                <div className='totals-data-row-label' >Descuento ₡:</div>
                <input className='totals-data-row-input' type='text'
                onChange={this.discountAmountChanged.bind(this)}
                value={this.props.discountTotal}/>
            </div>
            
            <div className='totals-data-row'>
                <div className='totals-data-row-label' >Impuesto ₡:</div>
                <input className='totals-data-row-input' type='text'
                onChange={this.taxesAmountChanged.bind(this)}
                value={this.props.cartTaxes} />
            </div>

            <div className='totals-data-row'>
                <div className='totals-data-row-label' >Total:</div>
                <div className='totals-data-row-value'>₡{total}</div>
            </div>
        </div>
    }
}