/*
 * Module dependencies
 */
import React from 'react'
import ListComponent from './list/list.jsx'


import Unauthorized from '../../../../general/unauthorized.jsx'
import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom'

@connect((store) => {
  return {
    permissions: store.helpers.permissions,
    model: store.helpers.model,
  }
})
class List extends React.Component {

  componentWillMount(){
    const helper_model = this.props.location.pathname.split('/').pop()
    console.log("Helper model ON OTHER--> ", helper_model)

    this.props.dispatch({type: 'SET_HELPER_GROUP', payload: helper_model})
  }


  // Main Layout
  render() {

    let content = ''

    //switch (this.props.permissions.list) {
      switch (true) {
      case true:
      {
        content = <ListComponent/>
        break
      } // case

      case false:
      {
        content = <Unauthorized />
        break
      } // case
      default:
      {
        content = <div />
        break
      } // case
    }

    return <div className='List'>
      {content}
    </div>

  }

}

export default withRouter(List)