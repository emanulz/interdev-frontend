import React from 'react'
import routes from './routes.js'
import {connect} from 'react-redux'

import {getItemDispatch} from '../../../utils/api.js'


@connect(store=>{
    return {
        //permissions: store.suppliers.permissions
    }
})
export default class Payments extends React.Component {

    componentWillMount() {
        const providersKwargs = {
            url:'/api/suppliers',
            successType: 'FETCH_SUPPLIERS_FULFILLED',
            errorType: 'FETCH_SUPPLIERS_REJECTED'
        }

        //load the providers data, which will include the due debt
        this.props.dispatch({type: 'FETCHING_STARTED'})
        this.props.dispatch(getItemDispatch(providersKwargs))


    }

    render() {
        return <div className='Main heigh100' >
            {routes}
        </div>
    }

}