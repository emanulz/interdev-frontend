import React from 'react'
import {connect} from 'react-redux'
import {getItemDispatch} from '../../../../utils/api'
import {findSupplier} from './actions'

@connect(store=>{
    return{
        suppliers:store.suppliers.suppliers,
        supplierSelected:store.suppliers.supplierSelected
    }
})
export default class Suppliers extends React.Component {

    componentWillMount(){
        this.props.dispatch({type: 'FETCHING_STARTED'})
        this.props.dispatch({type:'CLEAR_SUPPLIERS_ALL'})

        const suppliersKwargs = {
            url: '/api/suppliers/',
            successType:'FETCH_SUPPLIERS_FULFILLED',
            errorType: 'FETCH_SUPPLIERS_REJECTED'
        }
        this.props.dispatch(getItemDispatch(suppliersKwargs))
    }

    inputKeyPress(ev){
        if(ev.key == 'Enter'){
            const code = ev.target.value
            this.props.dispatch(findSupplier(code, this.props.suppliers))
        }
    }

    render() {
        
        return this.buildSupplierData()
    }

    buildSupplierData(){
        const prov = this.props.supplierSelected
        const phone_element = prov.phone_number 
        ?<div className="supplier-data-row" >
            <h3>Teléfono:</h3>
            <span>{prov.phone_number}</span>
        </div>
        :''

        return <div className='supplier' >
        <div className='supplier-img'>
            <img src="/media/default/profile.jpg"/>
        </div>

        <div className="supplier-data">
            <div className="supplier-data-row">
                <h3>Proveedor:</h3>
                <input onKeyDown={this.inputKeyPress.bind(this)} type="text"/>
            </div>
            <div className="supplier-data-row">
                <h3>Nombre:</h3>
                <span>{prov.name}</span>
            </div>
            {phone_element}
        </div>
    </div>
    }
}
