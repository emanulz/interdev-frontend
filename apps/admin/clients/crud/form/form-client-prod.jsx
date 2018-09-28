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
                <div className='clientProdForm-header'>
                    Crear Entrada Cliente-Producto
                    <i className='fa fa-times' onClick={this.hidePanel.bind(this)}/>
                </div>
                <span>Es posible fijar un descuento que será usado contra la lista de precios que corresponda,
                    o un precio que se usaría por encima de las lista de precios. Esto se controla mendiante la
                    opción "Fijar mediante precio?" Solo uno de los dos métodos se puede usar en un momento dado.
                </span>
                <hr/>

                <div className='col-xs-12 row'>
                    <h2>Detalles del producto</h2>
                    <span>Código:</span><p>{entry.product_code}</p>
                    <span>Descripción:</span><p>{entry.product_description}</p>

                </div>


                <div className='col-xs-12 row form-container'>
                    <div className="form-group">
                        <label>Fijar mediante precio?</label>
                        <input checked={entry.by_price} type="checkbox" name='by_price' 
                            onChange={this.handleInputChange.bind(this)}/>
                    </div>

                    <div className="form-group">
                        <label>Descuento</label>
                        <input type="number" value={parseFloat(entry.discount_percent)} 
                            name='discount_percent'
                            onChange={this.handleInputChange.bind(this)}/>
                    </div>

                    <div className="form-group">
                        <label>Precio de Tabla</label>
                        <input value={entry.table_price} type="number" name="table_price"
                            onChange={this.handleInputChange.bind(this)}/>

                    </div>
                    

                </div>
                <CreateButtons/>
            </div>
        </div>
    }
}