import React from 'react'
import {connect} from 'react-redux'
const uuidv1 = require('uuid/v1')
import Warehouses from '../../general/warehouses/warehouse.jsx'

import {generalSave} from '../../../../utils/api.js'

@connect(store=>{
    return {
        usesMultiprice: store.config.globalConf.usesMultiplePrices,
        invoice_to_link: store.smart_purchase.invoice_to_link,
        active_line: store.smart_cart.cartItemActive,
        selectedWarehouse: store.warehouses.selectedWarehouse,
        current_step: store.smart_purchase.currentStep,
        do_global_price_calc: store.smart_cart.do_global_price_calc,
        credit_period: store.smart_cart.credit_period
    }
})
export default class Purchase_PriceAdjuster extends React.Component {


    componentWillMount() {

    }

    componentWillReceiveProps(nextProps){
        
        if(this.props.do_global_price_calc===false && nextProps.do_global_price_calc ===true){
            
            this.props.dispatch({type: "FETCHING_STARTED"})
            if(this.props.invoice_to_link !==null){
                for(var item of this.props.invoice_to_link.items_list){
                    // console.log("item in mount ", item)
                    this.updateUtility(
                        {
                            group: 4,
                            line: item.NumeroLinea,
                            multi: true,
                            utility1: Math.round(parseFloat(item.linked.utility1), 3),
                            utility2: Math.round(parseFloat(item.linked.utility2), 3),
                            utility3: Math.round(parseFloat(item.linked.utility3), 3)
                        })
                        
                }
                this.props.dispatch({type: "FORCE_GLOBAL_UTILITY_RECALC"})
            }
            this.props.dispatch({type: "FETCHING_DONE"})
        }

        if(!this.props.invoice_to_link && nextProps.invoice_to_link){
            console.log("invoice to link 0---> ", this.props.invoice_to_link)
            this.props.dispatch({type:"SET_CREDIT_PERIOD", 
            payload: nextProps.invoice_to_link.header.PlazoCredito})
        }
    }

    goToStepB(){
        this.props.dispatch({type: 'GO_TO_STEP', payload: 'b'})
    }

    calculateRealUtility(cost, target_utility, target_price, 
        product, updatePattern,  utility_method, round_to_coin = 5){
        
        let wanted_price = 0
      
        //determine all taxes to be applied to the product, if any
        let total_tax_fraction = 0
        if(product.use_taxes){
            total_tax_fraction += parseFloat(product.taxes)
        }
        if(product.use_taxes2){
            total_tax_fraction += parseFloat(product.taxes2  )
        }

        const total_tax_factor = 1 + total_tax_fraction / 100.0
        console.log("Total tax fraction shit--> ", total_tax_factor)
        const default_discount = 1 - parseFloat(product.pred_discount)/100.0
      
        switch(updatePattern){
          case 'byUtility':
          {
            let target_price_no_tax = 0
            if(utility_method === 'cost_based'){
              target_price_no_tax = cost * (1+target_utility/100.0)
            }else{
              target_price_no_tax = cost / (1-(target_utility/100.0))
            }
      
            let target_price_ivi = target_price_no_tax * total_tax_factor * default_discount
            //trim decimals from the price
            let int_ivi_price = target_price_ivi
            if(product.use_coin_round){
              int_ivi_price = Math.round(int_ivi_price)
            }
      
            //round to the nearest usable coin
            let coin_round_modulus = 0
            if(product.use_coin_round){
              coin_round_modulus = int_ivi_price % round_to_coin
            }
             
            wanted_price = int_ivi_price - coin_round_modulus
            console.log("Wanted price --> ", wanted_price)
      
            break
          }
      
          case 'byPrice':
          {
            let int_target_price = target_price
            let coin_round_modulus = 0
            if(product.use_coin_round){
              int_target_price = Math.round(int_target_price)
              coin_round_modulus = int_target_price  % round_to_coin
            }
             
            wanted_price = int_target_price - coin_round_modulus
            break
          }
        }
      
        //back calculate new utility
        let real_utility = 0
        if(cost<0.0001)
        {
            real_utility=1
        }else if(utility_method === 'cost_based')
        {
          real_utility = (wanted_price/(total_tax_factor*default_discount))/cost - 1
        }else
        {
          real_utility = 1- cost/(wanted_price/(total_tax_factor*default_discount))
        }
      
        return {'real_utility': real_utility*100, 'new_price': wanted_price}
      
      }

