import React from 'react'
import {connect} from 'react-redux'
import {getPaginationItemDispatch, saveItem} from '../../../../utils/api.js'
import AdminTable from '../../../../general/adminTable/adminTable.jsx'
import Pagination from '../../../../general/pagination/pagination.jsx'
import ResultsPerPage from '../../../../general/pagination/resultsPerPage.jsx'
import SearchAdmin from '../../../../general/search/searchAdmin.jsx'
import { makeTableFriendly } from './actions.js'

@connect(store=>{
    return {
        purchases: store.purchase.purchasesTableFriendly,
        fetching: store.fetching.fetching,
        pageSize: store.pagination.pageSize,
        searchResults: store.purchaseSearch.searchResults,
        requires_complete_refresh: store.purchase.requires_complete_refresh,
    }
})
export default class ListPurchases  extends React.Component {

    componentWillMount(){
        this.props.dispatch({type: 'PURCHASE_LIST_PANEL_MOUNTED'})
        this.props.dispatch({type: 'FETCHING_STARTED'})
        this.props.dispatch({type: `purchaseSearch_CLEAR_SEARCH_RESULTS`, payload: ''})

        const purchasesKwargs = {
            url : `/api/purchasecompletelist/?limit=${this.props.pageSize}`,
            successType: 'FETCH_PURCHASES_FULFILLED',
            errorType: 'FETCH_PURCHASES_REJECTED'
        }

        this.props.dispatch(getPaginationItemDispatch(purchasesKwargs))
    }


    componentWillUpdate(nextProps){
        const purchasesKwargs = {
            url : `/api/purchasecompletelist/?limit=${this.props.pageSize}`,
            successType: 'FETCH_PURCHASES_FULFILLED',
            errorType: 'FETCH_PURCHASES_REJECTED',
        }

        if(this.props.requires_complete_refresh==false && nextProps.requires_complete_refresh==true){
            this.props.dispatch(getPaginationItemDispatch(purchasesKwargs))
        }
    }


    componentWillUnMount() {
        this.props.dispatch({type: `purchaseSearch_CLEAR_SEARCH_RESULTS`, payload: ''})
    }

    setAsPaid(id){
        const _this = this
        let endpoint =  `/api/purchase/apply_payment/`

        let kwargs = {
        url: endpoint,
        item: {'purchase_id': id, 'complete_payment': true},
        sucessMessage: 'Pago completo aplicado correctamente.',
        errorMessage: 'Hubo un error al aplicar el pago a la compra.',
        dispatchType: 'FLAG_REFRESH_PURCHASES_COMPLETE'
        }

        // ALERTIFY CONFIRM
        alertify.confirm('Eliminar', `Desea marcar como pago el registro?
                                    Esta acción no se puede deshacer.`,
        function() {
        _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
        _this.props.dispatch(saveItem(kwargs))
        }, function() {
        return true
        }).set('labels', {
        ok: 'Si',
        cancel: 'No'
        })
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
                field:'id',
                text: 'Pagada?',
                type: 'function_on_click',
                textToRender: 'Pagar?',
                href: '',
                onClickFunction: this.setAsPaid,
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
        let tableData = this.props.searchResults.length ? this.props.searchResults : this.props.purchases
        if(this.props.searchResults.length){
            tableData = makeTableFriendly(tableData)
        }

        const list = <AdminTable headerOrder={header} app="purchases" model="purchase" 
            data={tableData} />

        const content = this.props.purchases.length > 0 ? list : fetching

        return <div className='list list-container' >
            <div className='admin-list-header'>
                <h1>Listado de Compras: </h1>
            </div>
            <div className='admin-list-results-pagination' >
                <ResultsPerPage url='/api/purchasecompletelist/' successType='FETCH_PURCHASES_FULFILLED' errorType='FETCH_PURCHASES_REJECTED' />
                <Pagination url='/api/purchasecompletelist/' successType='FETCH_PURCHASES_FULFILLED' errorType='FETCH_PURCHASES_REJECTED' />
            </div>
            <SearchAdmin model='purchase' namespace='purchaseSearch' />
            {content}
        </div>
    
    }
}

