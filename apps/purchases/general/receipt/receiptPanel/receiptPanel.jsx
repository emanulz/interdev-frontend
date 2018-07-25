import React from 'react'
import {connect} from 'react-redux'
import {loadGlobalConfig} from '../../../../../utils/api.js'

import PurchaseReport from '../purchaseReport/main.jsx'

@connect(store=>{
    return {
        isVisible: store.purchaseReceipt.isVisible,

    }
})
export default class ReceiptPanel  extends React.Component {

    componentWillMount(){
        this.props.dispatch(loadGlobalConfig('company', false, 'FETCH_CONFIG_FULFILLED', 'FETCH_CONFIG_REJECTED'))
    }


    hidePanel(){
        this.props.dispatch({type:'HIDE_RECEIPT_PANEL'})
    }

    printPanel(){
        window.printDiv('report-print', ['/static/bundles/css/purchases.css'])
    }

    render(){
        const isVisibleClass = this.props.isVisible
            ? 'report-panel is-visible'
            : 'report-panel'

            return <div className={isVisibleClass}>
                <div className={'report-panel-main'}>
                    <div className="report-panel-header">
                        <div>
                            Reporte de Ingreso de Producto para Impresión de Etiquetas
                        </div>

                        <div>
                            <i onClick={this.hidePanel.bind(this)} className='fa fa-times'/>
                            <i onClick={this.printPanel.bind(this)} className='fa fa-print'/>
                        </div>
                        <div id='report-print' className={'report-panel-container'}>
                            <PurchaseReport/>
                        </div>

                    </div>
                </div>
            </div>
    }
}