/*
 * Module dependencies
 */
import React from 'react'
// import { checkUserPermissions } from '../../utils/checkPermissions'
import { getItemDispatch } from '../../../utils/api.js'
import Content from './content/content.jsx'
import Aside from './aside/aside.jsx'

import {connect} from 'react-redux'

@connect((store) => {
  return {
  }
})
export default class Sale extends React.Component {

  componentWillMount() {

    const productKwargs = {
      url: '/api/products',
      successType: 'FETCH_PRODUCTS_FULFILLED',
      errorType: 'FETCH_PRODUCTS_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getItemDispatch(productKwargs))

  }
  // *******************************************************************

  // Main Layout
  render() {

    return <div className='inventories-list'>
      <Aside />
      <Content />

    </div>

  }

}