    updateUtility(update_data, e){

        //return when typing numbers, only process on Enter
        if(e!==undefined){
            if(e.key!=="Enter"){
                return
            }
        }

        let newUtility = -1
        let utility1= undefined
        let utility2= undefined
        let utility3= undefined

        if(update_data.multi===false){
            newUtility = parseFloat(e.target.value)
            ? parseFloat(e.target.value)
            : -1
        }
        
        //inject the target utility from the parameter for the mass initial set
        if(update_data.multi===true){
            utility1 = update_data.utility1
            utility2 = update_data.utility2
            utility3 = update_data.utility3
            if(utility1===-1 || utility2 === -1 || utility3===-1){
                console.log("Invalid utility")
                return
            }
        }else{
            if (newUtility === -1){
                console.log("Invalid utility single prorcess")
                return
            }
        }

        //make a deep copy of the current selected line
        let active_line = undefined
        if(update_data.line!==0){
            active_line = this.props.invoice_to_link.items_list.find(item=>{
                return item.NumeroLinea === update_data.line
            })
        }else{
            if(this.props.invoice_to_link){
                active_line = this.props.invoice_to_link.items_list.find(item=>{
                    return item.NumeroLinea === this.props.active_line
                })
            }
        }

        const new_line = JSON.parse(JSON.stringify(active_line))
        const discount = new_line.MontoDescuento!==null ? parseFloat(new_line.MontoDescuento) : 0
        const unit_price = (parseFloat(new_line.PrecioUnitario)-discount/parseFloat(new_line.Cantidad)).toFixed(5)

        switch(update_data.group){
            case 1:
            {
                const new_pricing = this.calculateRealUtility(
                    unit_price,
                    newUtility,
                    0,
                    new_line.linked,
                    'byUtility',
                    'not_cost_based'

                )
                console.log("updating utility 1 --> ", new_pricing)
                new_line.target_utility_1 = new_pricing['real_utility']
                new_line.wanted_price_1 = new_pricing['new_price']
                this.props.dispatch({type:"UPDATE_PROD_PRICING", payload: new_line})
                break
            }
            case 2:
            {
                const new_pricing = this.calculateRealUtility(
                    unit_price,
                    newUtility,
                    0,
                    new_line.linked,
                    'byUtility',
                    'not_cost_based'

                )
                console.log("updating utility 2 --> ", new_pricing)
                new_line.target_utility_2 = new_pricing['real_utility']
                new_line.wanted_price_2 = new_pricing['new_price']
                this.props.dispatch({type:"UPDATE_PROD_PRICING", payload: new_line})
                break
            }
            case 3:
            {
                const new_pricing = this.calculateRealUtility(
                    unit_price,
                    newUtility,
                    0,
                    new_line.linked,
                    'byUtility',
                    'not_cost_based'

                )
                console.log("updating utility 3 --> ", new_pricing)
                new_line.target_utility_3 = new_pricing['real_utility']
                new_line.wanted_price_3 = new_pricing['new_price']
                this.props.dispatch({type:"UPDATE_PROD_PRICING", payload: new_line})
                break
            }
            case 4:
            {
                //calculate the new price for all the three prices and to a dispatch
                const new_pricing_1 = this.calculateRealUtility(
                    unit_price,
                    utility1,
                    0,
                    new_line.linked,
                    'byUtility',
                    'not_cost_based'

                )

                const new_pricing_2 = this.calculateRealUtility(
                    unit_price,
                    utility2,
                    0,
                    new_line.linked,
                    'byUtility',
                    'not_cost_based'

                )

                const new_pricing_3 = this.calculateRealUtility(
                    unit_price,
                    utility3,
                    0,
                    new_line.linked,
                    'byUtility',
                    'not_cost_based'

                )

                new_line.target_utility_1 = new_pricing_1['real_utility']
                new_line.wanted_price_1 = new_pricing_1['new_price']

                new_line.target_utility_2 = new_pricing_2['real_utility']
                new_line.wanted_price_2 = new_pricing_2['new_price']

                new_line.target_utility_3 = new_pricing_3['real_utility']
                new_line.wanted_price_3 = new_pricing_3['new_price']

                this.props.dispatch({type:"UPDATE_PROD_PRICING", payload: new_line})
                break
            }
            default:
                console.log("Utility group invalid")
        }

    }

