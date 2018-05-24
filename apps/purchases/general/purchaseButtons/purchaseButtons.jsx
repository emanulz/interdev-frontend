import React from 'react'
import {connect} from 'react-redux'

@connect(store=>{
    return{}
})
export default class PurchaseButtons extends React.Component {

    showPayPanel(){
        this.props.dispatch({type:'SHOW_PAY_PANEL'})
    }

    saveInvoice(apply, e){
        console.log('Apply --> ' + e.target + apply)
    }

    render() {
        return <div className='purchase-buttons'>
            <div className='purchase-buttons-row' >
                <button className='purchase-buttons-normal' 
                onClick={this.showPayPanel.bind(this, false)}>
                    Ingresar Pago
                    <span> <i className='fa fa-money' /> </span>
                </button>

                <button className='purchase-buttons-normal' 
                onClick={this.saveInvoice.bind(this, false)}>
                    Guardar Factura
                    <span> <i className='fa fa-save' /> </span>
                </button>
            </div>

            <div className='purchase-buttons-row' >
                <button className='purchase-buttons-normal' 
                onClick={this.saveInvoice.bind(this, true)}>
                    Aplicar Factura
                    <span> <i className='fa fa-check' /> </span>
                </button>

                <button className='purchase-buttons-normal' >
                    Facturas Incompletas
                    <span> <i className='fa fa-exclamation' /> </span>
                </button>
            </div>
        </div>
    }
}