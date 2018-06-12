import React from 'react'
import {connect} from 'react-redux'
import {getPaginationItemDispatch} from '../../../../utils/api.js'
import AdminTable from '../../../../general/adminTable/adminTable.jsx'
import Pagination from '../../../../general/pagination/pagination.jsx'
import ResultsPerPage from '../../../../general/pagination/resultsPerPage.jsx'

@connect(store=>{
    return {
        suppliers: store.suppliers.suppliers,
        pageSize: store.pagination.pageSize,
        
    }
})
export default class DuePayList extends React.Component {

    componentWillMount() {
        this.props.dispatch({type: 'FETCHING_STARTED'})
        const suppliersKwargs = {
            url : `/api/suppliers/?limit=${this.props.pageSize}`,
            successType: 'FETCH_SUPPLIERS_FULFILLED',
            errorType: 'FETCH_SUPPLIERS_REJECTED'
        }
        this.props.dispatch(getPaginationItemDispatch(suppliersKwargs))
    }

    render() {

        const suppliers = this.props.suppliers
        const filtered_suppliers = suppliers.filter(item=>item.balance < 0)

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
                field: 'balance',
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

        const list = <AdminTable headerOrder={headerOrder} model='duepay'
        data={filtered_suppliers} app='payables' addLink='' idField='id' />
        const fetching = <div />
        const content = this.props.fetching ? fetching : list

        return <div className='list  list-container'>
            <div className="admin-list-header" >
                <h1>Listado de Cuentas por Pagar</h1>
            </div>
            <div className="admin-list-results-pagination">
                <ResultsPerPage url='/api/suppliers/' successType='FETCH_SUPPLIERS_FULFILLED' errorType='FETCH_SUPPLIERS_REJECTED' />
                <Pagination url='/api/suppliers/' successType='FETCH_SUPPLIERS_FULFILLED' errorType='FETCH_SUPPLIERS_REJECTED' />
            </div>
            {content}
        </div>
    }
}