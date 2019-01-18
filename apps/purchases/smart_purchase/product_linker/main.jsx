import React from 'react'
import {connect} from 'react-redux'

import Search from '../../../../general/search/search.jsx'
import {getSingleItemDispatch} from '../../../../utils/api.js'

@connect(store=>{
    return {
        supplier_results: store.supplierLinker.searchResults
    }
})
export default class ProductLinker extends React.Component {


    onProductSelected(item_id, dispatch){

        dispatch({type:'productLinker_TOGGLE_SEARCH_PANEL'})
        //get the selected product
        const kwargs = {
            url: `/api/productslist/${item_id}`,
            successType: 'SET_TO_LINK_INTERNAL_PRODUCT',
            errorType: 'ERROR_GETTING_PRODUCT'
        }
        dispatch(getSingleItemDispatch(kwargs))

    }

    render(){
        return <div className="supplier-link">
            <Search modelText='Producto' model='product' namespace='productLinker' onRowDoubleClick = {this.onProductSelected}/>
        </div>
    }
}