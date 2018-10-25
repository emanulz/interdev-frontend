import React from 'react'
import {connect} from 'react-redux'
import {getItemDispatch} from '../../utils/api'
import Select2 from 'react-select2-wrapper'


@connect(store=>{
    return {
        warehouses: store.warehouses2.warehouses,
        warehouses_options: store.warehouses2.warehouses_options,
        selectedWarehouse: store.warehouses2.selectedWarehouse,
        is_disabled: store.warehouses2.is_disabled,
    }
})
export default class Warehouses extends React.Component {

    componentWillMount(){
        this.props.dispatch({type:'FETCHING_STARTED'})
        this.props.dispatch({type:'CLEAR_WAREHOUSES_ALL'})

        const kwargs = {
            url: '/api/warehouses/',
            successType: 'FETCH_WAREHOUSES_FULFILLED',
            errorType: 'FETCH_WAREHOUSES_REJECTED'
        }
        this.props.dispatch(getItemDispatch(kwargs))
    }

    warehouseSelected(e){
        const index = this.props.warehouses.findIndex(a=>a.id === e.target.value)
        if(index===-1){return}
        this.props.dispatch({type:'WAREHOUSE_SELECTED', payload:index})
    }

    render(){
        const options = this.props.warehouses.map((warehouse, index)=>{
            return <option value={warehouse.id} key={index}>{warehouse.name}</option>
        })
        return <div className="warehouses-data" >
            <div className='warehouses-data-row'>
                    <Select2
                        name='warehouses'
                        className='form-control'
                        onSelect={this.warehouseSelected.bind(this)}
                        data={this.props.warehouses_options}
                        disabled={this.props.is_disabled}
                        options={{
                            placeholder: this.props.is_disabled?'Deshabilitado':'Elija la bodega de destino..',
                            noResultsText: 'Sin elementos'
                    }} /> 

            </div>
            <div className="warehouses-data-row" >
                <h3>Bodega de Destino:</h3>
                <span>{this.props.selectedWarehouse.name}</span>
            </div>
        </div>
    }
}