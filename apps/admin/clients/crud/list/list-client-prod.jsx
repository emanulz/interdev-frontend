/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import AdminTable from '../../../../../general/adminTable/adminTable.jsx'
import SearchAdmin from '../../../../../general/search/searchAdmin.jsx'
import Search from '../../../../../general/search/search.jsx'
import { getPaginationItemDispatch } from '../../../../../utils/api.js'
import FormClientProd from '../form/form-client-prod.jsx'
import {saveItem} from '../../../../../utils/api'

@connect(store=>{
    return {
        fetching: store.fetching.fetching,
        pageSize: store.pagination.pageSize,
        clientProds: store.clientsAdmin.clientProds,
        searchResults: store.clientProductSearch.searchResults,
        clientActive: store.clientsAdmin.clientActive,
        productsSearcResults: store.productClientCreate.searchResults,
        requires_refetch: store.clientsAdmin.requires_refetch
    }
})
export default class List extends React.Component {

    componentWillMount(){
        this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
        this.props.dispatch({type: `clientProductSearch_CLEAR_SEARCH_RESULTS`})

    }

    componentWillUpdate(nextProps){
        if(this.props.clientActive.id==="0000000000" && nextProps.clientActive.id!=="0000000000"){
            const client_prodKwargs = {
                url: `/api/clientproduct/?limit=${150}&client_id=${nextProps.clientActive.id}`,
                successType: 'FETCH_CLIENT_PRODS_FULFILLED',
                errorType: 'FETCH_CLIENT_PRODS_REJECTED'
            }
            this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
            this.props.dispatch(getPaginationItemDispatch(client_prodKwargs))
        }else if(this.props.requires_refetch){
            const client_prodKwargs = {
                url: `/api/clientproduct/?limit=${this.props.pageSize}&client_id=${nextProps.clientActive.id}`,
                successType: 'FETCH_CLIENT_PRODS_FULFILLED',
                errorType: 'FETCH_CLIENT_PRODS_REJECTED'
            }
            this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
            this.props.dispatch(getPaginationItemDispatch(client_prodKwargs))
        }


    }
    
    showCreateForm(code, e){
        this.props.dispatch({type: 'CLIENT_PRODUCT_EDIT', payload: code})
    }

    productSearchDoubleClick(prod_id, e){
        //find the product by id and dispatch to the reducer to set id
        const product = this.props.productsSearcResults.find(item=>{
            if(item.id== prod_id){
                return item
            }
        })
        const payload = {
            is_create: true,
            product: product,

        }
        this.props.dispatch({type: 'CLIENT_PRODUCT_CREATE', payload:payload})
        this.props.dispatch({type:'productClientCreate_TOGGLE_SEARCH_PANEL'})

    }

    showProdCreateSearch(){
        this.props.dispatch({type:'productClientCreate_TOGGLE_SEARCH_PANEL'})
    }

    deleteClientProdEntry(id, event){

        const _this = this
        let endpoint =  `/api/clientproduct/custom_delete/`

        let kwargs = {
        url: endpoint,
        item: {'pk': id},
        sucessMessage: 'Entrada Cliente-Producto borrada correctamente.',
        errorMessage: 'Hubo un error al borrar la entrada Cliente-Producto, intente de nuevo.',
        dispatchType: 'FLAG_REFRESH_CLIENT_PROD'
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
                field: 'table_price',
                text: 'Precio Tabla'
              }, 
            {
              field: 'discount_percent',
              text: 'Descuento'
            }, 
            {
              field: 'updated',
              text: 'Actualizado',
              type: 'date'
            },
            {
                field: 'id',
                type: 'function_on_click',
                textToRender: 'Borrar?',
                href: '',
                onClickFunction: this.deleteClientProdEntry
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
                <div className='clientProdForm-add addBtn' onClick={this.showProdCreateSearch.bind(this)}>
                    <span className='fa fa-plus' />
                    Agregar entrada
                </div>
            </div>

            <SearchAdmin model='clientproduct' namespace='clientProductSearch' clientId={this.props.clientActive.id} />
            {content}
            <FormClientProd />

            <Search modelText='Producto' model='product' namespace='productClientCreate' onRowDoubleClick={this.productSearchDoubleClick.bind(this)}
                onRowClick={() => { return false }} onActiveItem={() => { return false }} sortedBy='code' useImage />
        </div>
    }
}