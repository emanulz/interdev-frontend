/*
 * Module dependencies
 */
import React from 'react'
import ListComponent from './list/list.jsx'
import Unauthorized from '../../../../../general/unauthorized.jsx'

export default class List extends React.Component {

  // Main Layout
  render() {

    let content = ''

    switch (true) {
      case true:
      {
        content = <ListComponent />
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
