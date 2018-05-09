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
  export default class Create extends React.Component{
 
    render(){
        return <div className='create heigh100'>
            <div className='create-edit-header'>
                <h1>CREATE WORKORDER VIEW</h1>
            </div>
        </div>
    }

  }