import React from 'react'

import Header  from './components/header.jsx'
import WarrantyBody from './components/body.jsx'

export default class WarrantyReceipt extends React.Component {
    render(){
        return <div className='compact-warrantyBD'>
            <Header/>
            <WarrantyBody/>
        </div>
    }
}