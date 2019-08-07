/*
 * Module dependencies
 */
import React from 'react'
import CreateComponent from './create/main.jsx'
import Unauthorized from '../../../../../general/unauthorized.jsx'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    permissions: store.selfpurchases.permissions
  }
})
export default class List extends React.Component {

  // Main Layout
  render() {

    let content = ''

    switch (true) {
      case true:
      {
        content = <CreateComponent />
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
