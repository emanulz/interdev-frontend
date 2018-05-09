/*
 * Module dependencies
 */
import React from 'react'


import Unauthorized from '../../../../general/unauthorized.jsx'
import {connect} from 'react-redux'

@connect((store) => {
    return {

    }
  })
  export default class List extends React.Component{
 
    render(){
        return <div className='List'>
            <div className='list-header'>
                <h1>LIST WORKORDER VIEW</h1>
            </div>
        </div>
    }

  }