    updatePrice(price_group, e){
        
        //return when typing numbers, only process on Enter
        if(e.key!=="Enter"){
            return
        }

        const newPrice = parseFloat(e.target.value)
            ? parseFloat(e.target.value)
            : -1
        
        if (newPrice === -1){
            console.log("Invalid price")
            return
        }

        //make a deep copy of the current selected line
        let active_line = undefined
        if(this.props.invoice_to_link){
            active_line = this.props.invoice_to_link.items_list.find(item=>{
                return item.NumeroLinea === this.props.active_line
            })
        }
        const new_line = JSON.parse(JSON.stringify(active_line))
        console.log("Scorching new line --> ", new_line)
        const discount = new_line.MontoDescuento!==null ? parseFloat(new_line.MontoDescuento) : 0
        const unit_price = (parseFloat(new_line.PrecioUnitario)-discount/parseFloat(new_line.Cantidad)).toFixed(5)

        switch(price_group){
            case 1:
            {
                const new_pricing = this.calculateRealUtility(
                    unit_price,
                    0,
                    newPrice,
                    new_line.linked,
                    'byPrice',
                    'cost_based'

                )
                console.log("updating price 1 --> ", new_pricing)
                new_line.target_utility_1 = new_pricing['real_utility']
                new_line.wanted_price_1 = new_pricing['new_price']
                this.props.dispatch({type:"UPDATE_PROD_PRICING", payload: new_line})
                break
            }
            case 2:
            {
                const new_pricing = this.calculateRealUtility(
                    unit_price,
                    0,
                    newPrice,
                    new_line.linked,
                    'byPrice',
                    'cost_based'

                )
                console.log("updating price 2 --> ", new_pricing)
                new_line.target_utility_2 = new_pricing['real_utility']
                new_line.wanted_price_2 = new_pricing['new_price']
                this.props.dispatch({type:"UPDATE_PROD_PRICING", payload: new_line})
                break
            }
            case 3:
            {
                const new_pricing = this.calculateRealUtility(
                    unit_price,
                    0,
                    newPrice,
                    new_line.linked,
                    'byPrice',
                    'cost_based'

                )
                console.log("updating price 3 --> ", new_pricing)
                new_line.target_utility_3 = new_pricing['real_utility']
                new_line.wanted_price_3 = new_pricing['new_price']
                this.props.dispatch({type:"UPDATE_PROD_PRICING", payload: new_line})
                break
            }
            default:
                console.log("Utility group invalid")
        }

    }

    updateCreditPeriod(e){
        // if(e.key!=="Enter"){
        //     return
        // }

        const newPeriod = parseFloat(e.target.value)
        ? parseFloat(e.target.value)
        : -1
    
        if (newPeriod === -1){
            console.log("Invalid price")
            return
        }

        this.props.dispatch({type: 'SET_CREDIT_PERIOD', payload: newPeriod})
    }


    buildDuckCart(){
        console.log("Build cart like json object")
        const items = this.props.invoice_to_link.items_list.map(item=>{
            
            const qty = parseFloat(item.Cantidad)
            const discount = item.MontoDescuento!==null ? parseFloat(item.MontoDescuento) : 0
            const cost = parseFloat(item.PrecioUnitario)-discount/(qty>0?qty:1)

            return {
                applyToClient: true,
                cost: cost,
                discount: discount,
                qty: qty,
                subtotal: cost * qty,
                product: item.linked,
                uuid: uuidv1(),
                status: 'saved',
                target_utility: item.target_utility_1,
                wanted_price_ivi: item.wanted_price_1,
                target_utility_2: item.target_utility_2 ? item.target_utility_2 : item.target_utility_1,
                wanted_price_ivi_2: item.wanted_price_2 ? item.wanted_price_2 : item.wanted_price_1,
                target_utility_3: item.target_utility_3 ? item.target_utility_3 : item.target_utility_1,
                wanted_price_ivi_3: item.wanted_price_3 ? item.wanted_price_3 : item.wanted_price_1,
                transport_cost: 0,

            }
        })

        // const fuck_it_here = 3
        // return fuck_it_here;
        let cart = {
                cartHasItems: false, // var to check if cart has items
                cartItemActive: false,
                cartItems: items, // the list of items in cart
                //cartSubtotal: 0, // the subtotal including discounts without taxes
                //cartSubtotalNoDiscount: 0,
                //cartTaxes: 0,
                //cartTotal: 0, // cart total after discount and taxes
                
                discountTotal: 0, // discount in currency
                discount_mode: 'money_based',
                editable: false,
                cartTotal: parseFloat(this.props.invoice_to_link.summary.TotalVenta),
                orderTransport: 0, //the amount of transport invoiced
                cartSubtotal: parseFloat(this.props.invoice_to_link.summary.TotalVentaNeta)
                
        }

        return JSON.stringify(cart)
    }

