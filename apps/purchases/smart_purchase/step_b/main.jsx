import React from 'react'
import {connect} from 'react-redux'

//import user components
import StepB_Header from '../header_step_b/main.jsx'
import ProductLinkerList from '../product_linker_list/main.jsx'
import ProdLinkingActions from '../prod_linking_actions/main.jsx'
import ProductLinker from '../product_linker/main.jsx'

@connect(store=>{
    return {
        currentStep: store.smart_purchase.currentStep
    }
})
export default class StepB extends React.Component {


    componentWillMount() {

    }

    render() {
        const visibility_class = this.props.currentStep === "b" ? "" : " step-hidden"
        return <div className={'purchase_step stepB' + visibility_class}>
            <StepB_Header />
            <div className="stepb-products">
                <ProductLinkerList class_name="product-pending-list" 
                    name="Productos Pendientes de Enlazar"/>
                    <hr/>
                <ProductLinkerList class_name="product-linked-list" 
                    name="Productos Enlazados"/>
            </div>
            
            <ProdLinkingActions />
            < ProductLinker />

        </div>
    }
}