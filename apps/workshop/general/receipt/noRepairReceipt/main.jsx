import React from 'react'

import Header  from './components/header.jsx'
import NoRepairBody from './components/body.jsx'

export default class NoRepairReceipt extends React.Component {
    render(){
        return <div className='compact-warrantyBD'>
            <Header/>
            <NoRepairBody/>
        </div>
    }
}