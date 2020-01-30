import React from 'react'

import {connect} from 'react-redux'

@connect((store) => {
    return {

    }
  })
  export default class Update extends React.Component{
      render(){
        return <div className='update heigh100'>
            <div className='update-edit-header'>
                <h1>UPDATE WORKORDER VIEW</h1>
            </div>
        </div>          
      }
  }