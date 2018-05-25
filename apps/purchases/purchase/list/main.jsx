import React from 'react'
import {connect} from 'react-redux'
import {getItemDispatch} from '../../../../utils/api.js'
import DataTable from '../../../../general/dataTable/dataTable.jsx'
import { inspect } from 'util';

@connect(store=>{
    return {
        purchases: store.purchase.purchasesTableFriendly,
        fetching: store.fetching.fetching,
    }
})
export default class ListPurchases  extends React.Component {

    componentWillMount(){
        this.props.dispatch({type: 'FETCHING_STARTED'})

        const purchasesKwargs = {
            url : '/api/purchase/',
            successType: 'FETCH_PURCHASES_FULFILLED',
            errorType: 'FETCH_PURCHASES_REJECTED'
        }

        this.props.dispatch(getItemDispatch(purchasesKwargs))
    }

    render(){
        const header = [
            {
                field: 'consecutive',
                text: 'Consecutivo',
                type: 'primaryNoEdit'
            },
            {
                field: 'supplier_name',
                text: 'Proveedor',
                type: 'text'
            },
            {
                field:'payed',
                text: 'Pagada?',
                type:'bool',
            },
            {
                field: 'pay_type',
                text: 'Pago',
                type: 'text'
            },
            {
                field:'invoice_date',
                text:'Fecha Factura',
                type: 'date',
            },
            {
                field:'invoice_number',
                text:'Número Factura',
                type: 'text'
            }
        ]

        
        const fetching = <div/>
        const list = <DataTable headerOrder={header} app="purchases" model="purchase"
            data={this.props.purchases} 
            addLink="purchases/add" idField="consecutive" />

        const content = this.props.purchases.length > 0 ? list : fetching

        return <div className='list list-container' >
            <h1>Listado de Compras: </h1>
            {content}
        </div>
    
    }
}