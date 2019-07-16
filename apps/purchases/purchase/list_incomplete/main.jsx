import React from 'react'
import {connect} from 'react-redux'
import {getPaginationItemDispatch} from '../../../../utils/api.js'
import AdminTable from '../../../../general/adminTable/adminTable.jsx'
import Pagination from '../../../../general/pagination/pagination.jsx'
import ResultsPerPage from '../../../../general/pagination/resultsPerPage.jsx'
import SearchAdmin from '../../../../general/search/searchAdmin.jsx'
import {saveItem} from '../../../../utils/api'

@connect(store=>{
    return {
        purchases: store.purchase.purchasesTableFriendly,
        fetching: store.fetching.fetching,
        pageSize: store.pagination.pageSize,
        searchResults: store.purchaseSearch.searchResults,
        requires_incomplete_refresh: store.purchase.requires_incomplete_refresh,
    }
})
export default class ListIncompletePurchases  extends React.Component {

    componentWillMount(){
        this.props.dispatch({type: 'PURCHASE_LIST_PANEL_MOUNTED'})
        this.props.dispatch({type: 'FETCHING_STARTED'})

        const purchasesKwargs = {
            url : `/api/purchaseincompletelist/?limit=${this.props.pageSize}`,
            successType: 'FETCH_PURCHASES_FULFILLED',
            errorType: 'FETCH_PURCHASES_REJECTED',
        }

        this.props.dispatch(getPaginationItemDispatch(purchasesKwargs))
    }


    componentWillUpdate(nextProps){
        const purchasesKwargs = {
            url : `/api/purchaseincompletelist/?limit=${this.props.pageSize}`,
            successType: 'FETCH_PURCHASES_FULFILLED',
            errorType: 'FETCH_PURCHASES_REJECTED',
        }
        if(this.props.requires_incomplete_refresh==false && nextProps.requires_incomplete_refresh==true){
            this.props.dispatch(getPaginationItemDispatch(purchasesKwargs))
        }
        
    }

    discardPending(id){
        const _this = this
        let endpoint =  `/api/purchase/custom_delete/`

        let kwargs = {
        url: endpoint,
        item: {'purchase_id': id},
        sucessMessage: 'Compra borrada correctamente.',
        errorMessage: 'Hubo un error al borrar la entrada por Compra, intente de nuevo.',
        dispatchType: 'FLAG_REFRESH_PURCHASES_INCOMPLETE'
        }

        // ALERTIFY CONFIRM
        alertify.confirm('Eliminar', `Desea Eliminar el registro?
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
            },
            {
                field: 'id',
                type: 'function_on_click',
                textToRender: 'Descartar?',
                href: '',
                onClickFunction: this.discardPending,

            }
        ]

        
        const fetching = <div/>
        const list = <AdminTable headerOrder={header} app="purchases" model="purchase" 
            data={this.props.purchases} />

        const content = this.props.purchases.length > 0 ? list : fetching

        return <div className='list list-container' >
            <div className='admin-list-header'>
                <h1>Listado de Compras Incompletas: </h1>
            </div>
            <div className='admin-list-results-pagination' >
                <ResultsPerPage url='/api/purchaseincompletelist/?ordering=-consecutive' successType='FETCH_PURCHASES_FULFILLED' errorType='FETCH_PURCHASES_REJECTED' />
                <Pagination url='/api/purchaseincompletelist/?ordering=-consecutive' successType='FETCH_PURCHASES_FULFILLED' errorType='FETCH_PURCHASES_REJECTED' />
            </div>
            <SearchAdmin model='purchase' namespace='purchaseSearch' notDeleted />
            {content}
        </div>
    
    }
}

