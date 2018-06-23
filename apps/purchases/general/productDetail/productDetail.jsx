import React from 'react'
import {connect} from 'react-redux'
import {updateItem} from '../product/actions.js'

@connect(store=>{
    return {
        cartItemActive: store.cart.cartItemActive,
        cartItems: store.cart.cartItems,
        orderTransport: store.cart.orderTransport,
    }
})
export default class ProductDetail extends React.Component {

    updateSelectedUtility(id, e){
        if(this.props.cartItemActive){
            const new_utility = parseFloat(e.target.value)
            ? parseFloat(e.target.value)
            : -1
            if (new_utility == -1){
                return
            }
            const index = this.props.cartItems.findIndex(item=>item.product.code == id)
            const line = this.props.cartItems[index]
            const kwargs = {
                id: line.uuid,
                is_search_uuid: true,
                itemsInCart: this.props.cartItems,
                orderTransport: this.props.orderTransport,
                target_utility: new_utility
            }
            this.props.dispatch(updateItem(kwargs))
        }

    }


    updateWantedPrice(id, e){
        if(this.props.cartItemActive){
            const newWantedPrice = parseFloat(e.target.value)
            ? parseFloat(e.target.value)
            : -1

            if(newWantedPrice == -1){
                return
            }

            const index = this.props.cartItems.findIndex(item=>item.product.code == id)
            const line = this.props.cartItems[index]
            const kwargs = {
                id: line.uuid,
                is_search_uuid: true,
                itemsInCart: this.props.cartItems,
                orderTransport: this.props.orderTransport,
                target_price: newWantedPrice
            }
            this.props.dispatch(updateItem(kwargs))
        }
    }

    updateWantedPriceOnEnter(id, e){
        if(e.key =="Enter"){
            console.log("Key --> " +  e.key)
            this.updateWantedPrice(id, e)
        }

    }

    updateWantedUtilityOnEnter(id, e){
        if(e.key =="Enter"){
            console.log("Key --> " +  e.key)
            this.updateSelectedUtility(id, e)
        }

    }

    render() {
        const prod_code = this.props.cartItemActive ? this.props.cartItemActive : ''
        let cart_line = ''
        let index = -1

        if (this.props.cartItemActive){
            index =  this.props.cartItems.findIndex(item=> item.product.code == prod_code)
            cart_line = this.props.cartItems[index]
        }
        let description = ''
        let current_price_tax = ''
        let current_cost = ''
        let current_utility = ''
        let new_price_ivi = ''
        let new_cost = ''
        let new_utility = ''
        if(index != -1){
            description = cart_line.product.description
            current_price_tax = (cart_line.product.sell_price)
            current_cost = cart_line.product.cost.toFixed(2)
            current_utility = (cart_line.product.utility*100).toFixed(2)

            new_cost = (cart_line.subtotal / cart_line.qty).toFixed(2)
            new_utility = cart_line.real_utility
            new_price_ivi = cart_line.wanted_price_ivi
        }
        
        
        return <div className='productDetail'>
            <h1>Detalle actualización de Precio</h1>

            <div className='productDetail-data-row'>
                <div className="productDetail-data-row-label">Código:</div>
                <div className="productDetail-data-row-value"> {prod_code} </div>
            </div>

            <div className='productDetail-data-row'>
                <div className="productDetail-data-row-label">Descripción:</div>
                <div className="productDetail-data-row-value"> {description} </div>
            </div>

            <div className='productDetail-data-row'>
                <div className="productDetail-data-row-label">Costo Actual:</div>
                <div className="productDetail-data-row-value"> {current_cost} </div>
            </div>

            <div className='productDetail-data-row'>
                <div className="productDetail-data-row-label">Utilidad Actual</div>
                <div className="productDetail-data-row-value"> {current_utility} </div>
                
                
            </div>

            <div className='productDetail-data-row'>
                <div className="productDetail-data-row-label">Precio Actual:</div>
                <div className="productDetail-data-row-value"> {current_price_tax} </div>
            </div>

            <div className='productDetail-data-row'>
                <div className="productDetail-data-row-label">Nuevo Costo</div>
                <div className="productDetail-data-row-value"> {new_cost} </div>
            </div>

            <div className='productDetail-data-row'>
                <div className="productDetail-data-row-label">Utilidad Deseada</div>
                <input name="utility_input" type="number" onChange={this.updateSelectedUtility.bind(this, this.props.cartItemActive)}
                onKeyPress={this.updateWantedUtilityOnEnter.bind(this, this.props.cartItemActive)}/>
                {/*<div className="productDetail-data-row-value"> {new_utility} </div>*/}
                
            </div>
            <div className='productDetail-data-row'>
                <div className="productDetail-data-row-label">Precio Deseado</div>
                <input name="utility_input" type="number"  onChange={this.updateWantedPrice.bind(this, this.props.cartItemActive)}
                onKeyPress={this.updateWantedPriceOnEnter.bind(this, this.props.cartItemActive)}/>
                {/*<div className="productDetail-data-row-value"> {new_utility} </div>*/}
            </div>

            <div className='productDetail-data-row'>
                <div className="productDetail-data-row-label">Nueva Utilidad</div>
                <div className="productDetail-data-row-value"> {new_utility} </div>
            </div>
            <div className='productDetail-data-row'>
                <div className="productDetail-data-row-label">Nuevo Precio</div>
                <div className="productDetail-data-row-value"> {new_price_ivi} </div>
            </div>
        </div>
    }
}