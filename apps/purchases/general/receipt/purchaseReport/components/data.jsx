import React from 'react'
import {connect} from 'react-redux'

import AdminTable from '../../../../../../general/adminTable/adminTable.jsx'

@connect(store=>{
    return {
        cartItems: store.cart.cartItems,
        target_warehouse: store.warehouses.selectedWarehouse,
    }
})
export default class Data extends React.Component {

    calculate_previous_inv = (item=>{
        const cartItems = this.props.cartItems
        const selectedWarehouse = this.props.target_warehouse
        function calculatePreviousExistence(item){

            for (let part_obj of cartItems){
                if(part_obj.product.id === item.id){
                    let inv_on_target_warehouse = part_obj.product.inventory_existent[selectedWarehouse.id]
                    return (inv_on_target_warehouse - part_obj.qty).toFixed(2)
                }
            }
            return "X"

        }
        return calculatePreviousExistence(item)
    })

    get_actual_inv = (item=>{
        const selectedWarehouse = this.props.target_warehouse
        function calculatePreviousExistence(item){
            return item.inventory_existent[selectedWarehouse.id]!=undefined?parseFloat(item.inventory_existent[selectedWarehouse.id]).toFixed(2):'X'
        }
        return calculatePreviousExistence(item)
    })

    render(){
        const header = [
            {
                field: 'product.code',
                text: 'Código',
                type: 'primaryNoEdit'
            },
            {
                field: 'product.description',
                text: 'Producto'
            },
            {
                type: 'function_process',
                field: 'product',
                text: 'Anterior',
                worker_method: this.calculate_previous_inv

            },
            {
                field: 'qty',
                text:'Ingreso'
            },
            {
                type: 'function_process',
                field: 'product',
                text: 'Actual',
                worker_method: this.get_actual_inv

            },
            {
                field: 'wanted_price_ivi',
                text: 'Precio'
            }
        ]

        const list = <AdminTable headerOrder={header} data={this.props.cartItems}/>

        return list
    }
}