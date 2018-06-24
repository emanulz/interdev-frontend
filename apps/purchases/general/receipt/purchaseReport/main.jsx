import React from 'react'

import Header from './components/header.jsx'
import Data from './components/data.jsx'

export default class PurchaseReport extends React.Component {
    render(){
        return <div className='purchase-report'>
            <Header/>
            <Data/>
        </div>
    }
}