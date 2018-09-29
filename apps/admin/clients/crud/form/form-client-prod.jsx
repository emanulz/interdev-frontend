import React from 'react'
import {connect} from 'react-redux'
import CreateButtons from './createButtonsClient-prod.jsx'

@connect(store =>{
    return {
        clientProdFormVisible: store.clients.clientProdFormVisible,
        activeClientProd: store.clients.activeClientProd,
    }
})
export default class FormClientProd extends React.Component {

    componentWillMount(){

    }
    // HANDLE INPUT CHANGE
    handleInputChange(event) {

        const target = event.target
        let value

        switch (target.type) {
        case 'checkbox':
        {
            value = target.checked
            break
        }
        case 'number':
        {
            value = parseFloat(target.value)
            ? parseFloat(target.value)
            : 0
            break
        }

        default:
        {
            value = target.value
        }
        }

        const name = target.name

        const activeClientProd = {
        ...this.props.activeClientProd
        }

        activeClientProd[name] = value

        this.props.dispatch({type: 'SET_ACTIVE_CLIENTPROD', payload: activeClientProd})
    }


    hidePanel(event){
        this.props.dispatch({type:'HIDE_CLIENT_PRODUCT_EDIT'})
    }

    render(){

        const clientProdFormClass = this.props.clientProdFormVisible 
            ? 'clientProdForm': 'clientProdForm hidden'

        let entry = this.props.activeClientProd

        return <div className={clientProdFormClass}>
            <div className='clientProdForm-main'>
                <div className='clientProdForm-main-header'>
                    Crear Entrada Cliente-Producto
                    <i className='fa fa-times' onClick={this.hidePanel.bind(this)}/>
                </div>

                <div className="clientProdForm-main-info">
                    <span>Es posible fijar un descuento que será usado contra la lista de precios que corresponda,
                        o un precio que se usaría por encima de las lista de precios. Esto se controla mendiante la
                        opción "Fijar mediante precio?" Solo uno de los dos métodos se puede usar en un momento dado.
                    </span>
                </div>
                <hr/>

                <div className='clientProdForm-main-prodDetails col-xs-12 row'>
                    <div className="clientProdForm-main-prodDetails-title"><h2>Detalles del producto</h2></div>
                    <div><span className="clientProdForm-main-prodDetails-title">Código:</span><p className="clientProdForm-main-prodDetails-entry">{entry.product_code}</p></div>
                    <div><span className="clientProdForm-main-prodDetails-title">Descripción:</span><p className="clientProdForm-main-prodDetails-entry">{entry.product_description}</p></div>

                </div>

                <div className="clientProdForm-main-gridContainer">

                    <div className='clientProdForm-main-gridContainer-price col-xs-12 row form-container'>
                        <div className="clientProdForm-main-gridContainer-price-firstForm form-group">
                            <label className="clientProdForm-main-gridContainer-price-firstForm-text">Fijar mediante precio?</label>
                            <input checked={entry.by_price} type="checkbox" name='by_price' 
                                onChange={this.handleInputChange.bind(this)}/>
                    </div>

                    <div className="clientProdForm-main-gridContainer-price-secondForm form-group">
                        <label className="clientProdForm-main-gridContainer-price-secondForm-text">Descuento</label>
                        <input type="number" value={parseFloat(entry.discount_percent)} 
                        name='discount_percent'
                        onChange={this.handleInputChange.bind(this)}/>
                    </div>

                    <div className="clientProdForm-main-gridContainer-price-thirdForm form-group">
                        <label className="clientProdForm-main-gridContainer-price-thirdForm-text">Precio de Tabla</label>
                        <input value={entry.table_price} type="number" name="table_price"
                        onChange={this.handleInputChange.bind(this)}/>

                    </div>

                </div>

                 <CreateButtons/>   

                </div>
                
            </div>
        </div>
    }
}