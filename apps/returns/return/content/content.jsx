/*
 * Module dependencies
 */
import React from 'react'

import {connect} from 'react-redux'
import Sale from './sale.jsx'
import Return from './return.jsx'

@connect((store) => {
  return {
    fullWidth: store.preturn.fullWidth
  }
})
export default class Content extends React.Component {

  toggleWidth () {
    this.props.dispatch({type: 'TOGGLE_RETURN_FULL_WIDTH', payload: ''})
  }

  // Main Layout
  render() {
    const contentClass = this.props.fullWidth ? 'return-content fullWidth' : 'return-content'
    const totalClass = this.props.fullWidth ? 'return-content-total' : 'return-content-total collapsed'

    return <div className={contentClass}>
      <div className='return-content-panels' >
        <Sale />
        <Return />
      </div>
      <div className={totalClass} >
        ₡ 0
        <i className='fa fa-chevron-left' onClick={this.toggleWidth.bind(this)} />
      </div>
    </div>

  }

}
