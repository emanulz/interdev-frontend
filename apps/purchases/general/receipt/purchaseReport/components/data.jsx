import React from 'react'
import {connect} from 'react-redux'

import AdminTable from '../../../../../../general/adminTable/adminTable.jsx'

@connect(store=>{
    return {
        cartItems: store.cart.cartItems,
    }
})
export default class Data extends React.Component {
    render(){
        const header = [
            {
                field: 'product.code',
                text: 'Código',
                type: 'primaryNoEdit'
            },
            {
                field: 'product.description',
                text: 'Nombre Producto'
            },
            {
                field: 'qty',
                text:'Cantidad Ingreso'
            },
            {
                field: 'wanted_price_ivi',
                text: 'Precio a Marcar'
            }
        ]

        const list = <AdminTable headerOrder={header} data={this.props.cartItems}/>

        return list
    }
}