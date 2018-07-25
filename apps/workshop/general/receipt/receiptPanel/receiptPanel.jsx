import React from 'react'
import {connect} from 'react-redux'
import {loadGlobalConfig} from '../../../../../utils/api.js'

import FullReceipt from '../fullReceipt/main.jsx'
import CompactReceipt from '../compactReceipt/main.jsx'
import PartRequestReceipt from '../partRequest/main.jsx'

import WarrantyBDReceipt from '../warrantyBDReceipt/main.jsx'
import WarrantyReceipt from '../warrantyCloseReceipt/main.jsx'
import NoRepairReceipt from '../noRepairReceipt/main.jsx'


@connect((store)=>{
    return {
        isVisible: store.workshopReceipt.isVisible,
        isFull: store.workshopReceipt.isFull,
        receipt_to_print: store.workshopReceipt.receipt_to_print
    }
})
export default class ReceiptPanel extends React.Component {

    componentWillMount () {
        this.props.dispatch(loadGlobalConfig('company', false, 'FETCH_CONFIG_FULFILLED', 'FETCH_CONFIG_REJECTED'))
    }

    hidePanel(){
        this.props.dispatch({type:'HIDE_RECEIPT_PANEL'})
    }

    printPanel(){
        window.printDiv('receipt-print', ['/static/bundles/css/workshop.css'])
    }

    render() {

        const isVisibleClass = this.props.isVisible
            ? 'receipt-panel is-visible'
            : 'receipt-panel'
        const isFullClass = this.props.isFull
            ? ''
            : ' compact-receipt-on'
        
        let componentToMount = ''
        let receipt_request_header = ''
        switch(this.props.receipt_to_print)
        {
            case 'part_request_receipt':
            {
                componentToMount =  <PartRequestReceipt />
                receipt_request_header = "Imprimir Requisición de Parte"
                break
            }
            case 'reception_receipt':
            {
                receipt_request_header = "Imprimir Ingreso a Taller"
                componentToMount = this.props.isFull
                ? <FullReceipt/>
                : <CompactReceipt/>
                break
            }
            case 'internal_warranty':
            {
                receipt_request_header = "Imprimir Cierre de Garantía"
                componentToMount = <WarrantyReceipt/>
                break
            }
            case 'bd_warranty':
            {
                receipt_request_header = "Imprimir Cierre de Garantía B&D"
                componentToMount = <WarrantyBDReceipt/>
                break
            }
            case 'no_reapair':
            {
                receipt_request_header = "Imprimir Cierre sin Reparación"
                componentToMount = <NoRepairReceipt/>
                break
            }
        }
        // if(!this.props.isPartRequestReceipt){
        //     componentToMount = this.props.isFull
        //     ? <FullReceipt/>
        //     : <CompactReceipt/>
        // }else{
        //     componentToMount = <PartRequestReceipt/>
        // }

        

        return <div className={isVisibleClass}>
            <div className={'receipt-panel-main' + isFullClass} >
                <div className="receipt-panel-header">
                    <div>
                        {receipt_request_header}
                    </div>
                    <div>
                        <i onClick={this.hidePanel.bind(this)} className='fa fa-times'/>
                        <i onClick={this.printPanel.bind(this)} className='fa fa-print'/>
                    </div>
                </div>

                <div id='receipt-print' className={'receipt-panel-container' + isFullClass}>
                    {componentToMount}
                </div>
            </div>   
        </div>
        

    }
}