import React from 'react'
import {connect} from 'react-redux'

import Purchase_Loader from '../purchase_loader/main.jsx'
import Doc_Summary from '../doc_summary/main.jsx'
import Summary_Actions from '../summary_actions/main.jsx'
import SupplierLinker from '../supplier_linker/main.jsx'
import SupplierLinkerConfirmation from '../supplier_linker_confirmation/main.jsx'

@connect(store=>{
    return {
        currentStep: store.smart_purchase.currentStep
    }
})
export default class StepA extends React.Component {


    componentWillMount() {

    }

    render() {
        const visibility_class = this.props.currentStep === "a" ? "" : " step-hidden"
        return <div className={'purchase_step stepA' + visibility_class}>
            <Purchase_Loader/>
            <Doc_Summary />
            <Summary_Actions />
            <SupplierLinker />
            <SupplierLinkerConfirmation />
        </div>
    }
}