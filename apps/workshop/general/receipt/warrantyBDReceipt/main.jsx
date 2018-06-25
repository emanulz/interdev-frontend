import React from 'react'

import Header  from './components/header.jsx'
import WarrantyBodyBD from './components/body.jsx'

export default class WarrantyBDReceipt extends React.Component {
    render(){
        return <div className='compact-warrantyBD'>
            <Header/>
            <WarrantyBodyBD/>
        </div>
    }
}