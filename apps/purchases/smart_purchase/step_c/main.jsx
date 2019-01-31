import React from 'react'
import {connect} from 'react-redux'

//import user components
import Purchase_Prod_Cart from '../purchase_prod_cart/main.jsx'
import Purchase_PriceAdjuster from '../purchase_price_adjuster/main.jsx'

@connect(store=>{
    return {
        currentStep: store.smart_purchase.currentStep
    }
})
export default class StepC extends React.Component {


    componentWillMount() {

    }

    render() {
        const visibility_class = this.props.currentStep === "c" ? "" : " step-hidden"
        return <div className={'purchase_step stepC' + visibility_class}>
            <Purchase_Prod_Cart />
            <Purchase_PriceAdjuster />
        </div>
    }
}