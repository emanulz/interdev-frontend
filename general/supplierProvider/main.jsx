import React from 'react'
import {connect} from 'react-redux'
import {getItemDispatch, getSearchDispatch} from '../../utils/api.js'
let inspect = require('util-inspect')


@connect(store=>{
    return {
        activeSupplier: store.suppliers.activeSupplier,
        search_key: store.suppliers.search_key,
    }
})
export default class SupplierProvider extends React.Component {


    providerSearchInputChanged(e){
        this.props.dispatch({type:'PROVIDER_SEARCH_KEY_UPDATED', payload: e.target.value})
    }

    providerPerformSearch(e){
        if(e.key == 'Enter'){
            if(e.target.value){
                console.log('call server')
                const kwargs = {
                    url:`/api/supplierscustom/?code=${e.target.value}`,
                    singleResultDispatch: 'SET_ACTIVE_SUPPLIER',
                    multiResultDispatch: 'DISPLAY_MULTI_RESULT_PANEL',
                    noResultsDispatch: 'DISPLAY_MULTI_RESULT_PANEL',
                    errorType: 'SUPPLIER_NOT_FOUND',
                }
                this.props.dispatch(getSearchDispatch(kwargs))

            }
        }
    }


    render() {
        
        return <div className='supplierProvider'>
            <input 
                className="supplierProvider-input  form-control" 
                type="text" name="supplier_input" 
                value={this.props.search_key}
                onChange ={this.providerSearchInputChanged.bind(this)}
                onKeyPress={this.providerPerformSearch.bind(this)}
                placeholder='Búsqueda de proveedor...'/>
            <div>Nombre: {this.props.activeSupplier.name}</div>
        </div>
    }
}