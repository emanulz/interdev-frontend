import React from 'react'

import Header from './components/header.jsx'
import PartRequestData  from './components/body.jsx'

export default class PartRequestReceipt extends React.Component {
    render(){
        return <div className='compact-partRequest'>
            <Header/>
            <PartRequestData/>
        </div>
    }
}