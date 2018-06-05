import React from 'react'
import {connect} from 'react-redux'

import DataTable from '../../../../general/dataTable/dataTable.jsx'

@connect(store=>{
    return {

    }
})
export default class ListPayments extends React.Component {


    render(){
        return <div className='payments' >LIST PAYMENTS</div>
    }
}