    buildPayData(){
        console.log("Building pay data")
        let pay_data = {

        }
        if(this.props.invoice_to_link.CondicionVenta === "CREDITO" || this.props.credit_period > 0){
            pay_data["CRED"] = [{
                type: "CRED",
                amount: 0
            }]
        }else{
            pay_data["CASH"] = [{
                type: "CASH",
                amount: parseFloat(this.props.invoice_to_link.summary.TotalVenta)+0.2
            }]
        }
        console.log("pay data --> ", pay_data)
        return JSON.stringify(pay_data)
    }

    buildPay(){
        console.log("Building pay data")
        const pay = {

        }
        console.log("pay data --> ", pay)
        return JSON.stringify(pay)
    }

    applyPurchase(){
        //build the kwargs to save the purchase
        const cart = this.buildDuckCart()
        const pay_data = this.buildPayData()
        const pay = this.buildPay()
               
        const data = {
            id: '',
            update_purchase: false,
            apply: true,
            supplier_id: this.props.invoice_to_link.proveedor.id,
            warehouse_id: this.props.selectedWarehouse.id,
            cart: cart,
            pay_data: pay_data,
            pay: pay,
            invoice_number: this.props.invoice_to_link.header.Clave,
            invoice_date: this.props.invoice_to_link.header.FechaEmision.split("T")[0],
            credit_days: this.props.credit_period,
            update_pattern: 'byPrice',
            discount_mode: 'money_based',
            is_smart: true
        }

        const kwargs = {
            data:data,
            url: '/api/purchase/',
            method: 'post',
            successType: 'SMART_PURCHASE_SAVED_CORRECTLY',
            errorType: 'ERROR_LOADING_SMART_PURCHASE',
            sucessMessage: "Ingreso de compra satisfactorio.",
            errorMessage: "Error aplicando la compra."
        }
        console.log("Credit period --> ", this.props.credit_period)
        this.props.dispatch(generalSave(kwargs))
    }

