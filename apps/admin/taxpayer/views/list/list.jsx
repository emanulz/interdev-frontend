import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import AdminTable from '../../../../../general/adminTable/adminTable.jsx'
import { getPaginationItemDispatch } from '../../../../../utils/api';

@connect(store=>{
    return {
        fetching: store.fetching.fetching,
        taxpayers: store.taxpayer.taxpayers,
    }
})

export default class List extends React.Component {

    componentWillMount(){
        this.props.dispatch({type: 'FETCHING_STARTED'})
        this.props.dispatch({type: 'CLEAR_TAX_PAYER'})

        const taxpayerKwargs = {
            url: '/api/taxpayerreadonly/',
            successType: 'TAX_PAYER_FULFILLED',
            errorType: 'TAX_PAYER_REJECTED'
        }
        this.props.dispatch(getPaginationItemDispatch(taxpayerKwargs))

    }

    render(){
        const headerOrder = [
            {
                field: 'id',
                text: 'Consecutive',
                type: 'text'
            },
            {
                field: 'legal_name',
                text: 'Nombre Legal'
            },
            {
                field: 'commercial_name',
                text: 'Nombre Comercial'
            },
            {
                field: 'id_type',
                text: 'Identificación'
            },
            {
                field: 'phone_number',
                text: 'Número Teléfono'
            }
        ]

        const fetching =< div/>

        const list = <AdminTable headerOrder={headerOrder} model='taxpayers'
            data={this.props.taxpayers}/>

        const content = this.props.fetching ? fetching : list
        
        const addLink = <Link className='addBtn' to={'/admin/taxpayers/add'}>
            <span className="fa fa-plus" />
            Agregar
        </Link>

        return <div className='list list-container'>
            <div className='admin-list-header'>
                <h1>Listado de Contribuyentes</h1>
            </div>
            {addLink}
            {content}
        </div>
    }
}