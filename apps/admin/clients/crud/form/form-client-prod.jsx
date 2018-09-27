import React from 'react'
import {connect} from 'react-redux'

@connect(store =>{
    return {
        clientProdFormVisible: store.clients.clientProdFormVisible,
    }
})
export default class FormClientProd extends React.Component {

    componentWillMount(){

    }

    render(){

        const clientProdFormClass = this.props.clientProdFormVisible 
            ? 'clientProdForm': 'clientProdForm hidden'

        return <div className={clientProdFormClass}>
            <div className='clientProdForm-main'>
                <div className='clientProdForm-header'>
                    Crear Entrada Cliente-Producto
                    <i className='fa fa-times' />
                </div>
            </div>
        </div>
    }
}