import React from 'react'
import {connect} from 'react-redux'

import Search from '../../../../general/search/search.jsx'
import {getSingleItemDispatch} from '../../../../utils/api.js'

@connect(store=>{
    return {
        supplier_results: store.supplierLinker.searchResults
    }
})
export default class SupplierLinker extends React.Component {


    onSupplierSelected(item_id, dispatch){

        dispatch({type:'supplierLinker_TOGGLE_SEARCH_PANEL'})
        //get the selected supplier
        const kwargs = {
            url: `/api/suppliers/${item_id}`,
            successType: 'SET_TO_LINK_SUPPLIER',
            errorType: 'ERROR_GETTING_SUPPLIER'
        }
        dispatch(getSingleItemDispatch(kwargs))

    }

    render(){
        return <div className="supplier-link">
            <Search modelText='Proveedor' model='supplier' namespace='supplierLinker' onRowDoubleClick = {this.onSupplierSelected}/>
        </div>
    }
}