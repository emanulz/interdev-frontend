import React from 'react'
import {connect} from 'react-redux'
import {loadGlobalConfig} from '../../../../../utils/api.js'

import FullReceipt from '../fullReceipt/main.jsx'
import CompactReceipt from '../compactReceipt/main.jsx'


@connect((store)=>{
    return {
        isVisible: store.workshopReceipt.isVisible,
        isFull: store.workshopReceipt.isFull
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
        
            const componentToMount = this.props.isFull
                ? <FullReceipt/>
                : <CompactReceipt/>
        return <div className={isVisibleClass}>
            <div className={'receipt-panel-main' + isFullClass} >
                <div className="receipt-panel-header">
                    <div>
                        Recepción Orden de Trabajo
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