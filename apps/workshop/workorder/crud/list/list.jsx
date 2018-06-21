import React from 'react'
import {connect} from 'react-redux'
import DataTable from '../../../../../general/dataTable/dataTable.jsx'
import AdminTable from '../../../../../general/adminTable/adminTable.jsx'
import { getItemDispatch } from '../../../../../utils/api.js'

@connect((store) => {
    return {
      fething: store.fetching.fetching,
      workorders: store.workorder.workorders,
      table_friendly_orders: store.workorder.table_friendly_orders
    }
  })
export default class List extends React.Component{
    
    componentWillMount(){
        this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
        //todo: add a clear work orders signal to make sure the list
        //truly displays the updated items

        const workordersKwargs = {
            url: '/api/listworkorders',
            successType: 'FETCH_WORKORDERS_FULFILLED',
            errorType: 'FETCH_WORKORDERS_REJECTED'
        }

        this.props.dispatch(getItemDispatch(workordersKwargs))
    }

    render(){
        const headerOrder =[
            {
                field: 'consecutive',
                text: 'Consecutivo',
                type: 'primaryNoEdit'
            },
            {
                field: 'editIngress',
                text: 'Editar Ingreso',
                type: 'link_mask',
                target: 'workorder/edit',
                baseLink: 'edit',
                textToRender: 'Editar'               
            },
            {
                field: 'is_closed',
                text: 'Cerrada?',
                type: 'bool'
            },
            {
                field: 'paid',
                text: 'Pagada?',
                type: 'bool'
            },
            {
                field: 'article_type',
                text: 'Tipo'
            },
            {
                field: 'article_brand',
                text: 'Marca'
            },
            {
                field: 'client_name',
                text: 'Cliente'
            },
            {
                field: 'created',
                text: 'Recibido'
            }
        ]

        const fetching = <div/>

        const list = <AdminTable headerOrder={headerOrder} app="workshop" model='workshopview' 
            data={this.props.table_friendly_orders}
            addLink='/workshop/workorder/add' idField='id'/>

        const content = this.props.fetching ? fetching : list

        return <div className='list list-container'>
            <h1>Listado Órdenes de Trabajo: </h1>
            <div className='admin-list-search'>
                <input
                type='text'
                placeholder='Ingrese un texto para buscar...'
                />
            </div>
            {content}
        </div>
    }
}
