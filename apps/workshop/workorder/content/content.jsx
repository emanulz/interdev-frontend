/*
 * Module dependencies
 */
import React from 'react'

import {connect} from 'react-redux'

@connect((store) => {
    return {
        fullWidth: store.workorder.fullWidth
    }
  })
export default class Main extends React.Component {

    toggleWidth(){
        this.props.dispatch({type: 'TOGGLE_FULL_WIDTH'})
    }

    //Main layout
    render(){

        const contentClass = this.props.fullWidth ? 'workshop-content-fullWidth' : 'workshop-content'
        return <div className={contentClass}>
        B
        </div>
    }
}