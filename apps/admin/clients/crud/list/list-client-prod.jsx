/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import AdminTable from '../../../../../general/adminTable/adminTable.jsx'
import SearchAdmin from '../../../../../general/search/searchAdmin.jsx'
import { getPaginationItemDispatch } from '../../../../../utils/api.js'
import FormClientProd from '../form/form-client-prod.jsx'

import Pagination from '../../../../../general/pagination/pagination.jsx'
import ResultsPerPage from '../../../../../general/pagination/resultsPerPage.jsx'

@connect(store=>{
    return {
        fetching: store.fetching.fetching,
        pageSize: store.pagination.pageSize,
        clientProds: store.clients.clientProds,
        searchResults: store.clientProductSearch.searchResults,
    }
})
export default class List extends React.Component {

    componentWillMount(){
        this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
        this.props.dispatch({type: `clientProductSearch_CLEAR_SEARCH_RESULTS`})

        const client_prodKwargs = {
            url: `/api/clientproduct/?limit=${this.props.pageSize}`,
            successType: 'FETCH_CLIENT_PRODS_FULFILLED',
            errorType: 'FETCH_CLIENT_PRODS_REJECTED'
        }
        this.props.dispatch(getPaginationItemDispatch(client_prodKwargs))
    }
    
    showCreateForm(code, e){
        this.props.dispatch({type: 'CLIENT_PRODUCT_EDIT', payload: code})
    }

    render(){

        //const a = ()=>{console.log("HERE HERE TADAH")}
        const a = this.showCreateForm
        const headerOrder = [
            {
              field: 'product_code',
              text: 'Código Producto',
              type: 'function_on_click',
              onClickFunction: a,
              href: ''
            
            }, 
            {
              field: 'product_description',
              text: 'Nombre',
            }, 
            {
              field: 'discount_percent',
              text: 'Descuento'
            }, 
            {
              field: 'updated',
              text: 'Actualizado'
            }
          ]
        
        const fetching = <div />
        const tableData = this.props.searchResults.length ? this.props.searchResults: this.props.clientProds

        const list = <AdminTable headerOrder={headerOrder} model='clientproduct' data = {tableData}
          idField='product_code' />

        const content = this.props.fetching ? fetching:list

        return <div className='list list-container'>
            <div className='admin-list-header'>
                <h1>Referencia Descuentos Cliente-Producto</h1>
            </div>
            <SearchAdmin model='clientproduct' namespace='clientProductSearch' />
            {content}
            <FormClientProd />
        </div>
    }
}