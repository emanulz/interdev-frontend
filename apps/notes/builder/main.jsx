import React from 'react'
import {connect} from 'react-redux'

import Content from './content/content.jsx'
import Aside from './aside/aside.jsx'
import Currency from '../../../general/currency/currency.jsx'

@connect((store) => {
    return {
    }
  })
export default class NotesBuilder extends React.Component {


    componentWillMount(){

    }

    render() {
        return <div className='sale'>
            <Currency />
            <Content />
            <Aside /> 
        </div>
    }
}