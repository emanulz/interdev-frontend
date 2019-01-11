import React from 'react'

import {connect} from 'react-redux'

let inspect = require('util-inspect')

//components
import StepA from './step_a/main.jsx'
import StepB from './step_b/main.jsx'

@connect(store=>{
    return {

    }
})
export default class SmartPurchase extends React.Component {

    componentWillMount(){

    }

    render() {
        return <div className='smart_purchase'>
            <StepA />
            <StepB />
        </div>
    }
}