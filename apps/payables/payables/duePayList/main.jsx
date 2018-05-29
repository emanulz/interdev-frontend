import React from 'react'
import {connect} from 'react-redux'

import DataTable from '../../../../general/dataTable/dataTable.jsx'

@connect(store=>{
    return {
        suppliers: store.suppliers.suppliers
    }
})
export default class DuePayList extends React.Component {

    componentWillMount() {

    }

    render() {

        const suppliers = this.props.suppliers
        const filtered_suppliers = suppliers.filter(item=>item.debt_to>0)

        const headerOrder = [
            {
                field: 'code',
                text: 'Código',
                type: 'primaryNoEdit'
            },
            {
                field: 'name',
                text: 'Nombre Comercial',
                type: 'text'
            },
            {
                field: 'debt_to',
                text: 'Saldo',
                type: 'price'
            },
            {
                field: 'code',
                text: 'Facturas Pendientes',
                textToRender: 'Ver Pendientes',
                type: 'textLink'
            }
        ]

        const list = <DataTable headerOrder={headerOrder} model='duepay'
        data={filtered_suppliers} app='payables' addLink='' idField='id' />
        const fetching = <div />
        const content = this.props.fetching ? fetching : list

        return <div className='list  list-container'>
            <h1>Listado de Cuentas por Pagar:</h1>
            {content}
        </div>
    }
}