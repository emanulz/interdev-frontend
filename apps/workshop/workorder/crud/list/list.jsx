import React from 'react'
import {connect} from 'react-redux'
import AdminTable from '../../../../../general/adminTable/adminTable.jsx'
import Pagination from '../../../../../general/pagination/pagination.jsx'
import ResultsPerPage from '../../../../../general/pagination/resultsPerPage.jsx'
import SearchAdmin from '../../../../../general/search/searchAdmin.jsx'
import {getPaginationItemDispatch} from '../../../../../utils/api.js'
import {makeOrdersTableFriendly}  from '../../actions.js'

@connect((store) => {
    return {
    fetching: store.fetching.fetching,
      workorders: store.workorder.workorders,
      table_friendly_orders: store.workorder.table_friendly_orders,
      pageSize: store.pagination.pageSize,
      searchResults: store.workorderSearch.searchResults,
    }
  })
export default class List extends React.Component{
    
    componentWillMount(){
        this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
        this.props.dispatch({type: 'FETCH_WORKORDERS_REJECTED'})
        const workordersKwargs = {
            url: `/api/listworkorders/?limit=${this.props.pageSize}`,
            successType: 'FETCH_WORKORDERS_FULFILLED',
            errorType: 'FETCH_WORKORDERS_REJECTED'
        }

        this.props.dispatch(getPaginationItemDispatch(workordersKwargs))
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
        const table_data = this.props.searchResults.length 
        ? makeOrdersTableFriendly(this.props.searchResults) 
        : this.props.table_friendly_orders

        const list = <AdminTable headerOrder={headerOrder} app="workshop" model='workshopview' 
            data={table_data}
            addLink='/workshop/workorder/add' idField='id'/>

        const content = this.props.fetching ? fetching : list

        return <div className='list list-container'>
            <h1>Listado Órdenes de Trabajo: </h1>
            {/*<div className='admin-list-search'>
                <input
                type='text'
                placeholder='Ingrese un texto para buscar...'
                />
            </div>*/}
            <SearchAdmin model='workorder' namespace='workorderSearch'/>
            <div className='admin-list-results-pagination' >
                <ResultsPerPage url='/api/listworkorders/' successType='FETCH_WORKORDERS_FULFILLED' errorType='FETCH_WORKORDERS_REJECTED' />
                <Pagination url='/api/listworkorders/' successType='FETCH_WORKORDERS_FULFILLED' errorType='FETCH_WORKORDERS_REJECTED' />
            </div>

            {content}
        </div>
    }
}
