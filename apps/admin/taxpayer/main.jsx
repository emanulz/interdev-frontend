import React from 'react'
import {connect} from 'react-redux'
import routes from './routes.js'
import {checkUserPermissions} from '../../../utils/checkPermissions'
import {getItemDispatch} from '../../../utils/api'

@connect(store=>{
    return{
        permissions: store.taxpayer.permissions,

    }
})
export default class TaxPayerList extends React.Component {
    
    
    componentWillMount(){

        const permissions = {
            add: 'taxpayer.add_taxpayer',
            change: 'taxpayer.change_taxpayer',
            list: 'taxpayer.list_taxpayer',
            delete: 'taxpayer.delete_taxpayer'
        }

        const kwargs = {
            permissions: permissions,
            success: 'FETCH_USER_TAXPAYER_PERMISSIONS_FULFILLED',
            fail: 'FETCH_USER_TAXPAYER_PERMISSIONS_REJECTED'
        }

        // Then fetch provinces of the model and dispatch to reducer
        // *******************************************************************
        const provinceKwargs = {
        url: '/api/provinces',
        successType: 'FETCH_PROVINCES_FULFILLED',
        errorType: 'FETCH_PROVINCES_REJECTED'
        }
        this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
        this.props.dispatch(getItemDispatch(provinceKwargs))
        // *******************************************************************
        // Then fetch cantons of the model and dispatch to reducer
        // *******************************************************************
        const cantonKwargs = {
            url: '/api/cantons',
            successType: 'FETCH_CANTONS_FULFILLED',
            errorType: 'FETCH_CANTONS_REJECTED'
        }
        this.props.dispatch({type: 'FETCHING_STARTED'})
        this.props.dispatch(getItemDispatch(cantonKwargs))
        // *******************************************************************
    
        // Then fetch districts of the model and dispatch to reducer
        // *******************************************************************
        const districtKwargs = {
            url: '/api/districts/?limit=5000',
            successType: 'FETCH_DISTRICTS_FULFILLED',
            errorType: 'FETCH_DISTRICTS_REJECTED'
        }
        this.props.dispatch({type: 'FETCHING_STARTED'})
        this.props.dispatch(getItemDispatch(districtKwargs))
        // *******************************************************************
    
        // Then fetch towns of the model and dispatch to reducer
        // *******************************************************************
        const townKwargs = {
            url: '/api/towns/?limit=6000',
            successType: 'FETCH_TOWNS_FULFILLED',
            errorType: 'FETCH_TOWNS_REJECTED'
        }

        this.props.dispatch(getItemDispatch(townKwargs))
        this.props.dispatch({type: 'FETCHING_STARTED'})
        this.props.dispatch(checkUserPermissions(kwargs))

    }

    render(){
        return <div className='Main heigh100'>
            {routes}
        </div>
    }
}
