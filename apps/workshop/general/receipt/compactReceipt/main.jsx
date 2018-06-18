import React from 'react'

import Header from './components/header.jsx'
import ReceiptData from './components/receiptData.jsx'

export default class CompactReceipt extends React.Component {
    render(){
        return <div className='compact-receipt'>
            <Header/>
            <ReceiptData/>
        </div>
    }
}