    render() {

        let active_line = undefined
        if(this.props.invoice_to_link){
            active_line = this.props.invoice_to_link.items_list.find(item=>{
                return item.NumeroLinea === this.props.active_line
            })
        }
        const prod = active_line !== undefined ? active_line.linked : undefined

        let inventory = {}
        if(prod!==undefined){
            inventory = JSON.parse(prod.inventory_existent)
        }

        const inv_on_warehouse = inventory[this.props.selectedWarehouse.id] === undefined ? 0 :inventory[this.props.selectedWarehouse.id]
        
        //get product current pricing data
        const sell_price_1 = prod ? parseFloat(prod.sell_price1) : 0
        const sell_price_2 = prod ? parseFloat(prod.sell_price2) : 0
        const sell_price_3 = prod ? parseFloat(prod.sell_price3) : 0

        const utility_1 = prod ? parseFloat(prod.utility1) : 0
        const utility_2 = prod ? parseFloat(prod.utility2) : 0
        const utility_3 = prod ? parseFloat(prod.utility3) : 0


        //get the current utilities as target utilities
        let target_utility_1 = utility_1
        let target_utility_2 = utility_2
        let target_utility_3 = utility_3

        if(active_line){
            target_utility_1 = active_line.target_utility_1 ? active_line.target_utility_1 : target_utility_1
            target_utility_2 = active_line.target_utility_2 ? active_line.target_utility_2 : target_utility_2
            target_utility_3 = active_line.target_utility_3 ? active_line.target_utility_3 : target_utility_3
        }
        

        //get the wanted prices
        let wanted_price_1 = sell_price_1
        let wanted_price_2 = sell_price_2
        let wanted_price_3 = sell_price_3
        if(active_line){
            wanted_price_1 = active_line.wanted_price_1 ? active_line.wanted_price_1 : wanted_price_1
            wanted_price_2 = active_line.wanted_price_2 ? active_line.wanted_price_2 : wanted_price_2
            wanted_price_3 = active_line.wanted_price_3 ? active_line.wanted_price_3 : wanted_price_3
        }
        
        let applyPurchase = ''
        if(this.props.selectedWarehouse.id!=="00000000-0000-0000-0000-000000000000"){
            applyPurchase = <div className="purchase-prod-adjuster-actions">
            <button className='purchase-buttons-normal'
                onClick={this.applyPurchase.bind(this)}>
                Aplicar Compra
                <span> <i className='fa fa-save' /> </span>
            </button>
        </div>
        }


        let price_setter_1 = <div className="purchase-prod-adjuster-body-price">
        <div className="purchase-prod-adjuster-body-price-detail">
            <div className="purchase-prod-adjuster-body-price-detail-label">Precio</div>
            <div className="purchase-prod-adjuster-body-price-detail-money">₡ {sell_price_1.formatMoney(3, ',', '.')}</div>
            <div className="purchase-prod-adjuster-body-price-detail-arrow">>></div>
            <div className="purchase-prod-adjuster-body-price-detail-money">
                ₡ {wanted_price_1.formatMoney(0, ',', '.')}
            </div>
        </div>

        <div className="purchase-prod-adjuster-body-price-detail">
            <div className="purchase-prod-adjuster-body-price-detail-label">Utilidad</div>
            <div className="purchase-prod-adjuster-body-price-detail-percent">{utility_1} %</div>
            <div className="purchase-prod-adjuster-body-price-detail-arrow">>></div>
            <div className="purchase-prod-adjuster-body-price-detail-percent">
                {target_utility_1.toFixed(3)}
            </div>
        </div>

        <div className="purchase-prod-adjuster-body-price-detail">
            <div className="purchase-prod-adjuster-body-price-detail-label">Precio deseado</div>
                <div className="purchase-prod-adjuster-body-price-detail-input">
                    <input name="price_input1" type="number"
                        defaultValue={wanted_price_1} 
                        onKeyPress={this.updatePrice.bind(this, 1)}/>
                </div>
        </div>

        <div className="purchase-prod-adjuster-body-price-detail">
            <div className="purchase-prod-adjuster-body-price-detail-label">Utilidad deseada</div>
                <div className="purchase-prod-adjuster-body-price-detail-input">
                    <input name="utility_input1" type="number" 
                        defaultValue={target_utility_1.toFixed(2)}
                        onKeyPress={this.updateUtility.bind(this, 
                        {group:1, line:0, utility: -1, multi:false},
                        )}/>
                </div>
        </div>

    </div>;
        let price_setter_2 = '';
        let price_setter_3 = '';

        if(this.props.usesMultiprice){
            price_setter_2 = <div className="purchase-prod-adjuster-body-price">
            <div className="purchase-prod-adjuster-body-price-detail">
                <div className="purchase-prod-adjuster-body-price-detail-label">Precio 2</div>
                <div className="purchase-prod-adjuster-body-price-detail-money">₡ {sell_price_2.formatMoney(3, ',', '.')}</div>
                <div className="purchase-prod-adjuster-body-price-detail-arrow">>></div>
                <div className="purchase-prod-adjuster-body-price-detail-money">₡ {wanted_price_2.formatMoney(0, ',', '.')}</div>
                <div></div>
            </div>
            <div className="purchase-prod-adjuster-body-price-detail">
                <div className="purchase-prod-adjuster-body-price-detail-label">Utilidad 2</div>
                <div className="purchase-prod-adjuster-body-price-detail-percent">{utility_2} %</div>
                <div className="purchase-prod-adjuster-body-price-detail-arrow">>></div>
                <div className="purchase-prod-adjuster-body-price-detail-percent">{target_utility_2.toFixed(3)}</div>
            </div>

            <div className="purchase-prod-adjuster-body-price-detail">
                <div className="purchase-prod-adjuster-body-price-detail-label">Precio deseado 2</div>
                    <div className="purchase-prod-adjuster-body-price-detail-input">
                        <input name="price_input2" type="number"
                            defaultValue={wanted_price_2} 
                            onKeyPress={this.updatePrice.bind(this, 2)}/>
                    </div>
            </div>

            <div className="purchase-prod-adjuster-body-price-detail">
                <div className="purchase-prod-adjuster-body-price-detail-label">Utilidad deseada 2</div>
                    <div className="purchase-prod-adjuster-body-price-detail-input">
                        <input name="utility_input2" type="number" 
                            defaultValue={target_utility_2.toFixed(2)}
                            onKeyPress={this.updateUtility.bind(this, 
                                {group:2, line:0, utility: -1, multi:false},
                            )}/>
                    </div>
            </div>


        </div>
            price_setter_3 =  <div className="purchase-prod-adjuster-body-price">
            <div className="purchase-prod-adjuster-body-price-detail">
                <div className="purchase-prod-adjuster-body-price-detail-label">Precio 3</div>
                <div className="purchase-prod-adjuster-body-price-detail-money">₡ {sell_price_3.formatMoney(3, ',', '.')}</div>
                <div className="purchase-prod-adjuster-body-price-detail-arrow">>></div>
                <div className="purchase-prod-adjuster-body-price-detail-money">₡ {wanted_price_3.formatMoney(0, ',', '.')}</div>
            </div>
            <div className="purchase-prod-adjuster-body-price-detail">
                <div className="purchase-prod-adjuster-body-price-detail-label">Utilidad 3</div>
                <div className="purchase-prod-adjuster-body-price-detail-percent">{utility_3} %</div>
                <div className="purchase-prod-adjuster-body-price-detail-arrow">>></div>
                <div className="purchase-prod-adjuster-body-price-detail-percent">{target_utility_3.toFixed(2)}</div>
            </div>


            <div className="purchase-prod-adjuster-body-price-detail">
            <div className="purchase-prod-adjuster-body-price-detail-label">Precio deseado 3</div>
                <div className="purchase-prod-adjuster-body-price-detail-input">
                    <input name="price_input3" type="number"
                        defaultValue={wanted_price_3} 
                        onKeyPress={this.updatePrice.bind(this, 3)}/>
                </div>
            </div>

            <div className="purchase-prod-adjuster-body-price-detail">
                <div className="purchase-prod-adjuster-body-price-detail-label">Utilidad deseada 3</div>
                    <div className="purchase-prod-adjuster-body-price-detail-input">
                        <input name="utility_input3" type="number" 
                            defaultValue={target_utility_3.toFixed(2)}
                            onKeyPress={this.updateUtility.bind(this,
                                {group:3, line:0, utility: -1, multi:false},
                                )}/>
                    </div>
            </div>

        </div>
        }

        return <div className="purchase-prod-adjuster">

            <h2>Ajuste de Precios</h2>
            <div className="purchase-prod-adjuster-summary">
                <div className="purchase-prod-adjuster-summary-warehouses">
                    <Warehouses/>
                </div>
                
                <div className="purchase-prod-adjuster-summary-field">
                    <div className="purchase-prod-adjuster-summary-field-label">Existencias:</div>
                    <div className="purchase-prod-adjuster-summary-field-value">{inv_on_warehouse}</div>
                </div>
                <div className="purchase-prod-adjuster-summary-field">
                    <div className="purchase-prod-adjuster-summary-field-label">Tipo:</div>
                    <div className="purchase-prod-adjuster-summary-field-value">
                        {this.props.invoice_to_link?this.props.invoice_to_link.header.CondicionVenta : "Indefinida"}
                    </div>
                </div>
                <div className="purchase-prod-adjuster-summary-field">
                    <div className="purchase-prod-adjuster-summary-field-label">Plazo Crédito:</div>
                    <div className="purchase-prod-adjuster-summary-field-value">
                        <input name="credit_period" type="number"
                                value={this.props.credit_period} 
                                onChange={this.updateCreditPeriod.bind(this)}/>
                    </div>
                        {/* {this.props.invoice_to_link?this.props.invoice_to_link.header.PlazoCredito : "Indefinido"*/}
                </div>

                <div className="purchase-prod-adjuster-summary-field">
                    <div className="purchase-prod-adjuster-summary-field-label">Consecutivo:</div>
                    <div className="purchase-prod-adjuster-summary-field-value">
                        {this.props.invoice_to_link?this.props.invoice_to_link.header.NumeroConsecutivo : "Indefinida"}
                    </div>
                </div>

                <div className="purchase-prod-adjuster-summary-field">
                    <div className="purchase-prod-adjuster-summary-field-label">Proveedor</div>
                    <div className="purchase-prod-adjuster-summary-field-value">
                        {this.props.invoice_to_link?this.props.invoice_to_link.proveedor.name : "Indefinido"}
                    </div>
                </div>
            </div>
            <div className="purchase-prod-adjuster-body">
                
                {price_setter_1}
                {price_setter_2}
                {price_setter_3}
                
            </div>

            {applyPurchase}
        </div>
    }
}