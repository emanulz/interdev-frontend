import React from 'react'
import {connect} from 'react-redux'
import Cart from '../../general/cart/cart.jsx'
import Product from '../../general/product/product.jsx'


@connect(store=>{
    return {
        fullWidth:store.purchase.fullWidth
    }
})
export default class Content extends React.Component {

    toggleWidth() {
        this.props.dispatch({type:'TOGGLE_FULL_WIDTH'})

    }

    render() {
        const contentClass = this.props.fullWidth ? 'purchase-content fullWidth' : 'purchase-content'

        return <div className={contentClass}>
            <div className="purchase-content-product">
                <Product/>
            </div>

            <div className="purchase-content-cart">
                <Cart/>
            </div>
        </div>
    }
}
