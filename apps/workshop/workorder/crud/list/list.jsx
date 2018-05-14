import React from 'react'
import {connect} from 'react-redux'
import DataTable from '../../../../../general/dataTable/dataTable.jsx'
import { getItemDispatch } from '../../../../../utils/api.js'

@connect((store) => {
    return {
      fething: store.fetching.fetching,
      workorders: store.workorder.workorders
    }
  })
export default class List extends React.Component{
    
    componentWillMount(){
        this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
        //todo: add a clear work orders signal to make sure the list
        //truly displays the updated items

        const workordersKwargs = {
            url: '/api/workorders',
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
                type: 'primary'
            },
            {
                field: 'malfunction_details',
                text: 'Falla'
            }
        ]

        const fetching = <div/>
        const list = <DataTable headerOrder={headerOrder} model='workorders' data={this.props.workorders}
            addLink='/workshop/workorder/add' idField='id'/>

        const content = this.props.fetching ? fetching : list

        return <div className='list list-container'>
            <h1>Listado Órdenes de Trabajo: </h1>
            {content}
        </div>
    }
}
