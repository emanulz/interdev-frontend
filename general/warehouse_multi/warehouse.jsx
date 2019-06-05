import React from 'react'
import {connect} from 'react-redux'
import {getItemDispatch} from '../../utils/api'
import Select2 from 'react-select2-wrapper'


@connect(store=>{
    return {
        warehouses: store.warehouse_multi.warehouses,
        warehouses_options: store.warehouse_multi.warehouses_options,
        selectedWarehouse: store.warehouse_multi.selectedWarehouse,
        is_disabled: store.warehouse_multi.is_disabled,

    }
})
export default class WarehouseMulti extends React.Component {

    componentWillMount(){
        this.props.dispatch({type:'MULTI_FETCHING_STARTED'})
        this.props.dispatch({type:'MULTI_CLEAR_WAREHOUSES_ALL'})

        const kwargs = {
            url: '/api/warehouses/',
            successType: 'MULTI_FETCH_WAREHOUSES_FULFILLED',
            errorType: 'MULTI_FETCH_WAREHOUSES_REJECTED'
        }
        this.props.dispatch(getItemDispatch(kwargs))
    }

    warehouseSelected(e){
        const index = this.props.warehouses.findIndex(a=>a.id === e.target.value)
        if(index===-1){return}
        this.props.dispatch({type:'MULTI_WAREHOUSE_SELECTED', payload:index, namespace:this.props.namespace})
    }

    render(){
        const options = this.props.warehouses.map((warehouse, index)=>{
            return <option value={warehouse.id} key={index}>{warehouse.name}</option>
        })
        let namespace_key = this.props.namespace ? this.props.namespace : 'default'

        let selectedName = this.props.selectedWarehouse['default'].name
        if(this.props.selectedWarehouse[namespace_key]){
            selectedName = this.props.selectedWarehouse[namespace_key].name
        }
        

        return <div className="warehouses-data" >
            <div className='warehouses-data-row'>
                    <Select2
                        name='warehouses'
                        className='form-control'
                        onSelect={this.warehouseSelected.bind(this)}
                        data={this.props.warehouses_options}
                        disabled={this.props.is_disabled}
                        options={{
                            placeholder: this.props.is_disabled?'Deshabilitado':this.props.placeholder,
                            noResultsText: 'Sin elementos'
                    }} /> 

            </div>
            <div className="warehouses-data-row" >
                <h3>{this.props.label}</h3>
                <span>{selectedName}</span>
            </div>
        </div>
    }
}