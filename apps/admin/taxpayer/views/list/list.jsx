import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import AdminTable from '../../../../../general/adminTable/adminTable.jsx'

@connect(store=>{
    return {
        fetching: store.fetching.fetching,
        taxpayers: store.taxpayers.taxpayers,
    }
})

export default class List extends React.Component {

    componentWillMount(){
        this.props.dispatch({type: 'FETCHING_STARTED'})
        this.props.dispatch({type: 'CLEAR_TAX_PAYER'})

        const taxpayerKwargs = {
            url: '/api/taxpayer/',
            successType: 'TAX_PAYER_FULFILLED',
            errorType: 'TAX_PAYER_REJECTED'
        }

        
    }

    render(){
        const headerOrder = [

        ]

        const fetching =< div/>

        const list = <AdminTable headerOrder={headerOrder} model='taxpayers'
            data={this.props.taxpayers}/>

        const content = this.props.fetching ? fetching : list
        
        const addLink = <Link className='addBtn' to={''}>
            <span className="fa fa-plus" />
            Agregar
        </Link>

        return <div className='list list-container'>
            <div className='admin-list-header'>
                <h1>Listado de Contribuyentes</h1>
            </div>

            {content}
        </div>
    }
}