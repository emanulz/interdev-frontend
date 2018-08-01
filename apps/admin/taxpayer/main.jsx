import React from 'react'
import {connect} from 'react-redux'
import routes from './routes.js'
import {checkUserPermissions} from '../../../utils/checkPermissions'

@connect(store=>{
    return{

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

        this.props.dispatch({type: 'FETCHING_STARTED'})
        this.props.dispatch(checkUserPermissions(kwargs))

    }

    render(){
        console.log("Main tax payer mounted")
        return <div className='Main heigh100'>
            {routes}
        </div>
    }
}
