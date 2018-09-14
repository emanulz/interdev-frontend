import React from 'react'
import {connect} from 'react-redux'
import {updateItem} from '../product/actions.js'

@connect(store=>{
    return {
        cartItemActive: store.cart.cartItemActive,
        cartItems: store.cart.cartItems,
        orderTransport: store.cart.orderTransport,
        cartSubtotal: store.cart.cartSubtotal,
        discount_mode: store.cart.discount_mode,
        selected_warehouse: store.warehouses.selectedWarehouse
    }
})
export default class ProductDetail extends React.Component {

    componentWillReceiveProps(nextProps){
        if(this.props.orderTransport !== nextProps.orderTransport){
            let e ={}
            e.target={}
            for(let line of this.props.cartItems){
                e.target.value = line.wanted_price_ivi
                e.target.orderTransport = nextProps.orderTransport
                e.target.discount_mode = this.props.discount_mode
                this.updateWantedPrice(line.product.code, e)
            }
        }else if(this.props.discount_mode !== nextProps.discount_mode){
            let e ={}
            e.target={}
            for(let line of this.props.cartItems){
                e.target.value = line.wanted_price_ivi
                e.target.orderTransport = this.props.orderTransport
                e.target.discount_mode = nextProps.discount_mode
                this.updateWantedPrice(line.product.code, e)
            }
        }

    }

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
                cartSubtotal: this.props.cartSubtotal,
                discount_mode: this.props.discount_mode,
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
                orderTransport: e.target.orderTransport==undefined?this.props.orderTransport:e.target.orderTransport,
                cartSubtotal: this.props.cartSubtotal,
                discount_mode: e.target.discount_mode==undefined?this.props.discount_mode:e.target.discount_mode,
                target_price: newWantedPrice
            }
            this.props.dispatch(updateItem(kwargs))
        }
    }

    updateWantedPriceOnEnter(id, e){
        if(e.key =="Enter"){
            this.updateWantedPrice(id, e)
        }

    }

    updateWantedUtilityOnEnter(id, e){
        if(e.key =="Enter"){
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
        let transport_cost = ''
        let product_existence = ''

        if(index != -1){
            description = cart_line.product.description
            let selected_warehouse =  this.props.selected_warehouse['id']
            //obtain the current existences on the selected warehouse
            try{
                console.log("earehouse ", selected_warehouse)
                console.log("cart line", cart_line)
                product_existence = JSON.parse(cart_line.product.inventory_existent)[selected_warehouse]
            }catch(err){
                console.log("Error parsing product existence")
                product_existence = cart_line.product.inventory_existent[selected_warehouse]
            }
            

            current_price_tax = (cart_line.product.sell_price)
            current_cost = cart_line.product.cost.toFixed(2)
            current_utility = (cart_line.product.utility*100).toFixed(2)
            transport_cost = (cart_line.transport_cost?cart_line.transport_cost:0).toFixed(2)
            new_cost = (cart_line.cost?cart_line.cost:cart_line.subtotal/cart_line.qty).toFixed(2)
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
                <div className="productDetail-data-row-label">Existencia:</div>
                <div className="productDetail-data-row-value"> {product_existence} </div>
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
            <hr/>

            <div className='productDetail-data-row'>
                <div className="productDetail-data-row-label">Nuevo Costo</div>
                <div className="productDetail-data-row-value"> {new_cost} </div>
            </div>
            
            <div className='productDetail-data-row'>
                <div className="productDetail-data-row-label">Fracción Transporte</div>
                <div className="productDetail-data-row-value"> {transport_cost} </div>
            </div>

            <div className='productDetail-data-row'>
                <div className="productDetail-data-row-label">Utilidad Deseada</div>
                <input name="utility_input" type="number" onChange={this.updateSelectedUtility.bind(this, this.props.cartItemActive)}
                onKeyPress={this.updateWantedUtilityOnEnter.bind(this, this.props.cartItemActive)}/>
                
            </div>
            <div className='productDetail-data-row'>
                <div className="productDetail-data-row-label">Precio Deseado</div>
                <input name="utility_input" type="number"  onChange={this.updateWantedPrice.bind(this, this.props.cartItemActive)}
                onKeyPress={this.updateWantedPriceOnEnter.bind(this, this.props.cartItemActive)}/>
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