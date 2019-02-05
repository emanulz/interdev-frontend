import React from 'react'
import {connect} from 'react-redux'

@connect(store=>{
    return {
        invoice_to_link: store.smart_purchase.invoice_to_link,
        active_line: store.smart_cart.cartItemActive,
    }
})
export default class Purchase_Prod_Cart extends React.Component {


    componentWillMount() {

    }

    goToStepB(){
        this.props.dispatch({type: 'GO_TO_STEP', payload: 'b'})
    }

    setItemActive(line_number, e){
        this.props.dispatch({type:"SET_PRODUCT_ACTIVE_IN_CART", payload: line_number})
    }

    buildCartItems(){

        const items = this.props.invoice_to_link !==null ? this.props.invoice_to_link.items_list : []
        const disp_items = items.map(item=>{
            const qty = parseFloat(item.Cantidad).toFixed(2)
            console.log("Fucking discount --> ", item.MontoDescuento)
            const discount = item.MontoDescuento!==null?parseFloat(item.MontoDescuento):0
            const unit_price = (parseFloat(item.PrecioUnitario)-discount/qty).toFixed(5)

            let line_class = "purchase-prod-cart-cont-item"
            if (item.NumeroLinea === this.props.active_line){
                line_class += " prod-cart-active"
            }

            return <div className={line_class} key={item.linked.id}
                onClick={this.setItemActive.bind(this, item.NumeroLinea)}>
                        <div className="purchase-prod-cart-cont-code">
                            {item.linked.code}
                        </div>
                        <div className="purchase-prod-cart-cont-desc">
                            {item.linked.description}
                        </div>
                        <div className="purchase-prod-cart-cont-qty">
                            {qty}
                        </div>
                        <div className="purchase-prod-cart-cont-costund" >
                            {unit_price}
                        </div>
                        <div className="purchase-prod-cart-cont-discount">
                            {item.MontoDescuento!==null?parseFloat(item.MontoDescuento):0}
                        </div>
                        <div className="purchase-prod-cart-cont-tax">
                            {parseFloat(item.Impuesto)}   
                        </div>
                        <div className="purchase-prod-cart-cont-subtotal">
                            {(unit_price*qty).toFixed(5)}
                        </div>
            </div>
        })

        return disp_items
    }

    render() {


        const items = this.buildCartItems()
    
        return <div className="purchase-prod-cart">
            <div className="stepc-header-legend">
                <i className="fa fa-arrow-left fa2x"
                 onClick={this.goToStepB.bind(this)}></i>
                <h1>Carga de mercadería y ajuste de precios</h1>
            </div>
            <div className="purchase-prod-cart-cont">
                    <div className="purchase-prod-cart-cont-header">
                        <div className="purchase-prod-cart-cont-code">
                            CÓD.
                        </div>
                        <div className="purchase-prod-cart-cont-desc">
                            DESC.
                        </div>
                        <div className="purchase-prod-cart-cont-qty">
                            CANT.
                        </div>
                        <div className="purchase-prod-cart-cont-costund" >
                            COSTO UND.
                        </div>
                        <div className="purchase-prod-cart-cont-discount">
                            DESCUENTO CRC.
                        </div>
                        <div className="purchase-prod-cart-cont-tax">
                            IMPUESTO
                        </div>
                        <div className="purchase-prod-cart-cont-subtotal">
                            SUBTOTAL
                        </div>
                    </div>
                    <div className="purchase-prod-cart-cont-items">
                        {items}
                    </div>
                    
                </div>
        </div>
    }
}